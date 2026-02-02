"use client";
import Link from "next/link";
import { AssignmentWithStatus } from "../../../app/tugas/page";

interface TugasCardProps {
  tugas: AssignmentWithStatus;
}

const getStatusColor = (status: AssignmentWithStatus["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
    case "submitted":
      return "bg-blue-500/20 text-blue-300 border-blue-400/30";
    case "graded":
      return "bg-green-500/20 text-green-300 border-green-400/30";
    case "overdue":
      return "bg-red-500/20 text-red-300 border-red-400/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-400/30";
  }
};

const getPriorityColor = (priority?: AssignmentWithStatus["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red-300";
    case "medium":
      return "bg-yellow-500/20 text-yellow-300";
    case "low":
      return "bg-green-500/20 text-green-300";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};

const getQuizStatusColor = (status: string) => {
  switch (status) {
    case "not-started":
      return "bg-amber-500/20 text-amber-300 border-amber-400/30";
    case "active":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-400/30 animate-pulse";
    case "closed":
      return "bg-red-500/20 text-red-300 border-red-400/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-400/30";
  }
};

const getTypeIcon = (type: AssignmentWithStatus["type"]) => {
  switch (type) {
    case "essay":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    case "quiz":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    case "project":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      );
    case "presentation":
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h4"
          />
        </svg>
      );
    default:
      return (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
  }
};

// ✅ Fixed: Add proper null checks for dueDate
const formatDate = (dateString?: string) => {
  if (!dateString) return "Tidak ada batas waktu";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
};

// ✅ Fixed: Add proper null checks for dueDate
const getDaysUntilDue = (dueDate?: string): number => {
  if (!dueDate) return 0;

  try {
    const today = new Date();
    const due = new Date(dueDate);

    if (isNaN(due.getTime())) return 0;

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    return 0;
  }
};

// ✅ Fixed: Add proper null checks
const getQuizStatus = (tugas: AssignmentWithStatus): string => {
  if (tugas.type !== "quiz") return "not-available";
  if (!tugas.dueDate) return "not-available";

  try {
    const now = new Date();
    const dueDate = new Date(tugas.dueDate);

    if (isNaN(dueDate.getTime())) return "not-available";

    // Simple logic: if due date is in the future, quiz is active
    if (now < dueDate) {
      return "active";
    } else {
      return "closed";
    }
  } catch (error) {
    return "not-available";
  }
};

const isQuizAvailable = (tugas: AssignmentWithStatus): boolean => {
  return tugas.type === "quiz" && getQuizStatus(tugas) === "active";
};

// ✅ Fixed: Add proper null checks
const formatQuizTime = (dateString?: string) => {
  if (!dateString) return "Tidak ada jadwal";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    return "Invalid date";
  }
};

// ✅ Fixed: Add proper null checks
const getTimeUntilQuiz = (dateString?: string) => {
  if (!dateString) return { timeLeft: "Tidak ada jadwal" };

  try {
    const target = new Date(dateString);
    if (isNaN(target.getTime())) return { timeLeft: "Invalid date" };

    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return { timeLeft: "Sudah berakhir" };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return { timeLeft: `${days} hari lagi` };
    } else if (hours > 0) {
      return { timeLeft: `${hours} jam ${minutes} menit lagi` };
    } else if (minutes > 0) {
      return { timeLeft: `${minutes} menit lagi` };
    } else {
      return { timeLeft: "Berakhir sebentar lagi" };
    }
  } catch (error) {
    return { timeLeft: "Error calculating time" };
  }
};

