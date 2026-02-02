export interface Tugas {
  id: number;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded" | "overdue";
  priority: "low" | "medium" | "high";
  points: number;
  type: "essay" | "quiz" | "project" | "presentation";
  attachments?: number;
  submittedAt?: string;
  grade?: number;
  feedback?: string;
  quizDibuka?: string | null;
  quizDitutup?: string | null;
}

export const TUGAS_DATA: Tugas[] = [
  {
    id: 1,
    title: "Analisis Fungsi Kuadrat",
    description:
      "Buat analisis lengkap tentang fungsi kuadrat dengan contoh soal dan penyelesaian",
    subject: "Matematika",
    dueDate: "2025-09-15",
    status: "pending",
    priority: "high",
    points: 100,
    type: "essay",
    attachments: 2,
  },
  {
    id: 2,
    title: "Quiz Hukum Newton",
    description: "Kuis online tentang hukum-hukum Newton dalam fisika",
    subject: "Fisika",
    dueDate: "2025-09-22",
    status: "pending",
    priority: "medium",
    points: 100,
    type: "quiz",
    quizDibuka: "2025-09-22T09:00:00",
    quizDitutup: "2025-09-22T10:00:00",
  },
  {
    id: 3,
    title: "Proyek Reaksi Kimia",
    description:
      "Buat proyek praktikum tentang reaksi kimia dengan laporan lengkap",
    subject: "Kimia",
    dueDate: "2025-09-20",
    status: "graded",
    priority: "high",
    points: 150,
    type: "project",
    attachments: 5,
    submittedAt: "2024-01-18",
    grade: 85,
    feedback: "Kerja bagus! Laporan sangat detail dan analisis mendalam.",
  },
  {
    id: 4,
    title: "Presentasi Sejarah Indonesia",
    description: "Presentasi tentang perjuangan kemerdekaan Indonesia",
    subject: "Sejarah",
    dueDate: "2025-09-08",
    status: "overdue",
    priority: "high",
    points: 75,
    type: "presentation",
    attachments: 3,
  },
  {
    id: 5,
    title: "Essay Global Warming",
    description: "Tulis essay 1000 kata tentang dampak global warming",
    subject: "Bahasa Inggris",
    dueDate: "2025-09-14",
    status: "pending",
    priority: "medium",
    points: 80,
    type: "essay",
  },
  {
    id: 6,
    title: "Quiz Grammar",
    description: "Kuis online tentang tenses dalam bahasa Inggris",
    subject: "Bahasa Inggris",
    dueDate: "2025-09-22",
    status: "pending",
    priority: "low",
    points: 40,
    type: "quiz",
    quizDibuka: "2025-09-10T09:00:00", // ✅ Tambahkan
    quizDitutup: "2025-09-22T15:30:00", // ✅ Tambahkan
  },
];
export const TUGAS_STATS = {
  total: TUGAS_DATA.length,
  pending: TUGAS_DATA.filter((t) => t.status === "pending").length,
  submitted: TUGAS_DATA.filter((t) => t.status === "submitted").length,
  graded: TUGAS_DATA.filter((t) => t.status === "graded").length,
  overdue: TUGAS_DATA.filter((t) => t.status === "overdue").length,
};
