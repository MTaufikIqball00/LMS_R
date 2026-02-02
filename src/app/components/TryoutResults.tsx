"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { TryoutQuestion } from "../constants/tryoutdata";

interface TryoutResultsProps {
  questions: TryoutQuestion[];
  answers: { [key: string]: string | undefined };
  onRestart: () => void;
  title: string;
}

const TryoutResults: React.FC<TryoutResultsProps> = ({
  questions,
  answers,
  onRestart,
  title,
}) => {
  const router = useRouter();

  const { correctAnswers, totalPoints, earnedPoints } = useMemo(() => {
    let correct = 0;
    let total = 0;
    let earned = 0;

    questions.forEach((q) => {
      total += q.points;
      if (answers[q.id] === q.correctAnswer) {
        correct++;
        earned += q.points;
      }
    });

    return {
      correctAnswers: correct,
      totalPoints: total,
      earnedPoints: earned,
    };
  }, [questions, answers]);

  const score = (correctAnswers / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 text-center">
          <h1
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            role="heading"
            aria-level={1}
          >
            Hasil Tryout: {title}
          </h1>
          <p className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8 text-cyan-300">
            Skor Anda: {score.toFixed(2)}% ({earnedPoints}/{totalPoints} poin)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div
              className="bg-blue-900/20 rounded-xl p-4"
              role="region"
              aria-label="Total Soal"
            >
              <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                {questions.length}
              </div>
              <div className="text-blue-400 text-sm">Total Soal</div>
            </div>
            <div
              className="bg-green-900/20 rounded-xl p-4"
              role="region"
              aria-label="Jawaban Benar"
            >
              <div className="text-2xl sm:text-3xl font-bold text-green-400">
                {correctAnswers}
              </div>
              <div className="text-green-400 text-sm">Jawaban Benar</div>
            </div>
            <div
              className="bg-red-900/20 rounded-xl p-4"
              role="region"
              aria-label="Jawaban Salah"
            >
              <div className="text-2xl sm:text-3xl font-bold text-red-400">
                {questions.length - correctAnswers}
              </div>
              <div className="text-red-400 text-sm">Jawaban Salah</div>
            </div>
          </div>

          <div className="text-left my-6 sm:my-8">
            <h2
              className="text-xl sm:text-2xl font-bold text-white mb-4"
              role="heading"
              aria-level={2}
            >
              Review Jawaban
            </h2>
            {questions.map((q, index) => (
              <div
                key={q.id}
                className={`p-4 rounded-lg mb-4 border-l-4 ${
                  answers[q.id] === q.correctAnswer
                    ? "bg-green-900/20 border-green-500"
                    : "bg-red-900/20 border-red-500"
                }`}
                role="region"
                aria-label={`Soal ${index + 1}`}
              >
                <p className="font-bold text-white">
                  Soal {index + 1}: {q.question}
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  Jawaban Anda:{" "}
                  <span
                    className={
                      answers[q.id] === q.correctAnswer
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {answers[q.id] || "Tidak dijawab"}
                  </span>
                </p>
                {answers[q.id] !== q.correctAnswer && (
                  <p className="text-sm text-gray-300">
                    Jawaban Benar:{" "}
                    <span className="text-green-400">{q.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              aria-label="Ulangi Tryout"
            >
              Ulangi Tryout
            </button>
            <button
              onClick={() => router.push("/tryout")}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 font-medium transition-all duration-200 hover:scale-105"
              aria-label="Kembali ke Tryout Center"
            >
              Kembali ke Tryout Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryoutResults;
