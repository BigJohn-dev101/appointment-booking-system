import crypto from "node:crypto";
import prisma from "../lib/prisma.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./email.service.js";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;

function hashOtp(code: string): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return crypto.createHmac("sha256", secret).update(code).digest("hex");
}

export function otpMatches(code: string, storedHash: string): boolean {
  const a = Buffer.from(hashOtp(code), "hex");
  const b = Buffer.from(storedHash, "hex");

  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// The send time is derived from the expiry, so no extra column is needed
export function getCooldownRemainingMs(otpExpiresAt: Date | null): number {
  if (!otpExpiresAt) return 0;

  const sentAt = otpExpiresAt.getTime() - OTP_TTL_MS;

  return Math.max(0, sentAt + OTP_RESEND_COOLDOWN_MS - Date.now());
}

export async function issueOtp(user: {
  id: string;
  email: string;
  firstName: string;
}): Promise<void> {
  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  const otpCode = hashOtp(code);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otpCode,
      otpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
      otpAttempts: 0,
    },
  });

  try {
    await sendVerificationEmail(user.email, user.firstName, code);
  } catch (error) {
    await prisma.user.updateMany({
      where: { id: user.id, otpCode },
      data: {
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0,
      },
    });

    throw error;
  }
}

export async function issuePasswordResetOtp(user: {
  id: string;
  email: string;
  firstName: string;
}): Promise<void> {
  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  const passwordResetCode = hashOtp(code);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetCode,
      passwordResetExpiresAt: new Date(Date.now() + OTP_TTL_MS),
      passwordResetAttempts: 0,
    },
  });

  try {
    await sendPasswordResetEmail(user.email, user.firstName, code);
  } catch (error) {
    await prisma.user.updateMany({
      where: { id: user.id, passwordResetCode },
      data: {
        passwordResetCode: null,
        passwordResetExpiresAt: null,
        passwordResetAttempts: 0,
      },
    });

    throw error;
  }
}