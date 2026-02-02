// This file acts as a mock in-memory database for quizzes.

export type QuestionType = "multiple_choice" | "essay";

// Represents a single choice in a multiple-choice question
export interface AnswerChoice {
  id: string;
  text: string;
}

// Represents a single question in a quiz
export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  choices?: AnswerChoice[]; // Only for multiple_choice
  correctAnswer?: string; // For multiple_choice, this is the ID of the correct AnswerChoice. For essay, it's null.
  points?: number; // Points for this question
  sampleAnswer?: string; // For essay
  maxScore?: number; // For essay
  weight?: number; // For essay
  rubric?: string; // For essay
}

// ✅ Enhanced Quiz interface with missing properties
export interface Quiz {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  subject: string;
  questions: Question[];
  createdAt: string;
  updatedAt?: string;
  // ✅ Added missing properties
  participants?: number; // Number of students who participated
  isActive: boolean; // Whether quiz is currently active
  averageScore?: number; // Average score percentage
  duration: number; // Duration in minutes
  // Additional useful properties
  maxAttempts?: number; // Maximum attempts allowed per student
  showResults?: boolean; // Whether to show results immediately after submission
  randomizeQuestions?: boolean; // Whether to randomize question order
  passingScore?: number; // Minimum score to pass (percentage)
  startDate?: string; // When quiz becomes available
  endDate?: string; // When quiz expires
  instructions?: string; // Additional instructions for students
  totalPoints?: number; // Total points possible
  allowReview?: boolean; // Allow students to review answers
  shuffleAnswers?: boolean; // Shuffle multiple choice answers
}

// Represents a student's answer to a single question
export interface StudentAnswer {
  questionId: string;
  answerText?: string; // For essay
  selectedChoiceId?: string; // For multiple_choice
  isCorrect?: boolean; // Whether the answer is correct
  points?: number; // Points earned for this answer
}

// ✅ Enhanced QuizSubmission interface
export interface QuizSubmission {
  submissionId: string;
  quizId: string;
  studentId: string;
  studentName: string;
  answers: StudentAnswer[];
  submittedAt: string;
  grade: number | null;
  // Additional properties
  score?: number; // Score as percentage
  totalPoints?: number; // Total points earned
  maxPoints?: number; // Maximum points possible
  timeSpent?: number; // Time spent in minutes
  attemptNumber?: number; // Which attempt this is
  feedback?: string; // Teacher feedback
  autoGraded?: boolean; // Whether it was auto-graded
  reviewedBy?: string; // Teacher who reviewed
  reviewedAt?: string; // When it was reviewed
}

// ✅ Quiz Statistics interface
export interface QuizStats {
  quizId: string;
  totalSubmissions: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  participationRate: number; // percentage of enrolled students who participated
  questionStats: {
    questionId: string;
    correctAnswers: number;
    totalAnswers: number;
    difficultyLevel: "easy" | "medium" | "hard"; // based on correct answer percentage
  }[];
}

// In-memory storage using Maps
export const quizzes = new Map<string, Quiz>();
export const quizSubmissions = new Map<string, QuizSubmission>();

// --- Enhanced Seed Data for Development ---

