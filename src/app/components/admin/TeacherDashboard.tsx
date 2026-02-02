"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiUsers,
  FiFileText,
  FiClipboard,
  FiCheckSquare,
  FiBookOpen,
  FiEdit3,
  FiUserCheck,
  FiAward,
  FiActivity,
  FiTrendingUp,
  FiCalendar,
  FiClock,
  FiTarget,
  FiAlertCircle,
  FiHome
} from "react-icons/fi";

// --- Mock Data for Teacher Dashboard ---
const mockTodaySchedule = [
  { id: 1, time: "07:30 - 09:00", subject: "Matematika", class: "X-IPA-1", room: "R. 101", status: "ongoing" },
  { id: 2, time: "09:30 - 11:00", subject: "Matematika Peminatan", class: "XI-IPA-2", room: "R. 203", status: "upcoming" },
  { id: 3, time: "13:00 - 14:30", subject: "Matematika", class: "X-IPA-3", room: "R. 102", status: "upcoming" },
];

const mockNeedsGrading = [
  { id: 1, title: "Tugas Aljabar Linear", class: "X-IPA-1", submitted: 28, total: 30, due: "Yesterday" },
  { id: 2, title: "Kuis Trigonometri", class: "XI-IPA-2", submitted: 25, total: 32, due: "Today" },
];

// --- Components ---

interface DashboardCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  stats?: Array<{
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }>;
  prefetch?: boolean;
}

const DashboardCard = ({
  href,
  icon,
  title,
  description,
  gradient,
  iconBg,
  stats,
  prefetch = true,
}: DashboardCardProps) => (
  <Link
    href={href}
    prefetch={prefetch}
    className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all duration-300 block h-full"
  >
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 ${iconBg} rounded-xl shadow-sm text-white`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
            {title}
          </h3>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">
        {description}
      </p>

      {stats && (
        <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
          {stats.map((stat, index) => (
            <div key={index} className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2">
              <stat.icon className="h-3.5 w-3.5 text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</p>
                <p className="text-sm font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center text-xs font-semibold text-blue-600 mt-2 group-hover:translate-x-1 transition-transform">
        Buka Menu &rarr;
      </div>
    </div>
    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
  </Link>
);

const ScheduleCard = ({ schedule }: { schedule: any }) => (
  <div className={`p-4 rounded-xl border-l-4 mb-3 ${
    schedule.status === 'ongoing'
      ? 'bg-blue-50 border-blue-500'
      : 'bg-white border-slate-200 shadow-sm'
  }`}>
    <div className="flex justify-between items-start mb-2">
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
        schedule.status === 'ongoing'
          ? 'bg-blue-100 text-blue-700'
          : 'bg-slate-100 text-slate-600'
      }`}>
        {schedule.time}
      </span>
      {schedule.status === 'ongoing' && (
        <span className="flex items-center gap-1 text-xs text-blue-600 font-semibold animate-pulse">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Live
        </span>
      )}
    </div>
    <h4 className="font-bold text-slate-800 text-lg">{schedule.subject}</h4>
    <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
      <span className="flex items-center gap-1"><FiUsers className="w-4 h-4" /> {schedule.class}</span>
      <span className="flex items-center gap-1"><FiHome className="w-4 h-4" /> {schedule.room}</span>
    </div>
  </div>
);

interface TeacherDashboardProps {
  session: { name?: string; role?: string; } | null;
  stats: any;
}

