export interface QuizQuestion {
  id?: string;
  text?: string;
  options?: string[];
  correctAnswer?: string;
  points?: number;
}

export interface QuizProps {
  questions: QuizQuestion[];
  title: string;
  onComplete: (results: QuizResultss) => void;
}

export interface QuizResultss {
  score: number;
  totalPoints: number;
  percentage: number;
  answers: (string | null)[];
  correctAnswers: number;
  wrongAnswers: number;
}
