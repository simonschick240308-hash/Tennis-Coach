-- AlterTable
ALTER TABLE "TrainingSession" ADD COLUMN     "whoopWorkoutId" TEXT;

-- CreateTable
CREATE TABLE "WhoopConnection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "whoopUserId" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhoopConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhoopConnection_userId_key" ON "WhoopConnection"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingSession_whoopWorkoutId_key" ON "TrainingSession"("whoopWorkoutId");

-- AddForeignKey
ALTER TABLE "WhoopConnection" ADD CONSTRAINT "WhoopConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

