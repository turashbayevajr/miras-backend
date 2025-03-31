export class Submission {
    id: string;
    userId: string;
    homeworkId?: string | null;
    testId?: string | null;
    content: string;
    score?: number | null;
    submittedAt: Date;
    deletedAt?: Date;
  }
  