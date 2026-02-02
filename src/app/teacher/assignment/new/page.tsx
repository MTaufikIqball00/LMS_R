"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiPlus,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiEdit3,
  FiSave,
  FiArrowLeft,
  FiAlertCircle,
  FiBookOpen,
  FiClock,
  FiTarget,
  FiLayers,
  FiUpload,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

export default function NewAssignmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const [subject, setSubject] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [maxScore, setMaxScore] = useState("100");

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const assignmentData = {
      title,
      description,
      targetClass,
      subject,
      dueDate,
      dueTime,
      priority,
      estimatedDuration,
      maxScore,
    };

    try {
      const response = await fetch("/api/teacher/assignments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assignmentData),
      });

      const result = await response.json();

      if (!response.ok) {
        let errorMessage = result.message || "Gagal menyimpan tugas.";
        if (result.errors) {
          const fieldErrors = Object.values(result.errors).flat().join(", ");
          errorMessage += `: ${fieldErrors}`;
        }
        throw new Error(errorMessage);
      }

      // Setelah berhasil, kembali ke halaman manajemen tugas dan paksa reload
      window.location.href = "/teacher/assignment";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <>
      {/* Background dengan gradient modern konsisten */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/50 relative overflow-hidden">
        {/* Glassmorphism background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]"></div>
        </div>

        <div className="relative z-10 p-6 lg:p-8">
          {/* Modern Header Section */}
          <div className="mb-12">
            <div className="backdrop-blur-xl bg-white/40 border border-white/30 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/teacher/assignment">
                  <button className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110">
                    <FiArrowLeft className="h-6 w-6" />
                  </button>
                </Link>
                <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-lg animate-pulse">
                  <FiPlus className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-orange-800 to-red-800 bg-clip-text text-transparent">
                    Buat Tugas Baru
                  </h1>
                  <p className="text-lg text-slate-600 font-medium mt-2">
                    Buat tugas yang menarik dan menantang untuk siswa
                  </p>
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiFileText className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Assignment Creator
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiEdit3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Smart Form
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8 pb-6 bg-gradient-to-r from-orange-600/10 via-red-600/5 to-pink-600/10 border-b border-white/20">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-orange-800 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                    <FiInfo className="h-7 w-7 text-orange-600" />
                    Informasi Dasar
                  </h2>
                  <p className="text-slate-600">
                    Detail utama tentang tugas yang akan dibuat
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Title */}
                  <div className="space-y-3">
                    <label
                      htmlFor="title"
                      className=" text-lg font-bold text-slate-700 flex items-center gap-2"
                    >
                      <FiFileText className="h-5 w-5 text-orange-600" />
                      Judul Tugas
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 text-lg font-medium"
                      placeholder="Contoh: Analisis Ekosistem Hutan Tropis"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label
                      htmlFor="description"
                      className=" text-lg font-bold text-slate-700 flex items-center gap-2"
                    >
                      <FiEdit3 className="h-5 w-5 text-orange-600" />
                      Deskripsi & Instruksi
                    </label>
                    <textarea
                      id="description"
                      rows={6}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 resize-none"
                      placeholder="Jelaskan instruksi tugas secara detail, termasuk:
