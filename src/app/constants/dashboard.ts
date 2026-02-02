import type { ScheduleItem, Course } from "../types/dashboard";
// export const SCHEDULE_DAYS: ScheduleItem[] = [
//   { day: "Senin", time: "06.45" },
//   { day: "Selasa", time: "07.00" },
//   { day: "Rabu", time: "07.15" },
//   { day: "Kamis", time: "07.00" },
//   { day: "Jumat", time: "07.15" },
// ];

export const COURSES: Course[] = [
  {
    id: 1,
    title: "Pancawaluya",
    description: "Panca Waluya adalah konsep pendidikan karakter yang berakar dari kearifan lokal Sunda. Secara harfiah, Panca Waluya berarti `Lima Kesempurnaan`. Kelima nilai tersebut adalah: Cageur (sehat jasmani dan rohani), Bageur (berperilaku baik), Bener (jujur dan benar), Pinter (cerdas dan pintar), dan Singer (gercep/tanggap dan gesit).",
    slug: "pancawaluya",
    image: "/assets/pancawaluya.png",
    level: "Beginner",
    duration: "6 minggu",
    students: 500,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Bahasa Indonesia",
    description: "Pelajari kaidah bahasa, sastra, dan keterampilan menulis.",
    slug: "bahasa-indonesia",
    image: "/assets/indonesia.png",
    level: "Beginner",
    duration: "10 minggu",
    students: 1320,
    rating: 4.6,
  },
  {
    id: 3,
    title: "Bahasa Inggris",
    description:
      "Pelajari konsep Bahasa Inggris untuk komunikasi dan akademik.",
    slug: "bahasa-inggris",
    image: "/assets/inggris.jpg",
    level: "Beginner",
    duration: "8 minggu",
    students: 1250,
    rating: 4.8,
  },
  {
    id: 4,
    title: "Fisika",
    description: "Eksplorasi hukum-hukum alam, energi, dan fenomena fisika.",
    slug: "fisika",
    image: "/assets/fisika.jpg",
    level: "Intermediate",
    duration: "12 minggu",
    students: 1100,
    rating: 4.5,
  },
  {
    id: 5,
    title: "Kimia",
    description: "Pelajari struktur atom, reaksi kimia, dan aplikasinya.",
    slug: "kimia",
    image: "/assets/kimia.jpg",
    level: "Intermediate",
    duration: "12 minggu",
    students: 980,
    rating: 4.6,
  },
  {
    id: 6,
    title: "Biologi",
    description: "Pelajari tentang makhluk hidup, ekosistem, dan genetika.",
    slug: "biologi",
    image: "/assets/biologi.jpg",
    level: "Intermediate",
    duration: "12 minggu",
    students: 1200,
    rating: 4.7,
  },
  {
    id: 7,
    title: "PPKn",
    description: "Pahami Pancasila, kewarganegaraan, dan nilai kebangsaan.",
    slug: "ppkn",
    image: "/assets/ppkn.png",
    level: "Beginner",
    duration: "8 minggu",
    students: 900,
    rating: 4.5,
  },
  {
    id: 8,
    title: "Informatika",
    description:
      "Pelajari dasar-dasar komputer, pemrograman, dan teknologi digital.",
    slug: "informatika",
    image: "/assets/informatika.jpg",
    level: "Intermediate",
    duration: "10 minggu",
    students: 1400,
    rating: 4.9,
  },
  {
    id: 9,
    title: "Matematika",
    description: "Pelajari konsep dasar hingga tingkat lanjut Matematika SMA.",
    slug: "matematika",
    image: "/assets/matematika.jpg",
    level: "Intermediate",
    duration: "12 minggu",
    students: 1500,
    rating: 4.7,
  },
];
export const SCHEDULE_DAYS: ScheduleItem[] = [
  {
    day: "Senin",
    time: "07:00 - 15:00",
    subjects: ["Matematika", "Fisika", "Bahasa Indonesia"],
  },
  {
    day: "Selasa",
    time: "07:00 - 15:00",
    subjects: ["Bahasa Inggris", "Kimia", "PPKn"],
  },
  {
    day: "Rabu",
    time: "07:00 - 15:00",
    subjects: ["Biologi", "Matematika", "Informatika"],
  },
  {
    day: "Kamis",
    time: "07:00 - 15:00",
    subjects: ["Fisika", "Bahasa Indonesia", "Bahasa Inggris"],
  },
  {
    day: "Jumat",
    time: "07:00 - 11:30",
    subjects: ["Kimia", "PPKn", "Biologi"],
  },
];

// // Fungsi helper untuk mendapatkan mata pelajaran berdasarkan hari
// export const getSubjectsByDay = (day: string): string[] => {
//   const schedule = SCHEDULE_DAYS.find((s) => s.day === day);
//   return schedule?.subjects || [];
// };

// // Fungsi helper untuk mendapatkan courses berdasarkan hari
// export const getCoursesByDay = (day: string): Course[] => {
//   const subjects = getSubjectsByDay(day);
//   return COURSES.filter((course) =>
//     subjects.some(
//       (subject) =>
//         course.title.toLowerCase().includes(subject.toLowerCase()) ||
//         subject.toLowerCase().includes(course.title.toLowerCase())
//     )
//   );
// };
