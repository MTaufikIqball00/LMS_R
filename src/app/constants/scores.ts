import { Score } from "../types/score";

export const SCORES: Score[] = [
  {
    id: 1,
    subject: "Matematika",
    teacher: "Dr. Ahmad Wijaya",
    assignments: {
      score: 85,
      total: 100,
      grade: "A-",
    },
    quizzes: {
      score: 90,
      total: 100,
      grade: "A",
    },
    exercises: {
      score: 88,
      total: 100,
      grade: "A-",
    },
    finalScore: 87.7,
    finalGrade: "A-",
    semester: "Ganjil 2025",
  },
  {
    id: 2,
    subject: "Fisika",
    teacher: "Prof. Siti Nurhaliza",
    assignments: {
      score: 78,
      total: 100,
      grade: "B+",
    },
    quizzes: {
      score: 82,
      total: 100,
      grade: "A-",
    },
    exercises: {
      score: 80,
      total: 100,
      grade: "B+",
    },
    finalScore: 80,
    finalGrade: "B+",
    semester: "Ganjil 2025",
  },
  {
    id: 3,
    subject: "Bahasa Inggris",
    teacher: "Ms. Sarah Johnson",
    assignments: {
      score: 92,
      total: 100,
      grade: "A",
    },
    quizzes: {
      score: 88,
      total: 100,
      grade: "A-",
    },
    exercises: {
      score: 90,
      total: 100,
      grade: "A",
    },
    finalScore: 90,
    finalGrade: "A",
    semester: "Ganjil 2025",
  },
];