• Tujuan pembelajaran yang ingin dicapai
• Langkah-langkah yang harus dilakukan siswa
• Format pengumpulan (dokumen, presentasi, dll)
• Kriteria penilaian yang akan digunakan"
                      required
                    />
                  </div>

                  {/* Class and Subject Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label
                        htmlFor="subject"
                        className=" text-lg font-bold text-slate-700 flex items-center gap-2"
                      >
                        <FiBookOpen className="h-5 w-5 text-emerald-600" />
                        Mata Pelajaran
                      </label>
                      <select
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300 text-lg"
                        required
                      >
                        <option value="" disabled>
                          Pilih Mata Pelajaran
                        </option>
                        <option value="Biologi">Biologi</option>
                        <option value="Matematika">Matematika</option>
                        <option value="Kimia">Kimia</option>
                        <option value="Fisika">Fisika</option>
                        <option value="Bahasa Indonesia">
                          Bahasa Indonesia
                        </option>
                        <option value="Bahasa Inggris">Bahasa Inggris</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="targetClass"
                        className=" text-lg font-bold text-slate-700 flex items-center gap-2"
                      >
                        <FiUsers className="h-5 w-5 text-blue-600" />
                        Kelas Target
                      </label>
                      <select
                        id="targetClass"
                        value={targetClass}
                        onChange={(e) => setTargetClass(e.target.value)}
                        className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300 text-lg"
                        required
                      >
                        <option value="" disabled>
                          Pilih Kelas
                        </option>
                        <option value="X A">X A</option>
                        <option value="X B">X B</option>
                        <option value="X C">X C</option>
                        <option value="XI A">XI A</option>
                        <option value="XI B">XI B</option>
                        <option value="XII A">XII A</option>
                        <option value="XII B">XII B</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule & Settings Section */}
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8 pb-6 bg-gradient-to-r from-blue-600/10 via-cyan-600/5 to-teal-600/10 border-b border-white/20">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                    <FiClock className="h-7 w-7 text-blue-600" />
                    Pengaturan Jadwal
                  </h2>
                  <p className="text-slate-600">
                    Atur deadline dan pengaturan tugas
                  </p>
                </div>

                <div className="p-8 space-y-8">
                  {/* Date and Time Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label
                        htmlFor="dueDate"
                        className=" text-lg font-bold text-slate-700 flex items-center gap-2"
                      >
                        <FiCalendar className="h-5 w-5 text-blue-600" />
                        Tanggal Deadline
                      </label>
                      <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300 text-lg"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="dueTime"
                        className=" text-lg font-bold text-slate-700 flex items-center gap-2"
                      >
                        <FiClock className="h-5 w-5 text-blue-600" />
                        Waktu Deadline
                      </label>
                      <input
                        type="time"
                        id="dueTime"
                        value={dueTime}
                        onChange={(e) => setDueTime(e.target.value)}
                        className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300 text-lg"
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Settings Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label
                        htmlFor="priority"
                        className=" text-lg font-bold text-slate-700 flex items-center gap-2"
                      >
                        <FiTarget className="h-5 w-5 text-purple-600" />
                        Prioritas
                      </label>
                      <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300 text-lg"
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                      </select>
                      <div
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${getPriorityColor(
                          priority
                        )}`}
                      >
                        {priority} Priority
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="estimatedDuration"
                        className=" text-lg font-bold text-slate-700 flex items-center gap-2"
                      >
                        <FiClock className="h-5 w-5 text-indigo-600" />
                        Estimasi Waktu
                      </label>
                      <select
                        id="estimatedDuration"
                        value={estimatedDuration}
                        onChange={(e) => setEstimatedDuration(e.target.value)}
                        className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300 text-lg"
                      >
                        <option value="">Pilih Durasi</option>
                        <option value="30 menit">30 menit</option>
                        <option value="1 jam">1 jam</option>
                        <option value="2 jam">2 jam</option>
                        <option value="1 hari">1 hari</option>
                        <option value="1 minggu">1 minggu</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label
                        htmlFor="maxScore"
                        className=" text-lg font-bold text-slate-700 flex items-center gap-2"
                      >
                        <FiTarget className="h-5 w-5 text-green-600" />
                        Skor Maksimal
                      </label>
                      <input
                        type="number"
                        id="maxScore"
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300 text-lg"
                        min="1"
                        max="1000"
                        placeholder="100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8 pb-6 bg-gradient-to-r from-purple-600/10 via-pink-600/5 to-red-600/10 border-b border-white/20">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-purple-800 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                    <FiUpload className="h-7 w-7 text-purple-600" />
                    Lampiran{" "}
                    <span className="text-slate-400 font-normal text-base">
                      (Opsional)
                    </span>
                  </h2>
                  <p className="text-slate-600">
                    Upload file pendukung untuk tugas
                  </p>
                </div>

                <div className="p-8">
                  <div className="border-2 border-dashed border-purple-300 rounded-2xl p-8 text-center bg-purple-50/50">
                    <FiUpload className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-600 font-semibold mb-2">
                      Drag & drop files atau klik untuk upload
                    </p>
                    <p className="text-slate-500 text-sm mb-4">
                      Mendukung: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX (Max:
                      10MB)
                    </p>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <FiUpload className="h-4 w-4" />
                      Pilih File
                    </label>
                  </div>

                  {/* File List */}
                  {attachments.length > 0 && (
                    <div className="mt-6 space-y-3">
                      <h4 className="font-semibold text-slate-700">
                        File yang akan diupload:
                      </h4>
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/70 rounded-xl border border-white/40"
                        >
                          <div className="flex items-center gap-3">
                            <FiFileText className="h-5 w-5 text-purple-600" />
                            <span className="font-medium text-slate-700">
                              {file.name}
                            </span>
                            <span className="text-sm text-slate-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="my-4 p-4 bg-red-100 text-red-700 border border-red-200 rounded-xl">
                  <p><b>Terjadi Kesalahan:</b> {error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Link href="/teacher/assignment">
                    <button
                      type="button"
                      className="w-full sm:w-auto px-8 py-4 bg-white/70 hover:bg-white/90 text-slate-700 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/40 text-lg"
                    >
                      Batal
                    </button>
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-xl transition-all duration-500 transform hover:scale-110 disabled:scale-100 shadow-2xl hover:shadow-orange-500/25 disabled:cursor-not-allowed text-lg"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Menyimpan Tugas...</span>
                        </>
                      ) : (
                        <>
                          <FiSave className="h-6 w-6 transition-transform group-hover:rotate-12 duration-300" />
                          <span>Simpan Tugas</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Custom CSS untuk animations */}
        <style jsx global>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </>
  );
}