export default function TugasCard({ tugas }: TugasCardProps) {
  // ✅ Add proper null checks and fallback values
  const safeDueDate =
    tugas.dueDate ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const daysUntilDue = getDaysUntilDue(safeDueDate);
  const isOverdue = daysUntilDue < 0;
  const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

  // Quiz-specific logic
  const isQuizType = tugas.type === "quiz";
  const quizStatus = isQuizType ? getQuizStatus(tugas) : null;
  const canAccessQuiz = isQuizType ? isQuizAvailable(tugas) : true;

  // ✅ Fixed: Handle ID properly - ensure it's always a string
  const taskId = String(tugas.id || "unknown");
  const submitHref = `/tugas/${taskId}/submit`;

  // ✅ Fixed: Handle optional submission data
  const submissionId =
    (tugas as any).submissionId || (tugas as any).submission?.id;
  const resultHref = submissionId
    ? `/tugas/${taskId}/result?submissionId=${encodeURIComponent(submissionId)}`
    : `/tugas/${taskId}/result`;

  // Get action button based on type and status
  const getActionButton = () => {
    if (tugas.status === "graded") {
      return (
        <Link
          href={resultHref}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 text-center"
        >
          Lihat Detail
        </Link>
      );
    }

    if (tugas.status === "submitted") {
      return (
        <button
          className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 cursor-not-allowed opacity-50"
          disabled
        >
          Menunggu Penilaian
        </button>
      );
    }

    if (isQuizType) {
      return getQuizActionButton();
    }

    // Regular assignments
    if (tugas.status === "pending") {
      return (
        <Link
          href={submitHref}
          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 text-center"
        >
          Kerjakan Tugas
        </Link>
      );
    }

    if (tugas.status === "overdue") {
      return (
        <Link
          href={submitHref}
          className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 text-center"
        >
          Kerjakan Tugas
        </Link>
      );
    }

    // Fallback
    return (
      <button
        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed opacity-50"
        disabled
      >
        Tidak Tersedia
      </button>
    );
  };

  const getQuizActionButton = () => {
    switch (quizStatus) {
      case "not-started":
        return (
          <button
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed opacity-50"
            disabled
          >
            Quiz Belum Dibuka
          </button>
        );

      case "active":
        return (
          <Link
            href={submitHref}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105 animate-pulse text-center"
          >
            Mulai Quiz
          </Link>
        );

      case "closed":
        return (
          <button
            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed opacity-50"
            disabled
          >
            Quiz Ditutup
          </button>
        );

      default:
        return (
          <button
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium py-2 px-4 rounded-lg cursor-not-allowed opacity-50"
            disabled
          >
            Quiz Tidak Tersedia
          </button>
        );
    }
  };

  // Get quiz status badge
  const getQuizStatusBadge = () => {
    if (!isQuizType || !quizStatus) return null;

    const statusLabels: { [key: string]: string } = {
      "not-started": "Belum Dimulai",
      active: "Sedang Berlangsung",
      closed: "Ditutup",
      "not-available": "Tidak Tersedia",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${getQuizStatusColor(
          quizStatus
        )}`}
      >
        Quiz {statusLabels[quizStatus] || "Status Tidak Dikenal"}
      </span>
    );
  };

  return (
    <div className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-white">
            {getTypeIcon(tugas.type)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
              {tugas.title || "Untitled"}
            </h3>
            <p className="text-blue-200/70 text-sm">
              {tugas.subject || "Mata Pelajaran"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              tugas.status
            )}`}
          >
            {tugas.status === "pending" && "Belum Dikerjakan"}
            {tugas.status === "submitted" && "Sudah Dikirim"}
            {tugas.status === "graded" && "Sudah Dinilai"}
            {tugas.status === "overdue" && "Terlambat"}
          </span>

          {getQuizStatusBadge()}

          {tugas.priority && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                tugas.priority
              )}`}
            >
              {tugas.priority === "high" && "Tinggi"}
              {tugas.priority === "medium" && "Sedang"}
              {tugas.priority === "low" && "Rendah"}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-blue-100/80 text-sm mb-4 line-clamp-2">
        {tugas.description || "Tidak ada deskripsi"}
      </p>

      {/* ✅ Quiz Time Information - Simplified with proper null checks */}
      {isQuizType && safeDueDate && (
        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-blue-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-blue-200 font-medium text-sm">
              Jadwal Quiz
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-blue-200/80 mb-1">
            <span>Batas waktu:</span>
            <span className="font-medium">{formatQuizTime(safeDueDate)}</span>
          </div>

          {/* Time until quiz ends */}
          {quizStatus === "active" && (
            <div className="mt-2 text-center">
              <div className="text-red-300 text-xs font-medium animate-pulse">
                Berakhir {getTimeUntilQuiz(safeDueDate).timeLeft}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Details */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-blue-200/70">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span
              className={
                isOverdue ? "text-red-300" : isDueSoon ? "text-yellow-300" : ""
              }
            >
              {safeDueDate
                ? isOverdue
                  ? `Terlambat ${Math.abs(daysUntilDue)} hari`
                  : isDueSoon
                  ? `Tinggal ${daysUntilDue} hari`
                  : `${daysUntilDue} hari lagi`
                : "Tidak ada batas waktu"}
            </span>
          </div>

          {/* ✅ Fixed: Handle optional points */}
          {tugas.points && (
            <div className="flex items-center gap-1 text-blue-200/70">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{tugas.points} poin</span>
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-blue-200/70 text-xs">Batas waktu</div>
          <div className="text-white font-medium text-sm">
            {formatDate(safeDueDate)}
          </div>
        </div>
      </div>

      {/* ✅ Grade & Feedback - Now properly typed */}
      {tugas.grade !== null && (
        <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-300 font-medium">Nilai</span>
            <span className="text-green-300 font-bold text-lg">
              {tugas.grade}/100
            </span>
          </div>
          {/* ✅ Feedback is not in the interface, so we make it optional */}
          {(tugas as any).feedback && (
            <p className="text-green-200/80 text-sm">
              {(tugas as any).feedback}
            </p>
          )}
        </div>
      )}

      {/* Action Button */}
      <div className="flex gap-3">{getActionButton()}</div>
    </div>
  );
}
