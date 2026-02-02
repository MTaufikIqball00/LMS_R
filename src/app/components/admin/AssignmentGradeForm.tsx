"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

// ✅ Use z.number() instead of z.coerce.number()
const gradeSchema = z.object({
  grade: z
    .number()
    .min(0, "Nilai tidak boleh negatif")
    .max(100, "Nilai maksimal 100"),
  feedback: z.string().optional(),
});

type GradeFormInputs = z.infer<typeof gradeSchema>;

interface AssignmentGradeFormProps {
  submissionId: string;
}

export default function AssignmentGradeForm({
  submissionId,
}: AssignmentGradeFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GradeFormInputs>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      grade: 0,
      feedback: "",
    },
  });

  const onSubmit = async (data: GradeFormInputs) => {
    setServerError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        `/api/teacher/submissions/${submissionId}/grade`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        let errorMessage = "Gagal menyimpan nilai.";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      setSuccess("Nilai berhasil disimpan!");

      // Auto-hide success message
      setTimeout(() => setSuccess(null), 3000);

      // Refresh the page to show updated grade
      setTimeout(() => router.refresh(), 1000);
    } catch (error: any) {
      setServerError(error.message);

      // Auto-hide error message
      setTimeout(() => setServerError(null), 8000);
    }
  };

  return (
    <div className="mt-4">
      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
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
      {serverError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
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
            {serverError}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor={`grade-${submissionId}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nilai (0-100) *
          </label>
          <input
            id={`grade-${submissionId}`}
            type="number"
            min="0"
            max="100"
            step="1"
            {...register("grade", { valueAsNumber: true })} // ✅ Key fix: valueAsNumber
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 md:w-1/3"
            placeholder="0-100"
          />
          {errors.grade && (
            <p className="text-red-500 text-sm mt-1">{errors.grade.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor={`feedback-${submissionId}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Feedback (Opsional)
          </label>
          <textarea
            id={`feedback-${submissionId}`}
            {...register("feedback")}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Berikan umpan balik untuk murid..."
          />
          {errors.feedback && (
            <p className="text-red-500 text-sm mt-1">
              {errors.feedback.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors duration-200"
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
              "Simpan Penilaian"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
