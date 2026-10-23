ALTER TABLE "User"
ADD COLUMN "otpAttempts" INTEGER NOT NULL DEFAULT 0;

UPDATE "User" SET "isVerified" = true;