const seedQuizId1 = "quiz-mtk-01";
quizzes.set(seedQuizId1, {
  id: seedQuizId1,
  teacherId: "2", // guru@sekolah.id
  title: "Kuis Dasar Aljabar",
  description:
    "Kuis singkat untuk menguji pemahaman dasar aljabar dan operasi matematika dasar.",
  subject: "Matematika",
  createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  participants: 24,
  isActive: true,
  averageScore: 78.5,
  duration: 45,
  maxAttempts: 2,
  showResults: true,
  randomizeQuestions: false,
  passingScore: 70,
  instructions:
    "Baca soal dengan teliti. Untuk soal pilihan ganda, pilih jawaban yang paling tepat. Untuk soal essay, berikan penjelasan yang lengkap.",
  totalPoints: 100,
  allowReview: true,
  shuffleAnswers: true,
  questions: [
    {
      id: "q1",
      questionText: "Sederhanakan ekspresi berikut: 2x + 3y - x + 2y",
      questionType: "multiple_choice",
      points: 20,
      choices: [
        { id: "q1c1", text: "x + 5y" },
        { id: "q1c2", text: "3x + 5y" },
        { id: "q1c3", text: "x - 5y" },
        { id: "q1c4", text: "3x - y" },
      ],
      correctAnswer: "q1c1",
    },
    {
      id: "q2",
      questionText:
        "Apa itu variabel dalam konteks aljabar? Berikan contoh dan penjelasan.",
      questionType: "essay",
      points: 30,
    },
    {
      id: "q3",
      questionText: "Jika x = 3 dan y = 2, berapakah nilai dari 2x² + 3y - 4?",
      questionType: "multiple_choice",
      points: 25,
      choices: [
        { id: "q3c1", text: "16" },
        { id: "q3c2", text: "20" },
        { id: "q3c3", text: "18" },
        { id: "q3c4", text: "14" },
      ],
      correctAnswer: "q3c2", // 2(9) + 6 - 4 = 20
    },
    {
      id: "q4",
      questionText:
        "Selesaikan persamaan: 3x + 7 = 22. Tunjukkan langkah-langkahnya!",
      questionType: "essay",
      points: 25,
    },
  ],
});

const seedQuizId2 = "quiz-bio-01";
quizzes.set(seedQuizId2, {
  id: seedQuizId2,
  teacherId: "2",
  title: "Sistem Pencernaan Manusia",
  description:
    "Evaluasi pemahaman tentang organ dan proses pencernaan dalam tubuh manusia.",
  subject: "Biologi",
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  participants: 28,
  isActive: true,
  averageScore: 82.3,
  duration: 60,
  maxAttempts: 1,
  showResults: false,
  randomizeQuestions: true,
  passingScore: 75,
  totalPoints: 100,
  allowReview: false,
  shuffleAnswers: true,
  questions: [
    {
      id: "bio1",
      questionText:
        "Organ manakah yang berfungsi menyerap nutrisi dalam sistem pencernaan?",
      questionType: "multiple_choice",
      points: 25,
      choices: [
        { id: "bio1c1", text: "Lambung" },
        { id: "bio1c2", text: "Usus halus" },
        { id: "bio1c3", text: "Usus besar" },
        { id: "bio1c4", text: "Kerongkongan" },
      ],
      correctAnswer: "bio1c2",
    },
    {
      id: "bio2",
      questionText:
        "Jelaskan proses pencernaan protein mulai dari mulut hingga diserap oleh tubuh!",
      questionType: "essay",
      points: 35,
    },
    {
      id: "bio3",
      questionText: "Enzim apa yang terdapat dalam saliva?",
      questionType: "multiple_choice",
      points: 20,
      choices: [
        { id: "bio3c1", text: "Pepsin" },
        { id: "bio3c2", text: "Amilase" },
        { id: "bio3c3", text: "Lipase" },
        { id: "bio3c4", text: "Tripsin" },
      ],
      correctAnswer: "bio3c2",
    },
    {
      id: "bio4",
      questionText:
        "Apa fungsi empedu dalam proses pencernaan dan di mana empedu diproduksi?",
      questionType: "essay",
      points: 20,
    },
  ],
});

const seedQuizId3 = "quiz-fis-01";
quizzes.set(seedQuizId3, {
  id: seedQuizId3,
  teacherId: "2",
  title: "Hukum Newton dan Gerak",
  description:
    "Kuis tentang tiga hukum Newton dan aplikasinya dalam kehidupan sehari-hari.",
  subject: "Fisika",
  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  participants: 22,
  isActive: false, // Not active anymore
  averageScore: 71.8,
  duration: 50,
  maxAttempts: 3,
  showResults: true,
  randomizeQuestions: false,
  passingScore: 65,
  totalPoints: 100,
  allowReview: true,
  shuffleAnswers: false,
  questions: [
    {
      id: "fis1",
      questionText: "Hukum I Newton menyatakan bahwa...",
      questionType: "multiple_choice",
      points: 25,
      choices: [
        { id: "fis1c1", text: "F = m × a" },
        {
          id: "fis1c2",
          text: "Benda akan tetap diam atau bergerak lurus beraturan jika tidak ada gaya luar",
        },
        {
          id: "fis1c3",
          text: "Untuk setiap aksi ada reaksi yang sama dan berlawanan",
        },
        { id: "fis1c4", text: "Momentum kekal" },
      ],
      correctAnswer: "fis1c2",
    },
    {
      id: "fis2",
      questionText:
        "Sebuah mobil bermassa 1000 kg mengalami percepatan 2 m/s². Berapa gaya yang diperlukan? Jelaskan perhitungannya!",
      questionType: "essay",
      points: 30,
    },
  ],
});

