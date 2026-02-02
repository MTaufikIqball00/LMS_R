"use client";
import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiHome,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiServer,
  FiDatabase,
  FiGlobe
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";

type School = {
  id: string;
  name: string;
  province: string;
  subscriptionStatus: string;
};

const mockActivityLogs = [
  { id: 1, user: "Admin Pusat", action: "Updated subscription", target: "SMA 1 Bandung", time: "10 mins ago", type: "info" },
  { id: 2, user: "System", action: "Database backup", target: "Daily Backup", time: "1 hour ago", type: "success" },
  { id: 3, user: "Admin Support", action: "Resolved ticket", target: "#Ticket-402", time: "2 hours ago", type: "info" },
  { id: 4, user: "System", action: "High latency warning", target: "API Server", time: "4 hours ago", type: "warning" },
  { id: 5, user: "Admin Pusat", action: "Created school", target: "SMA Harapan", time: "5 hours ago", type: "success" },
];

const mockGrowthData = [
  { name: 'Jan', active: 4, expired: 0 },
  { name: 'Feb', active: 6, expired: 1 },
  { name: 'Mar', active: 8, expired: 1 },
  { name: 'Apr', active: 12, expired: 2 },
  { name: 'May', active: 15, expired: 2 },
  { name: 'Jun', active: 20, expired: 3 },
];

const mockSystemStatus = [
  { name: 'Database', status: 'Operational', uptime: '99.9%', icon: FiDatabase, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { name: 'API Gateway', status: 'Operational', uptime: '99.8%', icon: FiServer, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { name: 'CDN', status: 'Degraded', uptime: '98.5%', icon: FiGlobe, color: 'text-amber-500', bg: 'bg-amber-100' },
];

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#f43f5e'];

// --- Components ---

const StatCard = ({ title, value, icon: Icon, color, subtext }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl bg-slate-50 ${color.replace('text-', 'text-opacity-20 ')}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
  </div>
);

const ActivityItem = ({ log }: { log: any }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
    <div className={`w-2 h-2 mt-2 rounded-full ${log.type === 'success' ? 'bg-emerald-500' :
        log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
      }`} />
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-800">
        {log.user} <span className="font-normal text-slate-500">{log.action}</span>
      </p>
      <p className="text-xs text-slate-500">{log.target} • {log.time}</p>
    </div>
  </div>
);

const SystemStatusWidget = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
      <FiActivity className="text-blue-500" /> System Status
    </h3>
    <div className="space-y-4">
      {mockSystemStatus.map((item) => (
        <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.bg}`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">{item.name}</p>
              <p className="text-xs text-slate-500">Uptime: {item.uptime}</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === 'Operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
            {item.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function AdminLanggananPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const response = await fetch("/api/admin/schools");
        if (response.ok) {
          const data = await response.json();
          setSchools(data.schools || []);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

  const globalStats = {
    totalSchools: schools.length,
    totalStudents: 12543,
    totalTeachers: 842,
    activeSubs: schools.filter((s) => s.subscriptionStatus === "active").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
              <p className="text-sm text-slate-500">System Governance & Monitoring</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded-full border border-emerald-100 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                System Healthy
              </span>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                SA
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Top Row: Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Schools"
            value={globalStats.totalSchools}
            icon={FiHome}
            color="text-blue-600"
            subtext="+2 this month"
          />
          <StatCard
            title="Active Subscriptions"
            value={globalStats.activeSubs}
            icon={FiCheckCircle}
            color="text-emerald-600"
            subtext="92% Retention Rate"
          />
          <StatCard
            title="Total Students"
            value={globalStats.totalStudents.toLocaleString()}
            icon={FiUsers}
            color="text-violet-600"
            subtext="Across all schools"
          />
          <StatCard
            title="Total Teachers"
            value={globalStats.totalTeachers.toLocaleString()}
            icon={FiUsers}
            color="text-indigo-600"
            subtext="Avg 15:1 Student Ratio"
          />
        </div>

        {/* Middle Row: Charts & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Main Chart: Growth */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800">Subscription Growth</h3>
              <select className="text-sm border-slate-200 rounded-lg text-slate-500">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="active" name="Active" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expired" name="Expired" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: System Status */}
          <SystemStatusWidget />
        </div>

        {/* Bottom Row: Activity & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Audit Log</h3>
              <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <div>
              {mockActivityLogs.map(log => (
                <ActivityItem key={log.id} log={log} />
              ))}
            </div>
          </div>

          {/* School List Preview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Recent Schools</h3>
              <button className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1">
                Manage All <FiCheckCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">School Name</th>
                    <th className="px-4 py-3">Province</th>
                    <th className="px-4 py-3 rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {schools.slice(0, 5).map((school, i) => (
                    <tr key={school.id || i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{school.name}</td>
                      <td className="px-4 py-3 text-slate-500">{school.province}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${school.subscriptionStatus === 'active' ? 'bg-emerald-100 text-emerald-700' :
                            school.subscriptionStatus === 'limited' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                          {school.subscriptionStatus}
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
    </div>
  );
}
