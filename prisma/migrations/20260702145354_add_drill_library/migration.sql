-- CreateEnum
CREATE TYPE "DrillCategory" AS ENUM ('FOREHAND', 'BACKHAND', 'SERVE', 'RETURN', 'VOLLEY', 'APPROACH', 'FOOTWORK', 'TACTICS');

-- CreateEnum
CREATE TYPE "DrillDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "Drill" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "DrillCategory" NOT NULL,
    "difficulty" "DrillDifficulty" NOT NULL,
    "situation" TEXT NOT NULL,
    "setup" TEXT NOT NULL,
    "execution" TEXT NOT NULL,
    "coachingCue" TEXT NOT NULL,
    "reps" TEXT NOT NULL,
    "focusTags" TEXT[],
    "videoQuery" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Drill_category_idx" ON "Drill"("category");
