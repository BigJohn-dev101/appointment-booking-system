import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const firstName = process.env.ADMIN_FIRST_NAME?.trim() || "Admin";
  const lastName = process.env.ADMIN_LAST_NAME?.trim() || "User";

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running this script.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("ADMIN_EMAIL must be a valid email address.");
  }

  if (
    password.length < 8 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  ) {
    throw new Error(
      "ADMIN_PASSWORD must have at least 8 characters, uppercase and lowercase letters, a number, and a special character.",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date();

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      firstName,
      lastName,
      role: "ADMIN",
      isVerified: true,
      otpCode: null,
      otpExpiresAt: null,
      otpAttempts: 0,
      termsAcceptedAt: now,
    },
    create: {
      email,
      passwordHash,
      firstName,
      lastName,
      role: "ADMIN",
      isVerified: true,
      termsAcceptedAt: now,
    },
    select: { email: true },
  });

  console.log(`Admin account ready for ${admin.email}.`);
}

main()
  .catch((error) => {
    console.error("Admin seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });