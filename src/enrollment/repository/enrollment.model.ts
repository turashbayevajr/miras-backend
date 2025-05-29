export class Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  is_approved?: boolean;
  deletedAt?: Date;
}
