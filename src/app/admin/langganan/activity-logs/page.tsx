"use client";
import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../../components/admin/PageHeader";
import Table from "../../../components/admin/Table";

interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

// Mock data - will be fetched from API when backend endpoints are ready
const defaultActivityLogs: ActivityLog[] = [
  { id: "log-1", userId: "user-1", action: "LOGIN", details: "User logged in successfully", timestamp: "2024-03-15T10:30:00Z", ipAddress: "192.168.1.1" },
  { id: "log-2", userId: "user-2", action: "CREATE_SUBSCRIPTION", details: "Created new subscription for School A", timestamp: "2024-03-15T11:00:00Z", ipAddress: "192.168.1.5" },
  { id: "log-3", userId: "user-1", action: "UPDATE_SCHOOL", details: "Updated school information", timestamp: "2024-03-15T12:15:00Z", ipAddress: "192.168.1.1" },
];

const LogAktivitasPage = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersRes = await fetch("/api/admin/users");
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users || []);
        }
        // TODO: Fetch activity logs from API when endpoint is ready
        // const logsRes = await fetch("/api/admin/activity-logs");
        setActivityLogs(defaultActivityLogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const userMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

  const columns = [
    {
      header: "Timestamp",
      accessor: (row: ActivityLog) => new Date(row.timestamp).toLocaleString("id-ID"),
    },
    {
      header: "Pengguna",
      accessor: (row: ActivityLog) => {
        const user = userMap.get(row.userId);
        return user ? (
          <div>
            <p className="font-semibold text-slate-900">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        ) : (
          "Pengguna Tidak Dikenal"
        );
      },
    },
    {
      header: "Aksi",
      accessor: (row: ActivityLog) => (
        <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded">
          {row.action}
        </span>
      ),
    },
    {
      header: "Detail",
      accessor: (row: ActivityLog) => row.details,
    },
    {
      header: "Alamat IP",
      accessor: (row: ActivityLog) => row.ipAddress,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <PageHeader
        title="Log Aktivitas"
        subtitle="Lacak semua aktivitas penting yang terjadi di dalam sistem."
      />

      <main className="max-w-7xl mx-auto px-6 -mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
          <Table columns={columns} data={activityLogs} keyExtractor={(log) => log.id} />
        </div>
        <div className="h-12"></div>
      </main>
    </div>
  );
};

export default LogAktivitasPage;