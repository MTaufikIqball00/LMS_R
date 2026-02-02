import { CourseDetails, Lesson, Module } from "../../types/dashboard";

const courseData: Record<string, CourseDetails> = {
  matematika: {
    title: "Matematika",
    description:
      "Mempelajari konsep-konsep dasar matematika, aljabar, geometri, dan kalkulus.",
    teacher: "Ibu Siti",
    modules: [
      {
        title: "Modul 1: Aljabar Linear",
        isLocked: false,
        lessons: [
          {
            title: "Pengenalan Vektor",
            type: "video",
            duration: "15:30",
            isCompleted: true,
          },
          {
            title: "Operasi Matriks",
            type: "text",
            duration: "20 menit",
            isCompleted: true,
          },
          {
            title: "Quiz: Aljabar",
            type: "quiz",
            duration: "10 soal",
            isCompleted: false,
          },
        ],
      },
      {
        title: "Modul 2: Kalkulus Diferensial",
        isLocked: false,
        lessons: [
          {
            title: "Konsep Turunan",
            type: "video",
            duration: "25:10",
            isCompleted: false,
          },
          {
            title: "Aturan Rantai",
            type: "text",
            duration: "30 menit",
            isCompleted: false,
          },
          {
            title: "Latihan Soal Turunan",
            type: "assignment",
            duration: "5 soal",
            isCompleted: false,
          },
        ],
      },
      {
        title: "Modul 3: Geometri Ruang",
        isLocked: true,
        lessons: [],
      },
    ],
  },
  fisika: {
    title: "Fisika",
    description: "Mempelajari hukum-hukum dasar alam semesta.",
    teacher: "Bapak Budi",
    modules: [
      {
        title: "Modul 1: Kinematika Gerak Lurus",
        isLocked: false,
        lessons: [
          {
            title: "Jarak dan Perpindahan",
            type: "video",
            duration: "12:00",
            isCompleted: true,
          },
          {
            title: "Kecepatan dan Kelajuan",
            type: "text",
            duration: "15 menit",
            isCompleted: false,
          },
        ],
      },
    ],
  },
  "bahasa-indonesia": {
    title: "bahasa-indonesia",
    description: "Pelajari kaidah bahasa, sastra, dan keterampilan berbahasa.",
    teacher: "Ibu Dewi",
    modules: [
      {
        title: "Modul 1: Tata Bahasa",
        isLocked: false,
        lessons: [
          {
            title: "Kata Benda dan Kata Kerja",
            type: "text",
            duration: "25 menit",
            isCompleted: false,
          },
          {
            title: "Membaca Pemahaman",
            type: "assignment",
            duration: "10 soal",
            isCompleted: false,
          },
        ],
      },
    ],
  },
  "bahasa-inggris": {
    title: "Bahasa Inggris",
    description:
      "Pelajari konsep Bahasa Inggris untuk komunikasi dan akademik.",
    teacher: "Mr. John",
    modules: [
      {
        title: "Modul 1: Vocabulary",
        isLocked: false,
        lessons: [
          {
            title: "Basic Words",
            type: "video",
            duration: "10:20",
            isCompleted: true,
          },
          {
            title: "Grammar Dasar",
            type: "text",
            duration: "20 menit",
            isCompleted: false,
          },
        ],
      },
    ],
  },
  kimia: {
    title: "Kimia",
    description: "Pelajari struktur atom, reaksi kimia, dan aplikasinya.",
    teacher: "Ibu Ratna",
    modules: [
      {
        title: "Modul 1: Struktur Atom",
        isLocked: false,
        lessons: [
          {
            title: "Partikel Penyusun Atom",
            type: "video",
            duration: "18:00",
            isCompleted: false,
          },
          {
            title: "Konfigurasi Elektron",
            type: "text",
            duration: "25 menit",
            isCompleted: false,
          },
        ],
      },
    ],
  },
  biologi: {
    title: "Biologi",
    description: "Pelajari tentang makhluk hidup, ekosistem, dan genetika.",
    teacher: "Bapak Andi",
    modules: [
      {
        title: "Modul 1: Sel dan Jaringan",
        isLocked: false,
        lessons: [
          {
            title: "Struktur Sel",
            type: "video",
            duration: "20:15",
            isCompleted: false,
          },
          {
            title: "Fungsi Jaringan",
            type: "text",
            duration: "15 menit",
            isCompleted: false,
          },
        ],
      },
    ],
  },
  ppkn: {
    title: "PPKn",
    description: "Pahami Pancasila, kewarganegaraan, dan nilai kebangsaan.",
    teacher: "Ibu Rina",
    modules: [
      {
        title: "Modul 1: Pancasila",
        isLocked: false,
        lessons: [
          {
            title: "Sejarah Pancasila",
            type: "text",
            duration: "30 menit",
            isCompleted: false,
          },
          {
            title: "Nilai Dasar Pancasila",
            type: "assignment",
            duration: "5 soal",
            isCompleted: false,
          },
        ],
      },
    ],
  },
  informatika: {
    title: "Informatika",
    description: "Pelajari dasar-dasar komputer, pemrograman, dan teknologi.",
    teacher: "Bapak Arif",
    modules: [
      {
        title: "Modul 1: Pengenalan Komputer",
        isLocked: false,
        lessons: [
          {
            title: "Hardware dan Software",
            type: "video",
            duration: "12:30",
            isCompleted: false,
          },
          {
            title: "Sejarah Komputer",
            type: "text",
            duration: "15 menit",
            isCompleted: false,
          },
        ],
      },
    ],
  },

  // Add other subjects here...
};

export const getCourse = (slug: string): CourseDetails | undefined => {
  return courseData[slug];
};

export const getAllCourses = (): Record<string, CourseDetails> => {
  return courseData;
};
