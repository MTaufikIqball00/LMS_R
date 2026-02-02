"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { SubmissionMeta } from "../../../types/submission";

export default function ResultPage() {
  const search = useSearchParams();
  const submissionId = search?.get("submissionId");
  const router = useRouter();
  const [submission, setSubmission] = useState<SubmissionMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!submissionId) return;
    setLoading(true);
    fetch(`/api/tugas/submission?id=${encodeURIComponent(submissionId)}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) setError(j.error);
        else setSubmission(j.submission);
      })
      .catch(() => setError("Gagal mengambil data"))
      .finally(() => setLoading(false));
  }, [submissionId]);

  if (!submissionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Tugas Berhasil Dikirim!
            </h2>
            <p className="text-blue-200/80 mb-6">
              Tugas Anda telah berhasil dikirim dan sedang menunggu penilaian
              dari pengajar.
            </p>
            <button
              onClick={() => router.push("/tugas")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kembali ke Tugas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/5"></div>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-300 mb-4">
            📋 Detail Pengumpulan Tugas
          </h1>
          <p className="text-blue-200/80 text-lg">
            Status dan informasi pengumpulan tugas Anda
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
          <div className="p-8">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center">
                  <svg
                    className="animate-spin h-8 w-8 text-cyan-400 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="text-white text-lg">
                    Memuat data submission...
                  </span>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-6 text-center">
                <div className="text-5xl mb-4">❌</div>
                <h3 className="text-red-300 text-xl font-bold mb-2">
                  Terjadi Kesalahan
                </h3>
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Submission Data */}
            {submission && (
              <div className="space-y-8">
                {/* File Information */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    📄 Informasi File
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-blue-200/80 text-sm font-medium block mb-1">
                          Nama File
                        </label>
                        <p className="text-white font-semibold bg-white/10 p-3 rounded-lg border border-white/20">
                          {submission.filename}
                        </p>
                      </div>
                      <div>
                        <label className="text-blue-200/80 text-sm font-medium block mb-1">
                          Ukuran File
                        </label>
                        <p className="text-cyan-300 font-semibold bg-white/10 p-3 rounded-lg border border-white/20">
                          {(submission.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-blue-200/80 text-sm font-medium block mb-1">
                          Tipe File
                        </label>
                        <p className="text-white font-semibold bg-white/10 p-3 rounded-lg border border-white/20">
                          {submission.mimeType}
                        </p>
                      </div>
                      <div>
                        <label className="text-blue-200/80 text-sm font-medium block mb-1">
                          Waktu Upload
                        </label>
                        <p className="text-green-300 font-semibold bg-white/10 p-3 rounded-lg border border-white/20">
                          {new Date(submission.submittedAt).toLocaleString(
                            "id-ID",
                            {
                              dateStyle: "full",
                              timeStyle: "short",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grading Status */}
                {submission.graded ? (
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-xl p-6">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">✅</div>
                      <h2 className="text-2xl font-bold text-green-300">
                        Sudah Dinilai
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-green-200/80 text-sm font-medium block mb-2">
                          Nilai
                        </label>
                        <div className="bg-white/10 p-4 rounded-lg border border-green-400/30">
                          <span className="text-3xl font-bold text-green-300">
                            {submission.graded.score}
                          </span>
                          <span className="text-green-200 ml-2">/ 100</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-green-200/80 text-sm font-medium block mb-2">
                          Dinilai Pada
                        </label>
                        <div className="bg-white/10 p-4 rounded-lg border border-green-400/30">
                          <span className="text-green-200 font-semibold">
                            {new Date(
                              submission.graded.gradedAt
                            ).toLocaleString("id-ID", {
                              dateStyle: "full",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {submission.graded.feedback && (
                      <div className="mt-6">
                        <label className="text-green-200/80 text-sm font-medium block mb-2">
                          Feedback Pengajar
                        </label>
                        <div className="bg-white/10 p-4 rounded-lg border border-green-400/30">
                          <p className="text-green-100 leading-relaxed">
                            {submission.graded.feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/30 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-4xl mr-4">⏳</div>
                      <h2 className="text-2xl font-bold text-yellow-300">
                        Belum Dinilai
                      </h2>
                    </div>

                    <div className="bg-white/10 p-4 rounded-lg border border-yellow-400/30">
                      <p className="text-yellow-200 text-lg leading-relaxed">
                        Tugas Anda telah berhasil dikirim dan sedang menunggu
                        penilaian dari pengajar. Anda akan mendapatkan
                        notifikasi ketika nilai sudah tersedia.
                      </p>
                    </div>

                    <div className="mt-4 flex items-center text-yellow-200/80">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">
                        Status akan diperbarui secara otomatis
                      </span>
                    </div>
                  </div>
                )}

                {/* Submission ID Info */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-200/80 text-sm">
                      Submission ID:
                    </span>
                    <code className="text-cyan-300 bg-white/10 px-3 py-1 rounded text-sm font-mono">
                      {submissionId}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
