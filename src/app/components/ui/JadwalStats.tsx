import { JadwalItem } from "../../constants/jadwal";

interface JadwalStatsProps {
  schedules: JadwalItem[];
}

export default function JadwalStats({ schedules }: JadwalStatsProps) {
  const totalSchedules = schedules.length;
  const theoryCount = schedules.filter((s) => s.type === "theory").length;
  const practicalCount = schedules.filter((s) => s.type === "practical").length;
  const examCount = schedules.filter((s) => s.type === "exam").length;
  const assignmentCount = schedules.filter(
    (s) => s.type === "assignment"
  ).length;

  const totalHours =
    schedules.reduce((total, schedule) => total + schedule.duration, 0) / 60;
  const averageDuration = totalSchedules > 0 ? totalHours / totalSchedules : 0;

  const statItems = [
    {
      label: "Total Jadwal",
      value: totalSchedules,
      color: "from-blue-500 to-cyan-500",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Teori",
      value: theoryCount,
      color: "from-blue-500 to-indigo-500",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      label: "Praktikum",
      value: practicalCount,
      color: "from-green-500 to-emerald-500",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      label: "Ujian",
      value: examCount,
      color: "from-red-500 to-pink-500",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
    {
      label: "Tugas",
      value: assignmentCount,
      color: "from-purple-500 to-indigo-500",
      icon: (
        <svg
          className="w-6 h-6"
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
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
            >
              {item.icon}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-1">
                {item.value}
              </div>
              <div className="text-blue-200/70 text-sm">{item.label}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
              style={{
                width: `${
                  totalSchedules > 0 ? (item.value / totalSchedules) * 100 : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      ))}

      {/* Additional Stats */}
      <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center text-white">
                <svg
                  className="w-6 h-6"
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
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {totalHours.toFixed(1)} jam
                </div>
                <div className="text-blue-200/70 text-sm">
                  Total Durasi Dalam 1 Minggu
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {averageDuration.toFixed(1)} jam
                </div>
                <div className="text-blue-200/70 text-sm">
                  Rata-rata per Jadwal
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
