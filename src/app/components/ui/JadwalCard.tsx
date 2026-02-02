import { JadwalItem } from "../../constants/jadwal";

interface JadwalCardProps {
  jadwal: JadwalItem;
  isToday?: boolean;
}

const getTypeColor = (type: JadwalItem["type"]) => {
  switch (type) {
    case "theory":
      return "bg-blue-500/20 text-blue-300 border-blue-400/30";
    case "practical":
      return "bg-green-500/20 text-green-300 border-green-400/30";
    case "exam":
      return "bg-red-500/20 text-red-300 border-red-400/30";
    case "assignment":
      return "bg-purple-500/20 text-purple-300 border-purple-400/30";
    default:
      return "bg-gray-500/20 text-gray-300 border-gray-400/30";
  }
};

const getTypeIcon = (type: JadwalItem["type"]) => {
  switch (type) {
    case "theory":
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      );
    case "practical":
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
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      );
    case "exam":
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
    case "assignment":
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
    default:
      return null;
  }
};

const getTypeLabel = (type: JadwalItem["type"]) => {
  switch (type) {
    case "theory":
      return "Teori";
    case "practical":
      return "Praktikum";
    case "exam":
      return "Ujian";
    case "assignment":
      return "Tugas";
    default:
      return "Lainnya";
  }
};

const formatTime = (time: string, duration: number) => {
  const startTime = time;
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(start.getTime() + duration * 60000);
  const endTime = end.toTimeString().slice(0, 5);
  return `${startTime} - ${endTime}`;
};

const getTimeStatus = (time: string) => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const scheduleTime =
    parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);

  if (currentTime < scheduleTime - 30) return "upcoming";
  if (currentTime >= scheduleTime - 30 && currentTime <= scheduleTime + 90)
    return "current";
  return "past";
};

export default function JadwalCard({
  jadwal,
  isToday = false,
}: JadwalCardProps) {
  const timeStatus = getTimeStatus(jadwal.time);
  const isCurrent = timeStatus === "current";
  const isUpcoming = timeStatus === "upcoming";

  return (
    <div
      className={`group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-[1.02] ${
        isCurrent ? "ring-2 ring-cyan-400/50 shadow-cyan-500/20" : ""
      } ${isToday ? "border-cyan-400/30" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center text-white ${
              isCurrent ? "animate-pulse" : ""
            }`}
          >
            {getTypeIcon(jadwal.type)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
              {jadwal.subject}
            </h3>
            <p className="text-blue-200/70 text-sm">{jadwal.teacher}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(
              jadwal.type
            )}`}
          >
            {getTypeLabel(jadwal.type)}
          </span>
          {isCurrent && (
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium animate-pulse">
              Sedang Berlangsung
            </span>
          )}
        </div>
      </div>
      {/* Description */}
      {jadwal.description && (
        <p className="text-blue-100/80 text-sm mb-4 line-clamp-2">
          {jadwal.description}
        </p>
      )}
      {/* Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-200/70">
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
            <span className="text-sm font-medium">
              {formatTime(jadwal.time, jadwal.duration)}
            </span>
          </div>
          <div className="text-blue-200/70 text-sm">
            {jadwal.duration} menit
          </div>
        </div>

        <div className="flex items-center gap-2 text-blue-200/70">
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="text-sm">Ruangan {jadwal.room}</span>
        </div>

        {jadwal.materials && jadwal.materials.length > 0 && (
          <div className="flex items-start gap-2 text-blue-200/70">
            <svg
              className="w-4 h-4 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
            <div className="text-sm">
              <span className="font-medium">Materi: </span>
              <span>{jadwal.materials.join(", ")}</span>
            </div>
          </div>
        )}
      </div>
      {/* Action Buttons */}
      {/* <div className="flex gap-3">
        {isCurrent ? (
          <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105">
            Masuk Kelas
          </button>
        ) : isUpcoming ? (
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105">
            Siapkan Materi
          </button>
        ) : (
          <button className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 cursor-not-allowed opacity-50">
            Selesai
          </button>
        )}

        <button className="px-4 py-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 rounded-lg transition-all duration-300">
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
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div> */}
    </div>
  );
}
