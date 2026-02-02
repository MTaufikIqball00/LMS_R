import React from "react";
import Link from "next/link";
import { TRYOUT_DATA } from "../constants/tryoutdata";

// This is now a Server Component. Access control is handled by middleware.
// It will only be rendered if the user is a grade 12 student.

const TryoutCard = ({ tryout }: { tryout: (typeof TRYOUT_DATA)[0] }) => (
  <div className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:scale-[1.02]">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center text-white text-2xl">
          🎯
        </div>
        <div>
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
            {tryout.title}
          </h3>
          <p className="text-blue-200/70 text-sm">{tryout.subject}</p>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between text-sm text-blue-200/80 mb-6">
      <div className="flex items-center gap-2">
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{tryout.duration} menit</span>
      </div>
      <div className="flex items-center gap-2">
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{tryout.questions.length} soal</span>
      </div>
    </div>

    <Link href={`/tryout/${tryout.id}`}>
      <span className="block w-full text-center bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105">
        Mulai Tryout
      </span>
    </Link>
  </div>
);

export default function TryoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5"></div>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-300 mb-4">
            Tryout Center
          </h1>
          <p className="text-blue-200/80 text-lg max-w-2xl mx-auto">
            Uji kemampuan Anda dan persiapkan diri untuk ujian nasional dan
            seleksi masuk perguruan tinggi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRYOUT_DATA.map((tryout) => (
            <TryoutCard key={tryout.id} tryout={tryout} />
          ))}
        </div>
      </div>
    </div>
  );
}
