import { Homework } from "../../homework/repository/homework.model";
import { Test } from "../../test/repository/test.model";

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
  passed?: boolean;
  submittedAt: Date;
  deletedAt?: Date;
  homework?: Homework;
  test?: Test;
}
