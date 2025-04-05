-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "testAnswers" JSONB,
ALTER COLUMN "content" DROP NOT NULL;
