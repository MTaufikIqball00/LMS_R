// constants/quizData.ts
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export const SAMPLE_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Question1 (10 points)",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option A",
    points: 10,
  },
  {
    id: 2,
    question: "A True/False sentence: (5 points)",
    options: ["True", "False"],
    correctAnswer: "True",
    points: 5,
  },
  {
    id: 3,
    question: "Yes/No Question (5 points)",
    options: ["Yes", "No"],
    correctAnswer: "Yes",
    points: 5,
  },
  {
    id: 4,
    question: "Why Yes? Please briefly explain the reason:",
    options: ["Reason A", "Reason B", "Reason C", "Reason D"],
    correctAnswer: "Reason A",
    points: 5,
  },
  {
    id: 5,
    question: "Looking at the image above, question? (5 points)",
    options: ["Wrong Answer", "Wrong Answer", "Wrong Answer", "Correct Answer"],
    correctAnswer: "Correct Answer",
    points: 5,
  },
];
