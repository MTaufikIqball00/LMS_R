"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import React from "react";
import {
  FiPlus,
  FiTrash2,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiBookOpen,
  FiEdit3,
  FiFileText,
  FiHelpCircle,
  FiList,
  FiType,
  FiTarget,
  FiSave,
  FiArrowLeft,
  FiArrowRight,
  FiZap,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
} from "react-icons/fi";

// Zod Schema for validation
const choiceSchema = z.object({
  text: z.string(),
});

const questionSchema = z
  .object({
    questionText: z.string().min(5, "Teks pertanyaan minimal 5 karakter"),
    questionType: z.enum(["multiple_choice", "essay"]),
    choices: z.array(choiceSchema).optional(),
    correctAnswer: z.string().optional(),
    // Essay specific fields
    sampleAnswer: z.string().optional(),
    maxScore: z.number().min(1).max(100).optional(),
    weight: z.number().min(1).max(100).optional(),
    rubric: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.questionType === "multiple_choice") {
      if (!data.choices || data.choices.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Pilihan ganda harus memiliki setidaknya 2 pilihan.",
          path: ["choices"],
        });
      } else {
        data.choices.forEach((choice, index) => {
          if (choice.text.trim() === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Teks pilihan tidak boleh kosong.",
              path: [`choices`, index, "text"],
            });
          }
        });
      }

      if (!data.correctAnswer) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Jawaban yang benar harus dipilih.",
          path: ["correctAnswer"],
        });
      }
    }
  });

const quizSchema = z.object({
  title: z.string().min(3, "Judul kuis minimal 3 karakter"),
  subject: z.string().min(1, "Mata pelajaran tidak boleh kosong"),
  description: z.string().optional(),
  questions: z
    .array(questionSchema)
    .min(1, "Kuis harus memiliki setidaknya satu pertanyaan"),
});

type QuizFormInputs = z.infer<typeof quizSchema>;

