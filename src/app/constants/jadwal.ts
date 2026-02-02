export interface JadwalItem {
  id: number;
  subject: string;
  teacher: string;
  time: string;
  duration: number; // in minutes
  room: string;
  type: "theory" | "practical" | "exam" | "assignment";
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  week: number;
  description?: string;
  materials?: string[];
  isActive: boolean;
}

export interface JadwalDay {
  day: string;
  dayName: string;
  date: string;
  schedules: JadwalItem[];
}

export const JADWAL_DATA: JadwalItem[] = [
  // === SENIN ===
  {
    id: 1,
    subject: "Matematika",
    teacher: "Dr. Ahmad Wijaya",
    time: "07:00",
    duration: 90,
    room: "A-101",
    type: "theory",
    day: "monday",
    week: 1,
    description: "Fungsi Kuadrat dan Grafik",
    materials: ["Buku Matematika", "Kalkulator"],
    isActive: true,
  },
  {
    id: 2,
    subject: "Fisika",
    teacher: "Prof. Siti Nurhaliza",
    time: "09:00",
    duration: 90,
    room: "Lab-201",
    type: "practical",
    day: "monday",
    week: 1,
    description: "Praktikum Hukum Newton",
    materials: ["Alat Praktikum", "Laporan"],
    isActive: true,
  },
  {
    id: 3,
    subject: "Bahasa Indonesia",
    teacher: "Dr. Maya Sari",
    time: "11:00",
    duration: 90,
    room: "B-301",
    type: "theory",
    day: "monday",
    week: 1,
    description: "Karya Sastra dan Puisi",
    materials: ["Buku Sastra", "Kamus"],
    isActive: true,
  },

  // === SELASA ===
  {
    id: 4,
    subject: "Bahasa Inggris",
    teacher: "Ms. Sarah Johnson",
    time: "08:00",
    duration: 90,
    room: "B-302",
    type: "theory",
    day: "tuesday",
    week: 1,
    description: "Grammar dan Vocabulary",
    materials: ["English Book", "Dictionary"],
    isActive: true,
  },
  {
    id: 5,
    subject: "Kimia",
    teacher: "Dr. Budi Santoso",
    time: "10:00",
    duration: 90,
    room: "Lab-202",
    type: "practical",
    day: "tuesday",
    week: 1,
    description: "Reaksi Kimia Dasar",
    materials: ["Alat Lab", "Bahan Kimia"],
    isActive: true,
  },
  {
    id: 6,
    subject: "PPKn",
    teacher: "Prof. Rina Dewi",
    time: "14:00",
    duration: 60,
    room: "C-401",
    type: "theory",
    day: "tuesday",
    week: 1,
    description: "Pancasila dan Kewarganegaraan",
    materials: ["Buku PPKn", "UUD 1945"],
    isActive: true,
  },

  // === RABU ===
  {
    id: 7,
    subject: "Biologi",
    teacher: "Dr. Diana Kusuma",
    time: "07:30",
    duration: 90,
    room: "Lab-203",
    type: "practical",
    day: "wednesday",
    week: 1,
    description: "Sistem Organ Manusia",
    materials: ["Mikroskop", "Preparat"],
    isActive: true,
  },
  {
    id: 8,
    subject: "Matematika",
    teacher: "Dr. Ahmad Wijaya",
    time: "09:30",
    duration: 90,
    room: "A-102",
    type: "assignment",
    day: "wednesday",
    week: 1,
    description: "Pembahasan Tugas Integral",
    materials: ["Tugas", "Kalkulator"],
    isActive: true,
  },
  {
    id: 9,
    subject: "Informatika",
    teacher: "Prof. Andi Kurniawan",
    time: "11:30",
    duration: 90,
    room: "Lab-Komputer",
    type: "practical",
    day: "wednesday",
    week: 1,
    description: "Pemrograman Python Dasar",
    materials: ["Laptop", "Software"],
    isActive: true,
  },

  // === KAMIS ===
  {
    id: 10,
    subject: "Fisika",
    teacher: "Prof. Siti Nurhaliza",
    time: "08:00",
    duration: 90,
    room: "A-201",
    type: "exam",
    day: "thursday",
    week: 1,
    description: "Ujian Tengah Semester",
    materials: ["Kalkulator", "Pensil"],
    isActive: true,
  },
  {
    id: 11,
    subject: "Bahasa Indonesia",
    teacher: "Dr. Maya Sari",
    time: "10:00",
    duration: 60,
    room: "B-303",
    type: "theory",
    day: "thursday",
    week: 1,
    description: "Teks Argumentasi",
    materials: ["Buku Teks", "Artikel"],
    isActive: true,
  },
  {
    id: 12,
    subject: "Bahasa Inggris",
    teacher: "Ms. Sarah Johnson",
    time: "14:00",
    duration: 60,
    room: "B-304",
    type: "assignment",
    day: "thursday",
    week: 1,
    description: "Presentasi Speaking",
    materials: ["PowerPoint", "Notes"],
    isActive: true,
  },

  // === JUMAT ===
  {
    id: 13,
    subject: "Kimia",
    teacher: "Dr. Budi Santoso",
    time: "07:00",
    duration: 90,
    room: "Lab-202",
    type: "practical",
    day: "friday",
    week: 1,
    description: "Praktikum Asam Basa",
    materials: ["Alat Lab", "Indikator"],
    isActive: true,
  },
  {
    id: 14,
    subject: "PPKn",
    teacher: "Prof. Rina Dewi",
    time: "09:00",
    duration: 60,
    room: "C-402",
    type: "theory",
    day: "friday",
    week: 1,
    description: "Demokrasi dan HAM",
    materials: ["Buku PPKn", "Konstitusi"],
    isActive: true,
  },
  {
    id: 15,
    subject: "Biologi",
    teacher: "Dr. Diana Kusuma",
    time: "11:00",
    duration: 60,
    room: "Lab-203",
    type: "assignment",
    day: "friday",
    week: 1,
    description: "Diskusi Ekosistem",
    materials: ["Buku Referensi", "Chart"],
    isActive: true,
  },
];

export const DAYS_OF_WEEK = [
  { key: "monday", name: "Senin", short: "Sen" },
  { key: "tuesday", name: "Selasa", short: "Sel" },
  { key: "wednesday", name: "Rabu", short: "Rab" },
  { key: "thursday", name: "Kamis", short: "Kam" },
  { key: "friday", name: "Jumat", short: "Jum" },
  { key: "saturday", name: "Sabtu", short: "Sab" },
  { key: "sunday", name: "Minggu", short: "Min" },
];

export const getJadwalByDay = (day: string): JadwalItem[] => {
  return JADWAL_DATA.filter((item) => item.day === day);
};

export const getJadwalByWeek = (week: number): JadwalItem[] => {
  return JADWAL_DATA.filter((item) => item.week === week);
};

export const getCurrentWeekJadwal = (): JadwalDay[] => {
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Start from Monday

  return DAYS_OF_WEEK.map((day, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    return {
      day: day.key,
      dayName: day.name,
      date: date.toISOString().split("T")[0],
      schedules: getJadwalByDay(day.key),
    };
  });
};
