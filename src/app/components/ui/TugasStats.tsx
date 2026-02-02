import { TugasStatsProps } from "../../types/tugasstats";

export default function TugasStats({ stats }: TugasStatsProps) {
  const statItems = [
    {
      label: "Total Tugas",
      value: stats.total,
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      label: "Belum Dikerjakan",
      value: stats.pending,
      color: "from-yellow-500 to-orange-500",
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Sudah Dikirim",
      value: stats.submitted,
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Sudah Dinilai",
      value: stats.graded,
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Terlambat",
      value: stats.overdue,
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
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
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
                  stats.total > 0 ? (item.value / stats.total) * 100 : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
