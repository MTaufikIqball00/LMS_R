// pages/attendance/history.tsx
"use client";
import React from "react";
import Head from "next/head";
import Link from "next/link";

import AttendanceHistory from "../../components/attendance/AttendanceHistory";

export default function AttendanceHistoryPage() {
  return (
    <>
      <Head>
        <title>Riwayat Absensi - Sistem Absensi</title>
        <meta
          name="description"
          content="Lihat riwayat lengkap absensi Anda dengan filter dan export functionality"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950">
        <div className="container mx-auto px-6 py-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/attendance"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">
                Riwayat Absensi
              </span>
            </div>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  📚 Riwayat Absensi
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Lihat dan analisis catatan absensi Anda secara detail
                </p>
              </div>

              {/* Back to Dashboard Button */}
              <Link
                href="/attendance"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Kembali ke Dashboard
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <AttendanceHistory
            title="Riwayat Absensi Lengkap"
            showFilters={true}
            showExport={true}
          />

          {/* Footer Info */}
          <div className="mt-12 p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Analytics
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Filter dan analisis data absensi dengan mudah
                </p>
              </div>

              <div>
                <div className="text-3xl mb-2">💾</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Export Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download riwayat dalam format CSV
                </p>
              </div>

              <div>
                <div className="text-3xl mb-2">🔍</div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Search & Filter
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Temukan catatan dengan pencarian canggih
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
