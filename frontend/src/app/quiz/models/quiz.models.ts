// Interface para uma alternativa de uma questão
export interface Alternative {
  letter: string;
  text: string;
  file?: string;
  isCorrect: boolean;
}

// Interface para uma questão completa
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

// Interface para a resposta paginada que vem do backend
export interface QuestionResponse {
  questions: Question[];
}

// Interface para a disciplina dentro de uma prova
export interface Discipline {
  label: string;
  value: string;
}

// Interface para uma prova (ano e disciplinas)
export interface Exam {
  title: string;
  year: number;
  disciplines: Discipline[];
}
