CREATE TABLE "BusinessAvailability" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessAvailability_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BusinessAvailability_businessId_dayOfWeek_key" ON "BusinessAvailability"("businessId", "dayOfWeek");
CREATE INDEX "BusinessAvailability_dayOfWeek_idx" ON "BusinessAvailability"("dayOfWeek");

ALTER TABLE "BusinessAvailability"
ADD CONSTRAINT "BusinessAvailability_businessId_fkey"
FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;