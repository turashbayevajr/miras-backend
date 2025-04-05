-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "score_homework" DOUBLE PRECISION,
ADD COLUMN     "score_test" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "AdminAnalyticsSnapshot" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "plan" "Plan" NOT NULL,
    "userCount" INTEGER NOT NULL,
    "courseCount" INTEGER NOT NULL,
    "lessonCount" INTEGER NOT NULL,
    "submissionCount" INTEGER NOT NULL,

    CONSTRAINT "AdminAnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);
