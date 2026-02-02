"use client";
import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../../../components/admin/PageHeader";

interface MonthlyReport {
  month: string;
  totalRevenue: number;
  newSubscriptions: number;
  totalActiveSubscriptions: number;
  topPackageId: string;
}

interface ProvinceReport {
  province: string;
  totalSchools: number;
  activeSchools: number;
}

interface Package {
  id: string;
  name: string;
}

// Mock data - will be fetched from API when backend endpoints are ready
const defaultReports = {
  monthly: [
    { month: "2024-01", totalRevenue: 25000000, newSubscriptions: 5, totalActiveSubscriptions: 45, topPackageId: "pkg-1" },
    { month: "2024-02", totalRevenue: 32000000, newSubscriptions: 8, totalActiveSubscriptions: 52, topPackageId: "pkg-2" },
    { month: "2024-03", totalRevenue: 28000000, newSubscriptions: 4, totalActiveSubscriptions: 55, topPackageId: "pkg-1" },
  ],
  byProvince: [
    { province: "Jawa Barat", totalSchools: 120, activeSchools: 95 },
    { province: "Jawa Timur", totalSchools: 85, activeSchools: 70 },
    { province: "DKI Jakarta", totalSchools: 65, activeSchools: 60 },
    { province: "Jawa Tengah", totalSchools: 78, activeSchools: 55 },
  ]
};

const LaporanLanggananPage = () => {
  const [reports, setReports] = useState(defaultReports);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const packagesRes = await fetch("/api/admin/packages");
        if (packagesRes.ok) {
          const packagesData = await packagesRes.json();
          setPackages(packagesData.packages || []);
        }
        // TODO: Fetch reports from API when endpoint is ready
        // const reportsRes = await fetch("/api/admin/reports");
        setReports(defaultReports);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const packageMap = useMemo(() => new Map(packages.map(p => [p.id, p.name])), [packages]);

  const overallStats = useMemo(() => {
    return {
      totalRevenue: reports.monthly.reduce((acc, r) => acc + r.totalRevenue, 0),
      totalActiveSubscriptions: reports.monthly[reports.monthly.length - 1]?.totalActiveSubscriptions || 0,
      totalSchools: reports.byProvince.reduce((acc, p) => acc + p.totalSchools, 0),
    };
  }, [reports]);

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
        title="Laporan Langganan"
        subtitle="Analisis tren langganan, pendapatan, dan demografi sekolah."
      />

      <main className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-sky-100 p-6">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Pendapatan</p>
            <p className="text-3xl font-bold text-sky-600">Rp{overallStats.totalRevenue.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Langganan Aktif</p>
            <p className="text-3xl font-bold text-emerald-600">{overallStats.totalActiveSubscriptions}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            <p className="text-sm font-medium text-slate-600 mb-1">Total Sekolah Terdaftar</p>
            <p className="text-3xl font-bold text-purple-600">{overallStats.totalSchools}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-slate-800 p-6 border-b">Laporan Bulanan</h3>
            <div className="p-6 space-y-4">
              {reports.monthly.map((report) => (
                <div key={report.month}>
                  <p className="font-semibold">{new Date(report.month + "-02").toLocaleString("id-ID", { month: "long", year: "numeric" })}</p>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-slate-600">Pendapatan: <span className="font-bold">Rp{report.totalRevenue.toLocaleString("id-ID")}</span></p>
                    <p className="text-sm text-slate-600">Langganan Baru: <span className="font-bold text-green-600">+{report.newSubscriptions}</span></p>
                    <p className="text-sm text-slate-600">Paket Teratas: <span className="font-bold">{packageMap.get(report.topPackageId) || "N/A"}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Province Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-sky-100">
            <h3 className="text-lg font-semibold text-slate-800 p-6 border-b">Sebaran Sekolah per Provinsi</h3>
            <div className="p-6 space-y-4">
              {reports.byProvince.map((report) => (
                <div key={report.province}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-slate-700">{report.province}</p>
                    <p className="text-sm text-slate-500">{report.activeSchools} / {report.totalSchools} Aktif</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="bg-sky-500 h-2.5 rounded-full"
                      style={{ width: `${(report.activeSchools / report.totalSchools) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-12"></div>
      </main>
    </div>
  );
};

export default LaporanLanggananPage;