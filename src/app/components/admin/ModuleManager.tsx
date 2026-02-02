"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Module } from "../../api/teacher/modules/store";
import {
  FiPlus,
  FiVideo,
  FiFile,
  FiTrash2,
  FiEye,
  FiDownload,
  FiX,
  FiBook,
  FiPlayCircle,
  FiArrowRight,
  FiArrowLeft,
  FiCheck,
  FiUpload,
  FiLink,
  FiFileText,
} from "react-icons/fi";

const moduleSchema = z
  .object({
    title: z.string().min(3, "Judul minimal 3 karakter"),
    description: z.string().optional(),
    type: z.enum(["video_link", "file"]),
    contentUrl: z.string().url({ message: "URL tidak valid" }).optional(),
    fileName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "video_link") return !!data.contentUrl;
      if (data.type === "file") return !!data.fileName;
      return false;
    },
    {
      message: "URL atau nama file harus diisi sesuai tipe modul.",
      path: ["contentUrl"],
    }
  );

type ModuleFormInputs = z.infer<typeof moduleSchema>;

export default function ModuleManager() {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ModuleFormInputs>>({});

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ModuleFormInputs>({
    resolver: zodResolver(moduleSchema),
    defaultValues: { type: "video_link" },
  });

  const selectedType = watch("type");
  const watchedFields = watch();

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/teacher/modules");
        if (!response.ok) throw new Error("Gagal mengambil data modul.");
        const data = await response.json();
        setModules(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  const onSubmit = async (data: ModuleFormInputs) => {
    setError(null);

    // Map frontend type to backend type
    const backendType = data.type === 'video_link' ? 'video' : 'document';

    // Ensure contentUrl is a valid URL for file uploads
    const contentUrl = data.type === 'file' 
      ? `http://example.com/uploads/${data.fileName}` 
      : data.contentUrl;

    const payload = {
      ...data,
      type: backendType,
      contentUrl: contentUrl,
      fileType: data.type === "file" ? "application/octet-stream" : undefined,
    };

    try {
      const response = await fetch("/api/teacher/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat modul");
      }

      const { module: newModule } = await response.json();
      setModules((prev) => [newModule, ...prev]);
      setIsFormOpen(false);
      setCurrentStep(1);
      reset();
      setFormData({});
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (moduleId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus modul ini?")) return;
    setError(null);
    try {
      const response = await fetch(`/api/teacher/modules/${moduleId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menghapus modul.");
      }
      setModules((prev) => prev.filter((mod) => mod.id !== moduleId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const nextStep = () => {
    setFormData({ ...formData, ...watchedFields });
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentStep(1);
    reset();
    setFormData({});
  };

  const openForm = () => {
    setIsFormOpen(true);
    setCurrentStep(1);
  };

  const getStepProgress = () => {
    return (currentStep / 3) * 100;
  };

  return (
    <>
      {/* Background dengan gradient modern */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        {/* Glassmorphism background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg animate-pulse">
                  <FiBook className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Manajemen Modul
                </h1>
              </div>
              <p className="text-lg text-slate-600 font-medium">
                Kelola materi pembelajaran dengan mudah dan modern
              </p>
            </div>

            <button
              onClick={openForm}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 shadow-2xl hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-3">
                <FiPlus className="h-6 w-6 transition-transform group-hover:rotate-180 duration-500" />
                <span className="text-lg">Buat Modul Baru</span>
              </div>
            </button>
          </div>

          {/* Content Section */}
          <div className="space-y-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                  <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-blue-400"></div>
                </div>
                <p className="text-slate-600 mt-6 text-lg font-medium animate-pulse">
                  Memuat modul...
                </p>
              </div>
            ) : modules.length === 0 ? (
              <div className="text-center py-24">
                <div className="backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-16 shadow-2xl max-w-lg mx-auto">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <FiPlayCircle className="h-16 w-16 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-4">
                    Belum ada modul
                  </h3>
                  <p className="text-slate-600 text-xl mb-8">
                    Mulai dengan menambahkan modul pembelajaran pertama
                  </p>
                  <button
                    onClick={openForm}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    Tambah Modul Sekarang
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="group relative backdrop-blur-xl bg-white/40 hover:bg-white/70 border border-white/30 rounded-3xl overflow-hidden transition-all duration-700 hover:scale-[1.05] hover:-translate-y-4 shadow-xl hover:shadow-2xl"
                    style={{
                      animation: `slideInUp 0.8s ease-out ${index * 150}ms forwards`,
                    }}
                  >
                    {/* Card Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`flex items-center gap-3 px-4 py-2 rounded-2xl font-semibold text-sm backdrop-blur-sm transition-all duration-500 ${
                            module.type === "video_link"
                              ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border border-blue-200/50 group-hover:from-blue-500/40 group-hover:to-cyan-500/40"
                              : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border border-purple-200/50 group-hover:from-purple-500/40 group-hover:to-pink-500/40"
                          }`}
                        >
                          {module.type === "video_link" ? (
                            <FiVideo className="h-4 w-4" />
                          ) : (
                            <FiFile className="h-4 w-4" />
                          )}
                          <span>
                            {module.type === "video_link" ? "Video" : "File"}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium bg-slate-100/70 px-3 py-2 rounded-full backdrop-blur-sm">
                          {new Date(module.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <h3 className="font-bold text-xl text-slate-800 mb-3 line-clamp-2 group-hover:text-blue-800 transition-colors duration-300">
                        {module.title}
                      </h3>

                      <p className="text-slate-600 text-sm leading-relaxed h-12 overflow-hidden text-ellipsis opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        {module.description || "Tidak ada deskripsi"}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="px-6 py-5 bg-gradient-to-r from-slate-50/60 to-white/60 border-t border-white/40 flex justify-between items-center backdrop-blur-sm">
                      <a
                        href={module.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-bold text-white rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-2xl ${
                          module.type === "video_link"
                            ? "bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700"
                            : "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700"
                        }`}
                      >
                        {module.type === "video_link" ? (
                          <FiEye className="h-4 w-4" />
                        ) : (
                          <FiDownload className="h-4 w-4" />
                        )}
                        <span>
                          {module.type === "video_link" ? "Tonton" : "Unduh"}
                        </span>
                      </a>

                      <button
                        onClick={() => handleDelete(module.id)}
                        className="group/delete p-3 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50/70 transition-all duration-300 transform hover:scale-125 hover:rotate-12"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Glassmorphism overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-3xl"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Compact Modern Form Panel */}
        {isFormOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 animate-fadeIn"
              onClick={closeForm}
            ></div>

            {/* Compact Sliding Panel - Ukuran lebih kecil */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-gradient-to-br from-white/95 via-white/90 to-blue-50/80 backdrop-blur-2xl border-l border-white/30 shadow-2xl z-50 animate-slideInRight overflow-hidden">
              {/* Compact Form Header */}
              <div className="relative p-6 pb-4 border-b border-white/20 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-indigo-600/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-1">
                      Buat Modul Baru
                    </h2>
                    <p className="text-sm text-slate-600">
                      Langkah {currentStep} dari 3
                    </p>
                  </div>
                  <button
                    onClick={closeForm}
                    className="group p-2 rounded-xl hover:bg-white/50 text-slate-500 hover:text-slate-700 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                {/* Compact Progress Bar */}
                <div className="mt-4 w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-700 ease-out shadow-lg"
                    style={{ width: `${getStepProgress()}%` }}
                  ></div>
                </div>
              </div>

              {/* Compact Form Content */}
              <div className="h-[calc(100vh-180px)] overflow-y-auto p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Step 1: Module Type - More compact */}
                  {currentStep === 1 && (
                    <div className="space-y-6 animate-slideInFromLeft">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          Pilih Tipe Modul
                        </h3>
                        <p className="text-sm text-slate-600">
                          Tentukan jenis konten yang ingin ditambahkan
                        </p>
                      </div>

                      <div className="space-y-4">
                        <label
                          className={`group relative cursor-pointer transition-all duration-300 block ${
                            selectedType === "video_link"
                              ? "scale-105"
                              : "hover:scale-102"
                          }`}
                        >
                          <input
                            type="radio"
                            value="video_link"
                            {...register("type")}
                            className="sr-only"
                          />
                          <div
                            className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                              selectedType === "video_link"
                                ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-300 shadow-lg shadow-blue-500/20"
                                : "bg-white/50 border-white/40 hover:bg-white/70 hover:border-white/60"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-3 rounded-xl transition-all duration-300 ${
                                  selectedType === "video_link"
                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white transform rotate-3"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                }`}
                              >
                                <FiLink className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-slate-800 mb-1">
                                  Link Video
                                </h4>
                                <p className="text-sm text-slate-600">
                                  YouTube, Vimeo, atau platform video lainnya
                                </p>
                                <div className="flex gap-1 mt-2">
                                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                    YouTube
                                  </span>
                                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full font-medium">
                                    Vimeo
                                  </span>
                                </div>
                              </div>
                              {selectedType === "video_link" && (
                                <FiCheck className="h-5 w-5 text-blue-600 animate-bounce" />
                              )}
                            </div>
                          </div>
                        </label>

                        <label
                          className={`group relative cursor-pointer transition-all duration-300 block ${
                            selectedType === "file"
                              ? "scale-105"
                              : "hover:scale-102"
                          }`}
                        >
                          <input
                            type="radio"
                            value="file"
                            {...register("type")}
                            className="sr-only"
                          />
                          <div
                            className={`p-5 rounded-2xl border-2 transition-all duration-300 ${
                              selectedType === "file"
                                ? "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-300 shadow-lg shadow-purple-500/20"
                                : "bg-white/50 border-white/40 hover:bg-white/70 hover:border-white/60"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-3 rounded-xl transition-all duration-300 ${
                                  selectedType === "file"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white transform rotate-3"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                }`}
                              >
                                <FiUpload className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-bold text-slate-800 mb-1">
                                  Upload File
                                </h4>
                                <p className="text-sm text-slate-600">
                                  PDF, PPT, DOC, atau file pembelajaran lainnya
                                </p>
                                <div className="flex gap-1 mt-2">
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                                    PDF
                                  </span>
                                  <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs rounded-full font-medium">
                                    PPT
                                  </span>
                                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                                    DOC
                                  </span>
                                </div>
                              </div>
                              {selectedType === "file" && (
                                <FiCheck className="h-5 w-5 text-purple-600 animate-bounce" />
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Content Details - More compact */}
                  {currentStep === 2 && (
                    <div className="space-y-5 animate-slideInFromLeft">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          {selectedType === "video_link"
                            ? "Detail Video"
                            : "Detail File"}
                        </h3>
                        <p className="text-sm text-slate-600">
                          Masukkan informasi konten pembelajaran
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="title"
                            className="block text-sm font-bold text-slate-700"
                          >
                            Judul Modul
                          </label>
                          <div className="relative">
                            <FiFileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                              id="title"
                              type="text"
                              {...register("title")}
                              className="w-full pl-10 pr-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 font-medium"
                              placeholder="Masukkan judul modul yang menarik..."
                            />
                          </div>
                          {errors.title && (
                            <p className="text-red-500 text-xs font-medium flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        {selectedType === "video_link" ? (
                          <div className="space-y-2">
                            <label
                              htmlFor="contentUrl"
                              className="block text-sm font-bold text-slate-700"
                            >
                              URL Video
                            </label>
                            <div className="relative">
                              <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                              <input
                                id="contentUrl"
                                type="url"
                                {...register("contentUrl")}
                                className="w-full pl-10 pr-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300"
                                placeholder="https://www.youtube.com/watch?v=..."
                              />
                            </div>
                            {errors.contentUrl && (
                              <p className="text-red-500 text-xs font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {errors.contentUrl.message}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <label
                              htmlFor="fileName"
                              className="block text-sm font-bold text-slate-700"
                            >
                              Nama File
                            </label>
                            <div className="relative">
                              <FiFile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                              <input
                                id="fileName"
                                type="text"
                                {...register("fileName")}
                                className="w-full pl-10 pr-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300"
                                placeholder="materi-pembelajaran.pdf"
                              />
                            </div>
                            <p className="text-xs text-slate-500 bg-blue-50/50 p-2 rounded-lg backdrop-blur-sm">
                              💡 Fitur upload file sesungguhnya memerlukan
                              integrasi backend storage
                            </p>
                            {errors.fileName && (
                              <p className="text-red-500 text-xs font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {errors.fileName.message}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Description & Preview - More compact */}
                  {currentStep === 3 && (
                    <div className="space-y-5 animate-slideInFromLeft">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          Deskripsi & Preview
                        </h3>
                        <p className="text-sm text-slate-600">
                          Tambahkan deskripsi dan review detail modul
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="description"
                            className="block text-sm font-bold text-slate-700"
                          >
                            Deskripsi{" "}
                            <span className="text-slate-400 font-normal">
                              (Opsional)
                            </span>
                          </label>
                          <textarea
                            id="description"
                            {...register("description")}
                            rows={4}
                            className="w-full px-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 resize-none"
                            placeholder="Jelaskan tentang materi yang akan dipelajari dalam modul ini..."
                          />
                        </div>

                        {/* Compact Preview Card */}
                        <div className="bg-gradient-to-r from-white/80 to-blue-50/80 border-2 border-white/40 rounded-2xl p-4 backdrop-blur-sm">
                          <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <FiEye className="h-4 w-4" />
                            Preview Modul
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-semibold text-slate-700">
                                Judul:
                              </span>{" "}
                              {watchedFields.title || "Belum diisi"}
                            </p>
                            <p>
                              <span className="font-semibold text-slate-700">
                                Tipe:
                              </span>
                              <span
                                className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  watchedFields.type === "video_link"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}
                              >
                                {watchedFields.type === "video_link"
                                  ? "Video Link"
                                  : "Upload File"}
                              </span>
                            </p>
                            <p className="break-all">
                              <span className="font-semibold text-slate-700">
                                Konten:
                              </span>{" "}
                              {watchedFields.contentUrl ||
                                watchedFields.fileName ||
                                "Belum diisi"}
                            </p>
                            <p>
                              <span className="font-semibold text-slate-700">
                                Deskripsi:
                              </span>{" "}
                              {watchedFields.description ||
                                "Tidak ada deskripsi"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-xl backdrop-blur-sm">
                      <p className="text-red-600 text-sm font-medium text-center flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {error}
                      </p>
                    </div>
                  )}
                </form>
              </div>

              {/* Compact Form Actions */}
              <div className="p-6 pt-4 bg-gradient-to-r from-white/90 to-blue-50/80 border-t border-white/30 backdrop-blur-sm">
                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-2 px-4 py-3 text-slate-700 bg-white/70 hover:bg-white/90 font-semibold rounded-xl transition-all duration-300 text-sm"
                    >
                      <FiArrowLeft className="h-4 w-4" />
                      Kembali
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-3 text-slate-700 bg-slate-100/70 hover:bg-slate-100/90 font-semibold rounded-xl transition-all duration-300 text-sm"
                  >
                    Batal
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={
                        !watchedFields.type ||
                        (currentStep === 2 && !watchedFields.title)
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm shadow-lg"
                    >
                      Lanjutkan
                      <FiArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={handleSubmit(onSubmit)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <FiCheck className="h-4 w-4" />
                          Buat Modul
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom CSS untuk animations */}
      <style jsx>{`
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out forwards;
        }

        .animate-slideInFromLeft {
          animation: slideInFromLeft 0.3s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </>
  );
}