export default function TeacherDashboard({ session, stats }: TeacherDashboardProps) {
  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {session?.name?.charAt(0).toUpperCase() || "T"}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Halo, {session?.name || "Guru"}!</h1>
                  <p className="text-xs text-slate-500 font-medium">Selamat mengajar hari ini.</p>
                </div>
             </div>
             <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                <span className="flex items-center gap-2">
                  <FiCalendar className="text-blue-500" />
                  {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
                </span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Main Dashboard Items */}
          <div className="lg:col-span-2 space-y-8">

            {/* Today's Schedule (Priority #1) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FiClock className="text-blue-600" /> Jadwal Mengajar Hari Ini
                </h2>
                {stats.studentsAtRisk > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full border border-red-200 animate-pulse">
                    <FiAlertCircle className="h-4 w-4" />
                    <span className="text-xs font-bold">{stats.studentsAtRisk} Siswa Berisiko</span>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {mockTodaySchedule.length > 0 ? (
                  mockTodaySchedule.map(sch => <ScheduleCard key={sch.id} schedule={sch} />)
                ) : (
                  <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
                    Tidak ada jadwal mengajar hari ini.
                  </div>
                )}
              </div>
            </section>

            {/* Menu Grid */}
            <section>
               <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FiTarget className="text-indigo-600" /> Menu Utama
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardCard
                  href="/teacher/assignment"
                  icon={<FiFileText className="w-6 h-6" />}
                  title="Tugas & PR"
                  description="Kelola tugas siswa."
                  gradient="from-orange-500 via-red-500"
                  iconBg="bg-gradient-to-r from-orange-500 to-red-500"
                  stats={[
                    { icon: FiFileText, label: "Aktif", value: stats.activeAssignments.toString() },
                    { icon: FiTrendingUp, label: "Selesai", value: stats.assignmentCompletion },
                  ]}
                />
                <DashboardCard
                  href="/teacher/quizzes"
                  icon={<FiAward className="w-6 h-6" />}
                  title="Kuis & Ujian"
                  description="Bank soal dan penilaian."
                  gradient="from-purple-500 via-pink-500"
                  iconBg="bg-gradient-to-r from-purple-500 to-pink-500"
                  stats={[
                    { icon: FiUsers, label: "Total", value: stats.totalQuizzes.toString() },
                    { icon: FiTrendingUp, label: "Avg", value: stats.avgQuizScore },
                  ]}
                />
                <DashboardCard
                  href="/teacher/modules"
                  icon={<FiBookOpen className="w-6 h-6" />}
                  title="Materi & Modul"
                  description="Upload bahan ajar."
                  gradient="from-blue-500 via-indigo-500"
                  iconBg="bg-gradient-to-r from-blue-500 to-indigo-500"
                />
                 <DashboardCard
                  href="/teacher/attendance"
                  icon={<FiUserCheck className="w-6 h-6" />}
                  title="Absensi Siswa"
                  description="Rekap kehadiran."
                  gradient="from-emerald-500 via-teal-500"
                  iconBg="bg-gradient-to-r from-emerald-500 to-teal-500"
                  stats={[
                    { icon: FiClock, label: "Pending", value: stats.pendingAttendance.toString() },
                  ]}
                />
              </div>
            </section>

          </div>

          {/* Right Column: Alerts & Quick Actions */}
          <div className="space-y-8">

            {/* Needs Grading (Priority #2) */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="p-4 border-b border-slate-100 bg-orange-50/50 flex justify-between items-center">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <FiAlertCircle className="text-orange-500" /> Perlu Dinilai
                 </h3>
                 <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">{mockNeedsGrading.length}</span>
               </div>
               <div className="divide-y divide-slate-50">
                 {mockNeedsGrading.map(item => (
                   <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-slate-700 text-sm group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-200 px-1 rounded">{item.class}</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-xs text-slate-500">Due: <span className="font-medium text-slate-700">{item.due}</span></p>
                        <p className="text-xs font-medium text-orange-600">{item.submitted}/{item.total} Submitted</p>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-slate-100 h-1 mt-2 rounded-full overflow-hidden">
                        <div className="bg-orange-400 h-full rounded-full" style={{ width: `${(item.submitted/item.total)*100}%` }}></div>
                      </div>
                   </div>
                 ))}
                 <div className="p-3 text-center border-t border-slate-100">
                   <Link href="/teacher/grading" className="text-xs font-bold text-blue-600 hover:underline">
                     Lihat Semua Penilaian &rarr;
                   </Link>
                 </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4">Buat Baru</h3>
              <div className="space-y-3">
                <Link href="/teacher/assignment/new" className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all text-slate-600 hover:text-blue-700">
                   <div className="p-1.5 bg-blue-100 rounded text-blue-600"><FiFileText /></div>
                   <span className="text-sm font-medium">Tugas Baru</span>
                </Link>
                <Link href="/teacher/quizzes/new" className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 hover:border-purple-400 hover:bg-purple-50 transition-all text-slate-600 hover:text-purple-700">
                   <div className="p-1.5 bg-purple-100 rounded text-purple-600"><FiAward /></div>
                   <span className="text-sm font-medium">Kuis Baru</span>
                </Link>
                 <Link href="/teacher/modules/new" className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-600 hover:text-indigo-700">
                   <div className="p-1.5 bg-indigo-100 rounded text-indigo-600"><FiBookOpen /></div>
                   <span className="text-sm font-medium">Materi Baru</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
