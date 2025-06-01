import { Plan } from '@prisma/client';

export class Course {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  creatorId: string;
  plan: Plan;
  deletedAt: Date | null;
}
