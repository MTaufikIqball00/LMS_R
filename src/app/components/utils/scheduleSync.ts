// utils/scheduleSync.ts
import { COURSES, SCHEDULE_DAYS } from "../../constants/dashboard";
import { JADWAL_DATA, DAYS_OF_WEEK } from "../../constants/jadwal";
import type { Course } from "../../types/dashboard";
import type { JadwalItem } from "../../constants/jadwal";

/**
 * Konversi nama hari dari Indonesia ke English key
 */
export const convertIndonesianDayToEnglish = (dayIndo: string): string => {
  const dayMapping: { [key: string]: string } = {
    Senin: "monday",
    Selasa: "tuesday",
    Rabu: "wednesday",
    Kamis: "thursday",
    Jumat: "friday",
    Sabtu: "saturday",
    Minggu: "sunday",
  };
  return dayMapping[dayIndo] || dayIndo.toLowerCase();
};

/**
 * Konversi nama hari dari English ke Indonesia
 */
export const convertEnglishDayToIndonesian = (dayEng: string): string => {
  const dayMapping: { [key: string]: string } = {
    monday: "Senin",
    tuesday: "Selasa",
    wednesday: "Rabu",
    thursday: "Kamis",
    friday: "Jumat",
    saturday: "Sabtu",
    sunday: "Minggu",
  };
  return dayMapping[dayEng] || dayEng;
};

/**
 * Mendapatkan mata pelajaran yang tersedia untuk hari tertentu
 */
export const getSubjectsForDay = (dayName: string): string[] => {
  const schedule = SCHEDULE_DAYS.find((s) => s.day === dayName);
  return schedule?.subjects || [];
};

/**
 * Mendapatkan courses yang tersedia untuk hari tertentu
 */
export const getCoursesForDay = (dayName: string): Course[] => {
  const subjects = getSubjectsForDay(dayName);
  return COURSES.filter((course) =>
    subjects.some(
      (subject) =>
        course.title.toLowerCase().includes(subject.toLowerCase()) ||
        subject.toLowerCase().includes(course.title.toLowerCase())
    )
  );
};

/**
 * Mendapatkan jadwal detail untuk hari tertentu
 */
export const getScheduleForDay = (dayName: string): JadwalItem[] => {
  const englishDay = convertIndonesianDayToEnglish(dayName);
  return JADWAL_DATA.filter(
    (schedule) => schedule.day?.toLowerCase() === englishDay.toLowerCase()
  );
};

/**
 * Mendapatkan hari saat ini dalam bahasa Indonesia
 */
export const getCurrentDayInIndonesian = (): string => {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const today = new Date();
  return days[today.getDay()];
};

/**
 * Mendapatkan hari saat ini dalam format English key
 */
export const getCurrentDayInEnglish = (): string => {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = new Date();
  return days[today.getDay()];
};

/**
 * Cek apakah hari tersebut adalah hari ini
 */
export const isToday = (dayName: string): boolean => {
  const currentDay = getCurrentDayInIndonesian();
  return dayName === currentDay;
};

/**
 * Mendapatkan mata pelajaran untuk hari ini
 */
export const getTodaySubjects = (): string[] => {
  const today = getCurrentDayInIndonesian();
  return getSubjectsForDay(today);
};

/**
 * Mendapatkan courses untuk hari ini
 */
export const getTodayCourses = (): Course[] => {
  const today = getCurrentDayInIndonesian();
  return getCoursesForDay(today);
};

/**
 * Mendapatkan jadwal untuk hari ini
 */
export const getTodaySchedule = (): JadwalItem[] => {
  const today = getCurrentDayInIndonesian();
  console.log("Today (Indonesia):", today);

  const englishDay = convertIndonesianDayToEnglish(today);
  console.log("Today (English):", englishDay);

  const filtered = JADWAL_DATA.filter((schedule) => {
    console.log(`Comparing: "${schedule.day}" === "${englishDay}"`);
    return schedule.day === englishDay;
  });

  console.log("Filtered schedule:", filtered);
  return filtered;
};

/**
 * Mendapatkan statistik mata pelajaran mingguan
 */
export const getWeeklySubjectStats = () => {
  const totalSubjects = COURSES.length;
  const activeSubjects = new Set();

  SCHEDULE_DAYS.forEach((day) => {
    if (day.subjects) {
      day.subjects.forEach((subject) => activeSubjects.add(subject));
    }
  });

  const activeDays = SCHEDULE_DAYS.filter(
    (day) => day.subjects && day.subjects.length > 0
  ).length;

  const totalScheduledSubjects = SCHEDULE_DAYS.reduce(
    (total, day) => total + (day.subjects?.length || 0),
    0
  );

  return {
    totalSubjects,
    activeSubjects: activeSubjects.size,
    activeDays,
    totalScheduledSubjects,
    averageSubjectsPerDay:
      activeDays > 0 ? totalScheduledSubjects / activeDays : 0,
  };
};

/**
 * Mendapatkan mata pelajaran yang akan datang (besok)
 */
export const getTomorrowSubjects = (): string[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDay = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ][tomorrow.getDay()];
  return getSubjectsForDay(tomorrowDay);
};

/**
 * Validasi sinkronisasi antara dashboard subjects dan jadwal
 */
export const validateScheduleSync = (): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} => {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Cek apakah semua subjects di SCHEDULE_DAYS ada di COURSES
  SCHEDULE_DAYS.forEach((day) => {
    if (day.subjects) {
      day.subjects.forEach((subject) => {
        const courseExists = COURSES.some(
          (course) =>
            course.title.toLowerCase().includes(subject.toLowerCase()) ||
            subject.toLowerCase().includes(course.title.toLowerCase())
        );
        if (!courseExists) {
          issues.push(
            `Mata pelajaran "${subject}" di hari ${day.day} tidak ditemukan di daftar courses`
          );
        }
      });
    }
  });

  // Cek apakah semua subjects di JADWAL_DATA sinkron dengan SCHEDULE_DAYS
  const jadwalSubjects = new Set(JADWAL_DATA.map((item) => item.subject));
  const scheduleSubjects = new Set();

  SCHEDULE_DAYS.forEach((day) => {
    if (day.subjects) {
      day.subjects.forEach((subject) => scheduleSubjects.add(subject));
    }
  });

  jadwalSubjects.forEach((subject) => {
    if (!scheduleSubjects.has(subject)) {
      issues.push(
        `Mata pelajaran "${subject}" ada di jadwal detail tapi tidak ada di jadwal mingguan`
      );
      suggestions.push(`Tambahkan "${subject}" ke SCHEDULE_DAYS`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
  };
};
