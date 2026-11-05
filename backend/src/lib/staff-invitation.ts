import { createHash, randomBytes } from "node:crypto";

export const STAFF_INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createStaffInvitationToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashStaffInvitationToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}