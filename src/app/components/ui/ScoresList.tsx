// components/ui/ScoresList.tsx
import { SCORES } from "../../constants/scores";
import ScoreCard from "./ScoreCard";

export default function ScoresList() {
  const totalSubjects = SCORES.length;
  const averageScore = Math.round(
    SCORES.reduce((acc, score) => acc + score.finalScore, 0) / SCORES.length
  );

  const averageAssignmentScore = Math.round(
    SCORES.reduce((acc, score) => acc + score.assignments.score, 0) /
      SCORES.length
  );

  const averageQuizScore = Math.round(
    SCORES.reduce((acc, score) => acc + score.quizzes.score, 0) / SCORES.length
  );

  const averageExerciseScore = Math.round(
    SCORES.reduce((acc, score) => acc + score.exercises.score, 0) /
      SCORES.length
  );

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Kinerja Anda Di Semua Mata Pelajaran
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalSubjects}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Subjects
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {averageScore}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Rata-rata Akhir
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {averageAssignmentScore}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Rata-rata Tugas
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {averageQuizScore}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Rata-rata Quiz
            </div>
          </div>
        </div>
      </div>

      {/* Scores Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SCORES.map((score) => (
          <ScoreCard key={score.id} {...score} />
        ))}
      </div>

      {/* Performance Analysis */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Analisis Kinerja
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {averageAssignmentScore}
            </div>
            <div className="text-emerald-700 dark:text-emerald-300 font-medium">
              Rata-rata Tugas
            </div>
          </div>

          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {averageQuizScore}
            </div>
            <div className="text-blue-700 dark:text-blue-300 font-medium">
              Rata-rata Quiz
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {averageExerciseScore}
            </div>
            <div className="text-purple-700 dark:text-purple-300 font-medium">
              Rata-rata Latihan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