export default function QuizBuilder() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<QuizFormInputs>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      subject: "",
      description: "",
      questions: [
        {
          questionText: "",
          questionType: "multiple_choice",
          choices: [{ text: "" }, { text: "" }],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchedQuestions = watch("questions");

  const onSubmit = async (data: QuizFormInputs) => {
    setServerError(null);
    try {
      const response = await fetch("/api/teacher/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat kuis.");
      }

      router.push("/teacher/quizzes");
      router.refresh();
    } catch (error: any) {
      setServerError(error.message);
    }
  };

  const addQuestion = () => {
    append({
      questionText: "",
      questionType: "multiple_choice",
      choices: [{ text: "" }, { text: "" }],
    });
    setCurrentQuestionIndex(fields.length); // Move to new question
  };

  const removeQuestion = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      // Adjust current index if needed
      if (currentQuestionIndex >= fields.length - 1) {
        setCurrentQuestionIndex(Math.max(0, fields.length - 2));
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < fields.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <>
      {/* Background dengan gradient modern konsisten */}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/50 relative overflow-hidden">
        {/* Glassmorphism background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 p-6 lg:p-8">
          {/* Modern Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-12">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => router.back()}
                  className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110"
                >
                  <FiArrowLeft className="h-6 w-6" />
                </button>
                <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-lg animate-pulse">
                  <FiEdit3 className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
                  Buat Kuis Baru
                </h1>
              </div>
              <p className="text-lg text-slate-600 font-medium">
                Buat kuis interaktif untuk mengukur pemahaman siswa
              </p>

              {/* Progress Indicator */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiList className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {watchedQuestions?.length || 0} Pertanyaan
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <FiZap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    Quiz Builder
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Quiz Details Card */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl shadow-2xl overflow-hidden animate-slideInUp">
              <div className="p-8 pb-6 bg-gradient-to-r from-emerald-600/10 via-teal-600/5 to-cyan-600/10 border-b border-white/20">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-emerald-800 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                  <FiBookOpen className="h-7 w-7 text-emerald-600" />
                  Detail Kuis
                </h2>
                <p className="text-slate-600">
                  Informasi dasar tentang kuis yang akan dibuat
                </p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label
                      htmlFor="title"
                      className=" text-sm font-bold text-slate-700 flex items-center gap-2"
                    >
                      <FiType className="h-4 w-4 text-emerald-600" />
                      Judul Kuis
                    </label>
                    <input
                      id="title"
                      {...register("title")}
                      className="w-full px-4 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 font-medium text-lg"
                      placeholder="Masukkan judul kuis yang menarik..."
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="subject"
                      className=" text-sm font-bold text-slate-700 flex items-center gap-2"
                    >
                      <FiTarget className="h-4 w-4 text-teal-600" />
                      Mata Pelajaran
                    </label>
                    <input
                      id="subject"
                      {...register("subject")}
                      className="w-full px-4 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 font-medium text-lg"
                      placeholder="Contoh: Matematika, Fisika, dll..."
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="lg:col-span-2 space-y-3">
                    <label
                      htmlFor="description"
                      className=" text-sm font-bold text-slate-700 flex items-center gap-2"
                    >
                      <FiFileText className="h-4 w-4 text-cyan-600" />
                      Deskripsi{" "}
                      <span className="text-slate-400 font-normal">
                        (Opsional)
                      </span>
                    </label>
                    <textarea
                      id="description"
                      {...register("description")}
                      rows={4}
                      className="w-full px-4 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 resize-none"
                      placeholder="Jelaskan tujuan dan materi yang akan dicakup dalam kuis ini..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Section with Horizontal Layout */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
              {/* Questions Header */}
              <div className="p-6 pb-4 bg-gradient-to-r from-emerald-600/10 via-teal-600/5 to-cyan-600/10 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiHelpCircle className="h-7 w-7 text-emerald-600" />
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-emerald-800 bg-clip-text text-transparent">
                        Pertanyaan
                      </h2>
                      <p className="text-slate-600 text-sm">
                        Pertanyaan {currentQuestionIndex + 1} dari{" "}
                        {fields.length}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-xl hover:shadow-emerald-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <div className="relative flex items-center gap-2">
                      <FiPlus className="h-5 w-5 transition-transform group-hover:rotate-180 duration-500" />
                      <span>Tambah Pertanyaan</span>
                    </div>
                  </button>
                </div>

                {/* Question Pagination Dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                  {fields.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToQuestion(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentQuestionIndex
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 scale-125 shadow-lg"
                          : "bg-slate-300 hover:bg-slate-400 hover:scale-110"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question Navigation */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50/50 to-white/50 border-b border-white/20">
                <button
                  type="button"
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white/90 disabled:bg-slate-100/50 disabled:cursor-not-allowed text-slate-700 disabled:text-slate-400 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 backdrop-blur-sm border border-white/40"
                >
                  <FiChevronLeft className="h-4 w-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50/80 rounded-xl border border-emerald-200/50">
                  <span className="text-sm font-bold text-emerald-800">
                    {currentQuestionIndex + 1} / {fields.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === fields.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white/90 disabled:bg-slate-100/50 disabled:cursor-not-allowed text-slate-700 disabled:text-slate-400 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 backdrop-blur-sm border border-white/40"
                >
                  <span>Selanjutnya</span>
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Current Question Display */}
              <div className="p-6">
                {fields.length > 0 && (
                  <QuestionField
                    key={fields[currentQuestionIndex].id}
                    index={currentQuestionIndex}
                    control={control}
                    register={register}
                    watch={watch}
                    errors={errors}
                    remove={removeQuestion}
                    setValue={setValue}
                    totalQuestions={fields.length}
                  />
                )}
              </div>

              {/* Quick Question Navigation */}
              <div className="p-4 bg-gradient-to-r from-slate-50/50 to-white/50 border-t border-white/20">
                <div className="flex items-center justify-center">
                  <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
                    {fields.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => goToQuestion(index)}
                        className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all duration-300 transform hover:scale-110 ${
                          index === currentQuestionIndex
                            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-110"
                            : errors.questions?.[index]
                            ? "bg-red-100 text-red-600 hover:bg-red-200 border-2 border-red-300"
                            : "bg-white/70 text-slate-700 hover:bg-white/90 border-2 border-white/40"
                        } backdrop-blur-sm`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error Messages */}
            {errors.questions?.root && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-2xl backdrop-blur-sm">
                <p className="text-red-600 font-medium flex items-center gap-2">
                  <FiAlertCircle className="h-5 w-5" />
                  {errors.questions.root.message}
                </p>
              </div>
            )}

            {/* Server Error */}
            {serverError && (
              <div className="backdrop-blur-xl bg-red-50/90 border border-red-200/50 rounded-2xl p-6 shadow-lg animate-shake">
                <p className="text-red-600 font-medium text-center flex items-center justify-center gap-3">
                  <FiAlertCircle className="h-6 w-6" />
                  {serverError}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={isSubmitting || fields.length === 0}
                className="group relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-500 transform hover:scale-110 disabled:scale-100 shadow-2xl hover:shadow-green-500/25 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-lg">Menyimpan Kuis...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="h-6 w-6 transition-transform group-hover:rotate-12 duration-300" />
                      <span className="text-lg">Simpan Kuis</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>
        </div>
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

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}

function QuestionField({
  index,
  control,
  register,
  watch,
  errors,
  remove,
  setValue,
  totalQuestions,
}: any) {
  const {
    fields: choiceFields,
    append: appendChoice,
    remove: removeChoice,
  } = useFieldArray({
    control,
    name: `questions.${index}.choices`,
  });

  const questionType = (control as any)._getWatch(
    `questions.${index}.questionType`
  );

  React.useEffect(() => {
    if (questionType === 'essay') {
      setValue(`questions.${index}.choices`, []);
      setValue(`questions.${index}.correctAnswer`, undefined);
    }
  }, [questionType, index, setValue]);

  return (
    <div className="animate-slideInRight">
      {/* Question Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
            {index + 1}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">
              Pertanyaan {index + 1}
            </h3>
            <p className="text-sm text-slate-600">
              {questionType === "multiple_choice" ? "Pilihan Ganda" : "Esai"}
            </p>
          </div>
        </div>

        {totalQuestions > 1 && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="group p-4 rounded-2xl text-slate-400 hover:text-red-600 hover:bg-red-50/70 transition-all duration-300 transform hover:scale-125 hover:rotate-12"
          >
            <FiTrash2 className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Question Text */}
        <div className="space-y-4">
          <label className=" text-lg font-bold text-slate-700 flex items-center gap-3">
            <FiFileText className="h-5 w-5 text-emerald-600" />
            Teks Pertanyaan
          </label>
          <textarea
            {...register(`questions.${index}.questionText`)}
            rows={4}
            className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 resize-none font-medium text-lg"
            placeholder="Tulis pertanyaan yang jelas dan mudah dipahami..."
          />
          {errors.questions?.[index]?.questionText && (
            <p className="text-red-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              {errors.questions[index].questionText.message}
            </p>
          )}
        </div>

        {/* Question Type */}
        <div className="space-y-4">
          <label className=" text-lg font-bold text-slate-700 flex items-center gap-3">
            <FiList className="h-5 w-5 text-teal-600" />
            Tipe Pertanyaan
          </label>
          <select
            {...register(`questions.${index}.questionType`)}
            className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 backdrop-blur-sm text-slate-800 transition-all duration-300 font-medium text-lg"
          >
            <option value="multiple_choice">Pilihan Ganda</option>
            <option value="essay">Esai</option>
          </select>
        </div>

        {/* Multiple Choice Options */}
        {questionType === "multiple_choice" && (
          <div className="space-y-6 p-8 bg-gradient-to-r from-white/60 to-emerald-50/60 rounded-3xl border border-white/40 backdrop-blur-sm">
            <h4 className="font-bold text-slate-800 flex items-center gap-3 text-xl">
              <FiTarget className="h-6 w-6 text-emerald-600" />
              Pilihan Jawaban
            </h4>

            <Controller
              control={control}
              name={`questions.${index}.correctAnswer`}
              render={({ field }) => (
                <div className="space-y-4">
                  {choiceFields.map((choice, choiceIndex) => (
                    <div key={choice.id} className="group relative">
                      <div className="flex items-center gap-6 p-6 bg-white/80 hover:bg-white/90 border-2 border-white/50 hover:border-emerald-200/60 rounded-2xl transition-all duration-300 backdrop-blur-sm">
                        <div className="flex items-center gap-4 flex-1">
                          <input
                            type="radio"
                            {...field}
                            value={choiceIndex.toString()}
                            id={`choice-${index}-${choiceIndex}`}
                            className="w-6 h-6 text-emerald-600 focus:ring-emerald-500 border-2 border-gray-300"
                          />
                          <label
                            htmlFor={`choice-${index}-${choiceIndex}`}
                            className="text-lg font-bold text-emerald-700 min-w-0 flex-shrink-0 w-8"
                          >
                            {String.fromCharCode(65 + choiceIndex)}.
                          </label>
                          <input
                            {...register(
                              `questions.${index}.choices.${choiceIndex}.text`
                            )}
                            className="flex-1 px-4 py-4 bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400 font-medium text-lg"
                            placeholder={`Pilihan ${String.fromCharCode(
                              65 + choiceIndex
                            )}`}
                          />
                        </div>

                        {choiceFields.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeChoice(choiceIndex)}
                            className="p-3 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50/70 transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-90 hover:scale-110"
                          >
                            <FiX className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            />

            {/* Error Messages for Multiple Choice */}
            <div className="space-y-2">
              {errors.questions?.[index]?.choices && (
                <p className="text-red-500 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Setiap pilihan harus diisi.
                </p>
              )}
              {errors.questions?.[index]?.correctAnswer && (
                <p className="text-red-500 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {errors.questions[index].correctAnswer.message}
                </p>
              )}
            </div>

            {/* Add Choice Button */}
            <button
              type="button"
              onClick={() => appendChoice({ text: "" })}
              className="flex items-center gap-3 px-6 py-4 font-bold text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/70 rounded-2xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-emerald-200/50 text-lg"
            >
              <FiPlus className="h-5 w-5" />
              <span>Tambah Pilihan</span>
            </button>
          </div>
        )}

        {/* Essay Answer Section */}
        {questionType === "essay" && (
          <div className="space-y-6 p-8 bg-gradient-to-r from-white/60 to-purple-50/60 rounded-3xl border border-white/40 backdrop-blur-sm">
            <h4 className="font-bold text-slate-800 flex items-center gap-3 text-xl">
              <FiEdit3 className="h-6 w-6 text-purple-600" />
              Pengaturan Esai
            </h4>

            {/* Sample Answer / Key Points */}
            <div className="space-y-4">
              <label className=" text-lg font-bold text-slate-700 flex items-center gap-3">
                <FiFileText className="h-5 w-5 text-purple-600" />
                Jawaban Kunci / Poin Penting{" "}
                <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                {...register(`questions.${index}.sampleAnswer`)}
                rows={6}
                className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 resize-none font-medium"
                placeholder="Tulis jawaban kunci atau poin-poin penting yang harus ada dalam jawaban siswa. Ini akan membantu dalam penilaian manual."
              />
              <p className="text-sm text-slate-500 bg-purple-50/50 p-4 rounded-xl">
                💡 <strong>Tips:</strong> Jawaban kunci ini akan digunakan
                sebagai pedoman untuk menilai jawaban esai siswa secara manual.
              </p>
            </div>

            {/* Scoring Criteria */}
            <div className="space-y-4">
              <label className=" text-lg font-bold text-slate-700 flex items-center gap-3">
                <FiTarget className="h-5 w-5 text-purple-600" />
                Kriteria Penilaian{" "}
                <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">
                    Skor Maksimal
                  </label>
                  <input
                    type="number"
                    {...register(`questions.${index}.maxScore`, {
                      valueAsNumber: true,
                    })}
                    min="1"
                    max="100"
                    defaultValue="10"
                    className="w-full px-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm text-slate-800 font-medium"
                    placeholder="10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600">
                    Bobot Soal (%)
                  </label>
                  <input
                    type="number"
                    {...register(`questions.${index}.weight`, {
                      valueAsNumber: true,
                    })}
                    min="1"
                    max="100"
                    defaultValue="20"
                    className="w-full px-4 py-3 bg-white/70 border-2 border-white/40 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm text-slate-800 font-medium"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            {/* Rubric/Guidelines */}
            <div className="space-y-4">
              <label className=" text-lg font-bold text-slate-700 flex items-center gap-3">
                <FiList className="h-5 w-5 text-purple-600" />
                Rubrik Penilaian{" "}
                <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <textarea
                {...register(`questions.${index}.rubric`)}
                rows={4}
                className="w-full px-6 py-4 bg-white/70 border-2 border-white/40 rounded-2xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm text-slate-800 placeholder-slate-400 transition-all duration-300 resize-none font-medium"
                placeholder="Contoh:
- Jawaban lengkap dan benar (8-10 poin)
- Jawaban cukup benar tapi kurang lengkap (5-7 poin)  
- Jawaban kurang tepat (1-4 poin)
- Tidak menjawab atau salah total (0 poin)"
              />
            </div>

            {/* Preview Box */}
            <div className="p-6 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-2xl border-2 border-purple-200/50">
              <h5 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                <FiEye className="h-5 w-5" />
                Preview untuk Siswa
              </h5>
              <div className="p-4 bg-white/80 rounded-xl border border-purple-200/30">
                <p className="text-slate-600 text-sm mb-2">
                  Siswa akan melihat:
                </p>
                <div className="space-y-3">
                  <div className="p-4 border-2 border-slate-200 rounded-xl bg-slate-50">
                    <p className="text-slate-500 text-sm">
                      Area jawaban esai (textarea besar untuk mengetik)
                    </p>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>
                      Skor: ___ / {watch(`questions.${index}.maxScore`) || 10}
                    </span>
                    <span>
                      Bobot: {watch(`questions.${index}.weight`) || 20}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
