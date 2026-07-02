-- DropIndex
DROP INDEX "User_passwordResetToken_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordResetExpires",
DROP COLUMN "passwordResetToken",
ADD COLUMN     "recoveryCodeHash" TEXT;

