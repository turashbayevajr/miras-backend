import { Homework } from 'src/homework/repository/homework.model';
import { Test } from 'src/test/repository/test.model';

export class Lesson {
  id: string;
  title: string;
  content: string;
  courseId: string;
  url?: string;
  createdAt: Date;
  deletedAt?: Date;
  test?: Test;
  homework?: Homework;
}
