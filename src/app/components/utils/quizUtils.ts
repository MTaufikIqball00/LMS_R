// utils/quizUtils.ts
import { Tugas } from "../../constants/tugas";

export type QuizStatus = "not-started" | "active" | "closed";

export function parseQuizDateTime(dateTimeStr: string): Date {
  // Untuk format ISO "2025-09-22T09:00:00"
  const date = new Date(dateTimeStr);

  // Validasi date
  if (isNaN(date.getTime())) {
    console.error("Invalid date format:", dateTimeStr);
    return new Date(); // Fallback ke current time
  }

  return date;
}

export function getQuizStatus(tugas: Tugas): QuizStatus | null {
  if (tugas.type !== "quiz" || !tugas.quizDibuka || !tugas.quizDitutup) {
    return null;
  }

  const now = new Date();
  const openTime = parseQuizDateTime(tugas.quizDibuka);
  const closeTime = parseQuizDateTime(tugas.quizDitutup);

  if (now < openTime) {
    return "not-started";
  } else if (now >= openTime && now <= closeTime) {
    return "active";
  } else {
    return "closed";
  }
}

export function isQuizAvailable(tugas: Tugas): boolean {
  const status = getQuizStatus(tugas);
  return status === "active";
}

export function formatQuizTime(dateTimeStr: string): string {
  const date = parseQuizDateTime(dateTimeStr);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

// ✅ PERBAIKAN: Format yang lebih readable dengan hari
export function getTimeUntilQuiz(dateTimeStr: string): {
  timeLeft: string;
  isUrgent: boolean;
} {
  try {
    const targetTime = parseQuizDateTime(dateTimeStr);
    const now = new Date();
    const diff = targetTime.getTime() - now.getTime();

    if (diff <= 0) {
      return { timeLeft: "Waktu habis", isUrgent: true };
    }

    // Hitung hari, jam, dan menit
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const isUrgent = diff < 2 * 60 * 60 * 1000; // Less than 2 hours

    // Format sesuai kondisi
    if (days > 0) {
      if (hours > 0) {
        return {
          timeLeft: `${days} hari ${hours} jam lagi`,
          isUrgent: false,
        };
      } else {
        return {
          timeLeft: `${days} hari lagi`,
          isUrgent: false,
        };
      }
    } else if (hours > 0) {
      if (minutes > 0) {
        return {
          timeLeft: `${hours} jam ${minutes} menit lagi`,
          isUrgent,
        };
      } else {
        return {
          timeLeft: `${hours} jam lagi`,
          isUrgent,
        };
      }
    } else {
      return {
        timeLeft: `${minutes} menit lagi`,
        isUrgent: true,
      };
    }
  } catch (error) {
    console.error("Error calculating time until quiz:", error);
    return { timeLeft: "Error menghitung waktu", isUrgent: false };
  }
}
