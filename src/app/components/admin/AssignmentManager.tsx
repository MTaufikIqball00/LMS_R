"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Assignment } from "../../../app/api/tugas/store";

// ✅ Fix: Use z.number() instead of z.coerce.number()
const assignmentSchema = z.object({
  title: z
    .string()
    .min(3, "Judul minimal 3 karakter")
    .max(100, "Judul maksimal 100 karakter"),
  description: z.string().optional(),
  subject: z
    .string()
    .min(1, "Mata pelajaran tidak boleh kosong")
    .max(50, "Mata pelajaran maksimal 50 karakter"),
  type: z.enum(["essay", "quiz", "project", "presentation"]),
  priority: z.enum(["high", "medium", "low"]),
  points: z
    .number()
    .min(0, "Poin harus angka positif")
    .max(1000, "Poin maksimal 1000"), // ✅ Fixed
});

type AssignmentFormInputs = z.infer<typeof assignmentSchema>;

export default function AssignmentManager() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormInputs>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      priority: "medium",
      type: "essay",
      points: 100,
    },
  });

  // Fetch assignments created by the teacher
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/teacher/assignments");
        if (!response.ok) {
          throw new Error("Gagal mengambil data tugas.");
        }
        const data = await response.json();
        setAssignments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const onSubmit = async (data: AssignmentFormInputs) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/tugas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = "Gagal membuat tugas";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      const newAssignment = result.assignment || result;

      setAssignments((prev) => [newAssignment, ...prev]);
      setIsFormVisible(false);
      setSuccess("Tugas berhasil dibuat!");
      reset();

      // Auto-hide success message
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message);
      // Auto-hide error message
      setTimeout(() => setError(null), 8000);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setError(null);
    setSuccess(null);
    reset();
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Manajemen Tugas
        </h2>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isFormVisible ? "Batal" : "Buat Tugas Baru"}
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {isFormVisible && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Judul Tugas *
              </label>
              <input
                id="title"
                type="text"
                {...register("title")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Masukkan judul tugas"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Mata Pelajaran *
              </label>
              <input
                id="subject"
                type="text"
                {...register("subject")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="e.g., Matematika, Fisika"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Points */}
            <div>
              <label
                htmlFor="points"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Poin Maksimal *
              </label>
              <input
                id="points"
                type="number"
                min="0"
                max="1000"
                step="1"
                {...register("points", { valueAsNumber: true })} // ✅ Key fix: valueAsNumber
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="100"
              />
              {errors.points && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.points.message}
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tipe Tugas
              </label>
              <select
                id="type"
                {...register("type")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              >
                <option value="essay">Esai / Unggah File</option>
                <option value="project">Proyek</option>
                <option value="quiz">Kuis</option>
                <option value="presentation">Presentasi</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Prioritas
              </label>
              <select
                id="priority"
                {...register("priority")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              >
                <option value="high">Tinggi</option>
                <option value="medium">Sedang</option>
                <option value="low">Rendah</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Deskripsi (Opsional)
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                placeholder="Deskripsi detail tentang tugas ini..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
                  Menyimpan...
                </div>
              ) : (
                "Simpan Tugas"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Memuat tugas...
            </span>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium">
              Belum ada tugas yang dibuat
            </h3>
            <p className="text-sm mt-1">
              Klik "Buat Tugas Baru" untuk memulai.
            </p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {assignment.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.priority === "high"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : assignment.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {assignment.priority === "high"
                        ? "Tinggi"
                        : assignment.priority === "medium"
                        ? "Sedang"
                        : "Rendah"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold mb-1">
                    {assignment.subject} • {assignment.type} •{" "}
                    {assignment.points} poin
                  </p>
                  {assignment.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                      {assignment.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>
                      Dibuat:{" "}
                      {new Date(assignment.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                    {assignment.dueDate && (
                      <span>
                        Due:{" "}
                        {new Date(assignment.dueDate).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href={`/teacher/assignment/${assignment.id}`}
                  className="ml-4 flex-shrink-0 px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors duration-200"
                >
                  Lihat & Nilai
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
