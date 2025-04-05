export class Submission {
    id: string;
    userId: string;
    homeworkId?: string | null;
    testId?: string | null;
    content?: string;
    score?: number | null;
    score_homework?: number | null;
    score_test?: number | null;
    testAnswers?: Record<string, string[]>;
    submittedAt: Date;
    deletedAt?: Date;
  }
  