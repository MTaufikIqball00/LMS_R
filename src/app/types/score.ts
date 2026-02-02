// types/score.ts
export interface Score {
  id: number;
  subject: string;
  teacher: string;
  assignments: {
    score: number;
    total: number;
    grade: string;
  };
  quizzes: {
    score: number;
    total: number;
    grade: string;
  };
  exercises: {
    score: number;
    total: number;
    grade: string;
  };
  finalScore: number;
  finalGrade: string;
  semester: string;
}
