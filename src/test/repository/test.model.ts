export class Test {
  id: string;
  title: string;
  lessonId: string;
  questions?: Question[];
  deletedAt: Date | null;

  constructor(
    id: string,
    title: string,
    lessonId: string,
    questions?: Question[],
    deletedAt?: Date,
  ) {
    this.id = id;
    this.title = title;
    this.lessonId = lessonId;
    this.questions = questions;
    this.deletedAt = deletedAt || null;
  }
}

class Question {
  id: string;
  text: string;
  type: string;
  variants: Variant[];
  deletedAt: Date | null;

  constructor(id: string, text: string, type: string, variants: Variant[]) {
    this.id = id;
    this.text = text;
    this.type = type;
    this.variants = variants;
  }
}

class Variant {
  id: string;
  text: string;
  isCorrect: boolean;

  constructor(id: string, text: string, isCorrect: boolean) {
    this.id = id;
    this.text = text;
    this.isCorrect = isCorrect;
  }
}
