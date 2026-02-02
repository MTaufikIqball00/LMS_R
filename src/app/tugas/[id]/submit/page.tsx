"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { SAMPLE_QUIZ } from "../../../constants/quizdata";
import Quiz from "../../../components/Quiz";

export default function AddAssignmentPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignmentName, setAssignmentName] = useState("");
  const [description, setDescription] = useState("");
  const [displayOnCoursePage, setDisplayOnCoursePage] = useState(false);

  // New state for task detection
  const [taskData, setTaskData] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Load task data
  useEffect(() => {
    const fetchTask = async () => {
      setPageLoading(true);
      try {
        const response = await fetch("/api/tugas");
        if (!response.ok) {
          throw new Error("Gagal memuat tugas");
        }
        const tasks = await response.json();
        const task = tasks.find((t: any) => t.id === params.id);
        setTaskData(task);
      } catch (error) {
        setError("Gagal memuat data tugas.");
      } finally {
        setPageLoading(false);
      }
    };

    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  // Quiz completion handler
  const handleQuizComplete = (results: any) => {
    console.log("Quiz completed:", results);
    // router.push(`/tugas/${params.id}/result`);
  };

  // File handling functions
  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const replaceFile = (index: number, newFile: File) => {
    setFiles((prev) => prev.map((file, i) => (i === index ? newFile : file)));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!assignmentName.trim()) {
      setError("Assignment name is required");
      return;
    }

    const fd = new FormData();
    // Append multiple files
    files.forEach((file, index) => {
      fd.append(`files`, file);
    });
    fd.append("taskId", params.id ?? "unknown");
    fd.append("assignmentName", assignmentName);
    fd.append("description", description);
    fd.append("displayOnCoursePage", displayOnCoursePage.toString());

    setLoading(true);
    try {
      const res = await fetch("/api/assignments/submit", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error || "Failed to submit assignment");
      } else {
        if (!json.submissionId) {
          router.push(
            `/tugas/${params.id}/result?submissionId=${json.submissionId}`
          ); // Redirect to result page
        } else {
          router.push(`/tugas`);
        }
      }
    } catch (err) {
      setError("Failed to submit assignment");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Task not found
  if (!taskData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Tugas Tidak Ditemukan
          </h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // Quiz type - return Quiz component
  if (taskData.type === "quiz") {
    return (
      <Quiz
        questions={SAMPLE_QUIZ.map((q) => ({ ...q, id: String(q.id) }))}
        title={taskData.title}
        onComplete={handleQuizComplete}
      />
    );
  }

  // Regular assignment form
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-300 flex items-center">
                📝 Mengerjakan: {taskData?.title || "Assignment"}
              </h1>
              {taskData && (
                <p className="text-blue-200/80 mt-2">
                  {taskData.subject} • {taskData.points} poin
                </p>
              )}
            </div>
            {taskData && (
              <div className="text-right">
                <p className="text-blue-200/60 text-sm">Batas waktu</p>
                <p className="text-white font-medium">
                  {new Date(taskData.dueDate).toLocaleDateString("id-ID")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Task Description */}
        {taskData?.description && (
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Deskripsi Tugas
            </h3>
            <p className="text-blue-200/80">{taskData.description}</p>
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl border border-white/10 shadow-xl">
          <form onSubmit={onSubmit} className="p-8 space-y-8">
            {/* General Section */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <span className="text-cyan-300">▼</span>
                <span className="ml-2">General</span>
              </h2>

              {/* Assignment Name */}
              <div className="mb-8">
                <label className="flex items-center text-blue-200 font-semibold mb-3">
                  Assignment name
                  <span className="ml-2 text-red-400 text-lg">⚠️</span>
                </label>
                <input
                  type="text"
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300"
                  placeholder="Enter assignment name..."
                  required
                />
              </div>

              {/* Additional Files Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center text-blue-200 font-semibold">
                    Additional files
                    <span className="ml-2 text-cyan-400">ℹ️</span>
                  </h3>
                  <span className="text-sm text-blue-300">
                    Maximum size for new files: Unlimited
                  </span>
                </div>

                {/* Upload Area */}
                <div
                  className="border-2 border-dashed border-white/20 rounded-xl p-8 bg-white/5 hover:bg-white/10 transition-all duration-300"
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="text-center">
                    <div className="mb-4">
                      <span className="text-5xl">📁</span>
                      <p className="font-semibold text-blue-200 mt-2">Files</p>
                    </div>
                    <div className="mb-6">
                      <span className="text-6xl text-cyan-400">⬇️</span>
                    </div>
                    <p className="text-blue-200/80 mb-4">
                      You can drag and drop files here to add them.
                    </p>

                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        onChange={(ev) => handleFileSelect(ev.target.files)}
                        accept=".zip,.rar,.7z,.txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.xls"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-400/30 rounded-lg p-4 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300">
                        <p className="text-cyan-300 font-semibold">
                          Choose Files or Drag & Drop
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-blue-200 font-semibold flex items-center">
                      <span className="mr-2">📋</span>
                      Selected Files ({files.length})
                    </h4>

                    {files.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="bg-white/5 border border-white/20 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {/* File Icon */}
                            <div className="flex-shrink-0">
                              {file.type.startsWith("image/") ? (
                                <span className="text-2xl">🖼️</span>
                              ) : file.type === "application/pdf" ? (
                                <span className="text-2xl">📄</span>
                              ) : file.type.includes("zip") ||
                                file.type.includes("rar") ? (
                                <span className="text-2xl">🗜️</span>
                              ) : (
                                <span className="text-2xl">📎</span>
                              )}
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">
                                {file.name}
                              </p>
                              <p className="text-blue-300 text-sm">
                                {formatFileSize(file.size)} •{" "}
                                {file.type || "Unknown type"}
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center space-x-2 ml-4">
                            {/* Replace Button */}
                            <div className="relative">
                              <input
                                type="file"
                                onChange={(ev) => {
                                  if (ev.target.files && ev.target.files[0]) {
                                    replaceFile(index, ev.target.files[0]);
                                  }
                                }}
                                accept=".zip,.rar,.7z,.txt,.pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx,.xls"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <button
                                type="button"
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-lg transition-all duration-200 group"
                                title="Replace file"
                              >
                                <svg
                                  className="w-4 h-4 text-blue-300 group-hover:text-blue-200"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-all duration-200 group"
                              title="Remove file"
                            >
                              <svg
                                className="w-4 h-4 text-red-300 group-hover:text-red-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* File Preview for Images */}
                        {file.type.startsWith("image/") && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="max-w-full h-32 object-cover rounded-lg border border-white/20"
                              onLoad={(e) => {
                                // Clean up object URL to prevent memory leaks
                                URL.revokeObjectURL(
                                  (e.target as HTMLImageElement).src
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Clear All Button */}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setFiles([])}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-red-200 transition-all duration-200 flex items-center space-x-2"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Clear All Files</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="block text-blue-200 font-semibold mb-3">
                  Description
                </label>
                <div className="bg-white/5 border border-white/20 rounded-lg overflow-hidden">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 h-40 bg-transparent text-white placeholder-blue-200/60 border-0 resize-none focus:outline-none"
                    placeholder="Enter assignment description..."
                  />
                </div>

                {/* Display on course page checkbox */}
                <div className="flex items-center mt-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="displayOnCoursePage"
                      checked={displayOnCoursePage}
                      onChange={(e) => setDisplayOnCoursePage(e.target.checked)}
                      className="sr-only"
                    />
                    <label
                      htmlFor="displayOnCoursePage"
                      className={`flex items-center cursor-pointer transition-all duration-300 ${
                        displayOnCoursePage ? "text-cyan-300" : "text-blue-200"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-all duration-300 ${
                          displayOnCoursePage
                            ? "bg-gradient-to-r from-blue-500 to-cyan-500 border-cyan-400"
                            : "border-white/30 bg-white/5"
                        }`}
                      >
                        {displayOnCoursePage && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      Display description on course page
                      <span className="ml-2 text-cyan-400">ℹ️</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
                <p className="text-red-300 font-semibold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-white/10">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Submitting...
                  </div>
                ) : (
                  "Submit Assignment"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