// Sample submissions
const seedSubmissionId1 = "quizsub-01";
quizSubmissions.set(seedSubmissionId1, {
  submissionId: seedSubmissionId1,
  quizId: seedQuizId1,
  studentId: "1", // murid@sekolah.id
  studentName: "Siswa Rajin",
  submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  grade: 85,
  score: 85,
  totalPoints: 85,
  maxPoints: 100,
  timeSpent: 35,
  attemptNumber: 1,
  autoGraded: false,
  answers: [
    {
      questionId: "q1",
      selectedChoiceId: "q1c1", // Correct answer
      isCorrect: true,
      points: 20,
    },
    {
      questionId: "q2",
      answerText:
        "Variabel adalah simbol, biasanya huruf, yang mewakili suatu nilai yang tidak diketahui atau dapat berubah. Contoh: dalam persamaan x + 5 = 10, x adalah variabel yang nilainya 5.",
      isCorrect: true,
      points: 25, // Partial credit
    },
    {
      questionId: "q3",
      selectedChoiceId: "q3c2", // Correct answer
      isCorrect: true,
      points: 25,
    },
    {
      questionId: "q4",
      answerText: "3x + 7 = 22\n3x = 22 - 7\n3x = 15\nx = 15/3\nx = 5",
      isCorrect: true,
      points: 15, // Partial credit for minor presentation issues
    },
  ],
});

// ✅ Helper functions for quiz management
export const getQuizzesByTeacherId = (teacherId: string): Quiz[] => {
  return Array.from(quizzes.values())
    .filter((quiz) => quiz.teacherId === teacherId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getQuizById = (quizId: string): Quiz | undefined => {
  return quizzes.get(quizId);
};

export const createQuiz = (
  quizData: Omit<Quiz, "id" | "createdAt" | "updatedAt">
): Quiz => {
  const quizId = `quiz-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
  const now = new Date().toISOString();

  const newQuiz: Quiz = {
    id: quizId,
    ...quizData,
    createdAt: now,
    updatedAt: now,
    participants: 0,
    averageScore: 0,
    isActive: true,
  };

  quizzes.set(quizId, newQuiz);
  return newQuiz;
};

export const updateQuiz = (
  quizId: string,
  updates: Partial<Quiz>
): Quiz | null => {
  const existingQuiz = quizzes.get(quizId);
  if (!existingQuiz) return null;

  const updatedQuiz: Quiz = {
    ...existingQuiz,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  quizzes.set(quizId, updatedQuiz);
  return updatedQuiz;
};

export const deleteQuiz = (quizId: string): boolean => {
  return quizzes.delete(quizId);
};

export const getSubmissionsByQuizId = (quizId: string): QuizSubmission[] => {
  return Array.from(quizSubmissions.values())
    .filter((submission) => submission.quizId === quizId)
    .sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
};

export const calculateQuizStats = (quizId: string): QuizStats | null => {
  const quiz = quizzes.get(quizId);
  if (!quiz) return null;

  const submissions = getSubmissionsByQuizId(quizId);
  const scores = submissions.map((s) => s.score || 0).filter((s) => s > 0);

  return {
    quizId,
    totalSubmissions: submissions.length,
    averageScore:
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
    highestScore: scores.length > 0 ? Math.max(...scores) : 0,
    lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
    participationRate: quiz.participants
      ? (submissions.length / quiz.participants) * 100
      : 0,
    questionStats: quiz.questions.map((q) => ({
      questionId: q.id,
      correctAnswers: submissions.filter((s) =>
        s.answers.find((a) => a.questionId === q.id && a.isCorrect)
      ).length,
      totalAnswers: submissions.filter((s) =>
        s.answers.find((a) => a.questionId === q.id)
      ).length,
      difficultyLevel: "medium" as const, // This would be calculated based on correct percentage
    })),
  };
};

export default quizzes;
