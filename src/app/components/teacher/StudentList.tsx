import Link from "next/link";
import Image from "next/image";
import {
  FiMail,
  FiBookOpen,
  FiEye,
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiClock,
  FiBarChart,
  FiStar,
  FiAlertTriangle,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { Student } from "../../../lib/types/student";

// Helper functions (can be moved to a utils file if needed)
const getSubjectColor = (subject: string) => {
  const colors: { [key: string]: string } = {
    Biologi: "from-green-500 to-emerald-500",
    Matematika: "from-blue-500 to-indigo-500",
    Kimia: "from-purple-500 to-pink-500",
    "Bahasa Indonesia": "from-orange-500 to-red-500",
    "Teknik Informatika": "from-sky-500 to-cyan-500",
  };
  return colors[subject] || "from-gray-500 to-slate-500";
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
    case "Aktif":
      return {
        bg: "bg-gradient-to-r from-blue-100 to-cyan-100",
        text: "text-blue-800",
        border: "border-blue-200/50",
      };
    case "Berprestasi":
      return {
        bg: "bg-gradient-to-r from-green-100 to-emerald-100",
        text: "text-green-800",
        border: "border-green-200/50",
      };
    case "Perlu Perhatian":
      return {
        bg: "bg-gradient-to-r from-orange-100 to-yellow-100",
        text: "text-orange-800",
        border: "border-orange-200/50",
      };
    default:
      return {
        bg: "bg-gradient-to-r from-gray-100 to-slate-100",
        text: "text-gray-800",
        border: "border-gray-200/50",
      };
  }
};

const getRiskBadge = (riskStatus?: string) => {
  switch (riskStatus) {
    case "Berisiko Tinggi":
      return {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        icon: <FiAlertCircle className="h-4 w-4 text-red-700" />,
        label: "Bahaya",
      };
    case "Berisiko Sedang":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: <FiAlertTriangle className="h-4 w-4 text-yellow-700" />,
        label: "Peringatan",
      };
    case "Aman":
      return {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        icon: <FiCheckCircle className="h-4 w-4 text-green-700" />,
        label: "Aman",
      };
    default:
      return null;
  }
};

interface StudentListProps {
  students: Student[];
}

export default function StudentList({ students }: StudentListProps) {
  return (
    <div className="grid gap-6">
      {students.map((student, index) => {
        const statusBadge = getStatusBadge(student.status);
        const subjectColor = getSubjectColor(student.major);
        const riskBadge = getRiskBadge(student.riskStatus);

        return (
          <div
            key={student.id}
            className="group relative backdrop-blur-xl bg-white/50 hover:bg-white/80 border border-white/30 rounded-3xl overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 shadow-xl hover:shadow-2xl"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: "slideInUp 0.6s ease-out forwards",
            }}
          >
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl border-4 border-white/50 group-hover:scale-110 transition-transform duration-300">
                        <Image
                          className="w-full h-full object-cover"
                          src={student.avatar || "/assets/Avatar.png"}
                          alt={student.name}
                          width={80}
                          height={80}
                        />
                      </div>
                      <div
                        className={`absolute -top-1 -right-1 w-6 h-6 ${
                          student.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        } rounded-full border-2 border-white`}
                      ></div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-cyan-800 transition-colors duration-300 mb-2">
                          {student.name}
                        </h3>

                        {riskBadge && (
                           <div className={`flex items-center gap-2 px-3 py-1 ${riskBadge.bg} ${riskBadge.text} text-sm font-bold rounded-full border ${riskBadge.border} animate-pulse`}>
                              {riskBadge.icon}
                              <span>{riskBadge.label}</span>
                           </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-slate-100/80 to-white/80 text-slate-700 text-sm font-semibold rounded-full border border-white/40">
                          <FiMail className="h-3 w-3" />
                          {student.email}
                        </div>
                        <div
                          className={`px-3 py-1 ${statusBadge.bg} ${statusBadge.text} text-sm font-semibold rounded-full border ${statusBadge.border}`}
                        >
                          {student.status}
                        </div>
                        {/* Show Risk Score if available */}
                        {student.riskScore != null && (
                             <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 text-sm font-semibold rounded-full border border-purple-200">
                                <FiBarChart className="h-3 w-3" />
                                Risk Score: {student.riskScore.toFixed(2)}
                             </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className={`p-2 bg-gradient-to-r ${subjectColor} rounded-lg shadow-lg`}
                        >
                          <FiBookOpen className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-800">
                          {student.class}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                           <div className="bg-white/60 p-3 rounded-xl border border-white/50 text-center">
                               <p className="text-xs text-gray-500 uppercase font-bold">Kehadiran</p>
                               <p className="text-lg font-bold text-slate-800">{student.attendanceRate}%</p>
                           </div>
                           <div className="bg-white/60 p-3 rounded-xl border border-white/50 text-center">
                               <p className="text-xs text-gray-500 uppercase font-bold">Kuis</p>
                               <p className="text-lg font-bold text-slate-800">{student.quizAverage}</p>
                           </div>
                            <div className="bg-white/60 p-3 rounded-xl border border-white/50 text-center">
                               <p className="text-xs text-gray-500 uppercase font-bold">Tugas</p>
                               <p className="text-lg font-bold text-slate-800">{student.assignmentCompletion}%</p>
                           </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:flex-shrink-0 lg:w-48">
                  <Link href={`/teacher/students/${student.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <FiEye className="h-4 w-4" />
                      <span>Lihat Profil</span>
                    </button>
                  </Link>
                  {/* Other Actions */}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"></div>
          </div>
        );
      })}
    </div>
  );
}
