// pages/attendance/index.tsx
"use client";

import React from "react";
import Head from "next/head";

import AttendanceDashboard from "../components/attendance/AttendanceDashboard"; // ✅ Fixed import path
import AttendanceErrorBoundary from "../components/attendance/AttendanceErrorBoundary";

export default function AttendancePage() {
  return (
    <>
      <Head>
        <title>Sistem Absensi - Dashboard</title>
        <meta
          name="description"
          content="Sistem absensi modern dengan QR Code scanner dan location-based verification"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* ✅ Add additional meta tags for better SEO */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#3b82f6" />
      </Head>

      {/* ✅ Add Error Boundary to prevent crashes */}
      <AttendanceErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950">
            {/* ✅ Add loading fallback */}
            <React.Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold text-gray-700">
                      Loading Attendance System...
                    </h2>
                  </div>
                </div>
              }
            >
              <AttendanceDashboard />
            </React.Suspense>
          </div>
      </AttendanceErrorBoundary>
    </>
  );
}
