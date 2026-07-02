-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT;

-- CreateTable
CREATE TABLE "DrillLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "drillId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "DrillLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachMessageUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoachMessageUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DrillLog_userId_drillId_idx" ON "DrillLog"("userId", "drillId");

-- CreateIndex
CREATE INDEX "DrillLog_userId_completedAt_idx" ON "DrillLog"("userId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CoachMessageUsage_userId_day_key" ON "CoachMessageUsage"("userId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetToken_key" ON "User"("passwordResetToken");

-- AddForeignKey
ALTER TABLE "DrillLog" ADD CONSTRAINT "DrillLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrillLog" ADD CONSTRAINT "DrillLog_drillId_fkey" FOREIGN KEY ("drillId") REFERENCES "Drill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachMessageUsage" ADD CONSTRAINT "CoachMessageUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
