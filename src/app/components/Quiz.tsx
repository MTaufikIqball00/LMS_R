// components/Quiz.tsx
"use client";
import React, { useState, useEffect } from "react";
import { QuizProps, QuizResultss } from "../types/quizdata";
import QuizResults from "./QuizResults";

export default function Quiz({ questions, title, onComplete }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [questionTransition, setQuestionTransition] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleFinishQuiz();
    }
  }, [timeRemaining, showResults]);

  // Progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressWidth(getProgressPercentage());
    }, 100);
    return () => clearTimeout(timer);
  }, [answers]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (selectedOption: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedOption;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Trigger exit animation
      setQuestionTransition(false);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setQuestionTransition(true);
      }, 150);
    } else {
      handleFinishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Trigger exit animation
      setQuestionTransition(false);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setQuestionTransition(true);
      }, 150);
    }
  };

  const handleQuestionNavigation = (index: number) => {
    if (index !== currentQuestionIndex) {
      setQuestionTransition(false);
      setTimeout(() => {
        setCurrentQuestionIndex(index);
        setQuestionTransition(true);
      }, 150);
    }
  };

  const handleFinishQuiz = () => {
    const results = calculateResults();
    setShowResults(true);
    onComplete(results);
  };

  const calculateResults = (): QuizResultss => {
    let correctAnswers = 0;
    let totalScore = 0;
    let totalPoints = 0;

    questions.forEach((question, index) => {
      const points = question.points ?? 0;
      totalPoints += points;
      if (answers[index] === question.correctAnswer) {
        correctAnswers++;
        totalScore += points;
      }
    });

    return {
      score: totalScore,
      totalPoints,
      percentage: totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0,
      answers,
      correctAnswers,
      wrongAnswers: questions.length - correctAnswers,
    };
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    const answeredQuestions = answers.filter(
      (answer) => answer !== null
    ).length;
    return (answeredQuestions / questions.length) * 100;
  };

  if (showResults) {
    return (
      <QuizResults
        results={calculateResults()}
        onRestart={() => {
          setCurrentQuestionIndex(0);
          setAnswers(Array(questions.length).fill(null));
          setShowResults(false);
          setTimeRemaining(3600);
          setProgressWidth(0);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 mb-6 transform transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Waktu Tersisa
                </p>
                <p
                  className={`text-lg font-bold transition-colors duration-300 ${
                    timeRemaining < 300
                      ? "text-red-600 dark:text-red-400 animate-pulse"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>
                Soal {currentQuestionIndex + 1} dari {questions.length}
              </span>
              <span>{answers.filter((a) => a !== null).length} dijawab</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-8 transform transition-all duration-300 hover:shadow-xl">
          <div
            className={`transform transition-all duration-300 ${
              questionTransition
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          >
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {(currentQuestion as any).question ??
                  (currentQuestion as any).text ??
                  (currentQuestion as any).prompt ??
                  (currentQuestion as any).title ??
                  "No question"}
              </h2>

              {/* Question with image placeholder if needed */}
              {currentQuestion.id === "5" && (
                <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg transform transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Image placeholder
                  </p>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3 mb-8">
              {(currentQuestion?.options ?? []).map((option, index) => (
                <button
                  key={`${currentQuestionIndex}-${index}`}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                    answers[currentQuestionIndex] === option
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:shadow-sm"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 mr-3 transition-all duration-200 ${
                        answers[currentQuestionIndex] === option
                          ? "border-blue-500 bg-blue-500 scale-110"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {answers[currentQuestionIndex] === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50 transition-transform duration-200"></div>
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white transition-colors duration-200">
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              ← Sebelumnya
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Soal {currentQuestionIndex + 1} dari {questions.length}
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={answers[currentQuestionIndex] === null}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium transform hover:scale-105 disabled:hover:scale-100 hover:shadow-lg"
            >
              {currentQuestionIndex === questions.length - 1
                ? "Selesai →"
                : "Selanjutnya →"}
            </button>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="mt-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 p-6 transform transition-all duration-300 hover:shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Navigasi Soal
          </h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionNavigation(index)}
                className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all duration-200 transform hover:scale-110 ${
                  index === currentQuestionIndex
                    ? "border-blue-500 bg-blue-500 text-white shadow-md scale-105"
                    : answers[index] !== null
                    ? "border-green-500 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:shadow-sm"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:shadow-sm"
                }`}
                style={{
                  animationDelay: `${index * 20}ms`,
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center transition-all duration-200 hover:scale-105">
              <div className="w-4 h-4 rounded bg-blue-500 mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Soal Aktif
              </span>
            </div>
            <div className="flex items-center transition-all duration-200 hover:scale-105">
              <div className="w-4 h-4 rounded bg-green-500 mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Sudah Dijawab
              </span>
            </div>
            <div className="flex items-center transition-all duration-200 hover:scale-105">
              <div className="w-4 h-4 rounded border-2 border-gray-300 mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Belum Dijawab
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for enhanced animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-20px);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
