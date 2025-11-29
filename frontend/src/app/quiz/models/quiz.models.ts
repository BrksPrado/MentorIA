export interface Alternative {
  letter: string;
  text: string;
  file?: string;
  isCorrect: boolean;
}

export interface Question {
  index: number;
  context: string;
  discipline: string;
  language: string | null;
  year: number;
  correctAlternative: string;
  alternativesIntroduction: string;
  alternatives: Alternative[];
}

export interface QuestionResponse {
  questions: Question[];
}

export interface Discipline {
  label: string;
  value: string;
}

export interface Exam {
  title: string;
  year: number;
  disciplines: Discipline[];
}
