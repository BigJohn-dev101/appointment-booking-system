ALTER TABLE "BusinessStaff"
ADD COLUMN "title" TEXT;

CREATE TABLE "StaffInvitation" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT,
    "title" TEXT,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffInvitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StaffInvitation_tokenHash_key" ON "StaffInvitation"("tokenHash");
CREATE INDEX "StaffInvitation_businessId_acceptedAt_expiresAt_idx" ON "StaffInvitation"("businessId", "acceptedAt", "expiresAt");
CREATE INDEX "StaffInvitation_email_idx" ON "StaffInvitation"("email");

ALTER TABLE "StaffInvitation"
ADD CONSTRAINT "StaffInvitation_businessId_fkey"
FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;