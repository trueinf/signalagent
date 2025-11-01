-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "aiInsight" TEXT;
ALTER TABLE "Lead" ADD COLUMN "buyerRole" TEXT;
ALTER TABLE "Lead" ADD COLUMN "contactTitle" TEXT;
ALTER TABLE "Lead" ADD COLUMN "industry" TEXT;
ALTER TABLE "Lead" ADD COLUMN "intentScore" INTEGER DEFAULT 0;
ALTER TABLE "Lead" ADD COLUMN "lastSyncedAt" DATETIME;
ALTER TABLE "Lead" ADD COLUMN "signalTrail" TEXT;
ALTER TABLE "Lead" ADD COLUMN "sourceType" TEXT;

-- CreateIndex
CREATE INDEX "Lead_intentScore_idx" ON "Lead"("intentScore");

-- CreateIndex
CREATE INDEX "Lead_sourceType_idx" ON "Lead"("sourceType");
