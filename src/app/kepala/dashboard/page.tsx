"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from "recharts";
import {
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiAward,
  FiCalendar,
  FiUserCheck,
  FiAlertTriangle
} from "react-icons/fi";

// --- Mock Data ---

const mockAttendanceTrend = [
  { name: 'Mon', attendance: 92 },
  { name: 'Tue', attendance: 94 },
  { name: 'Wed', attendance: 91 },
  { name: 'Thu', attendance: 95 },
  { name: 'Fri', attendance: 89 },
  { name: 'Sat', attendance: 0 }, // School closed
];

const mockGradeDistribution = [
  { grade: 'A', count: 120 },
  { grade: 'B', count: 250 },
  { grade: 'C', count: 80 },
  { grade: 'D', count: 15 },
  { grade: 'E', count: 5 },
];

const mockTeacherPerformance = [
  { name: "Budi Santoso", subject: "Matematika", rating: 4.8, attendance: "98%", status: "Excellent" },
  { name: "Siti Aminah", subject: "Sejarah", rating: 4.5, attendance: "95%", status: "Good" },
  { name: "Agus Ringgo", subject: "Fisika", rating: 3.9, attendance: "90%", status: "Review Needed" },
  { name: "Rina Wati", subject: "Biologi", rating: 4.7, attendance: "97%", status: "Excellent" },
  { name: "Joko Anwar", subject: "Seni", rating: 4.2, attendance: "92%", status: "Good" },
];

// --- Components ---

const KPICard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      {change > 0 ? (
        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <FiTrendingUp className="mr-1" /> +{change}%
        </span>
      ) : change < 0 ? (
        <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
          <FiTrendingDown className="mr-1" /> {change}%
        </span>
      ) : (
        <span className="flex items-center text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-full">
          Stable
        </span>
      )}
      <span className="text-xs text-slate-400">vs last month</span>
    </div>
  </div>
);

export default function KepalaDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Executive Overview</h1>
            <p className="text-sm text-slate-500">Academic Performance & School Health</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Row: KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Avg Attendance"
            value="94.2%"
            change={1.2}
            icon={FiUserCheck}
            color="text-emerald-600"
          />
          <KPICard
            title="Avg GPA"
            value="3.45"
            change={0.5}
            icon={FiAward}
            color="text-blue-600"
          />
          <KPICard
            title="At-Risk Students"
            value="12"
            change={-5.0}
            icon={FiAlertTriangle}
            color="text-amber-600"
          />
          <KPICard
            title="Teacher Perf."
            value="4.6/5"
            change={0.2}
            icon={FiUsers}
            color="text-purple-600"
          />
        </div>

        {/* Middle Row: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Chart 1: Attendance Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FiTrendingUp className="text-emerald-500" /> Weekly Attendance Trend
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockAttendanceTrend}>
                  <defs>
                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Grade Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <FiAward className="text-blue-500" /> Academic Performance Distribution
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockGradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <Tooltip
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Bottom Row: Teacher Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Teacher Performance Summary</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View Full Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4">Teacher Name</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Student Rating</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mockTeacherPerformance.map((teacher, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{teacher.name}</td>
                    <td className="px-6 py-4 text-slate-500">{teacher.subject}</td>
                    <td className="px-6 py-4 flex items-center gap-1">
                      <span className="font-bold text-slate-700">{teacher.rating}</span>
                      <span className="text-amber-400">★</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{teacher.attendance}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        teacher.status === 'Excellent' ? 'bg-emerald-100 text-emerald-700' :
                        teacher.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {teacher.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
