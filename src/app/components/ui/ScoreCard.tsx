// components/ui/ScoreCard.tsx
import { Score } from "../../types/score";

const getGradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "from-emerald-400 to-emerald-600";
  if (grade.startsWith("B")) return "from-blue-400 to-blue-600";
  if (grade.startsWith("C")) return "from-amber-400 to-amber-600";
  return "from-rose-400 to-rose-600";
};

const getGradeAccent = (grade: string) => {
  if (grade.startsWith("A"))
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
  if (grade.startsWith("B"))
    return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
  if (grade.startsWith("C"))
    return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
  return "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300";
};

export default function ScoreCard(score: Score) {
  return (
    <div className="group relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {score.subject}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {score.teacher}
            </p>
          </div>

          {/* Final Grade Badge */}
          <div
            className={`px-4 py-2 rounded-xl font-bold text-lg ${getGradeAccent(
              score.finalGrade
            )}`}
          >
            {score.finalGrade}
          </div>
        </div>

        {/* Breakdown Scores */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Tugas */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {score.assignments.score}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Tugas
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${getGradeAccent(
                score.assignments.grade
              )}`}
            >
              {score.assignments.grade}
            </div>
          </div>

          {/* Quiz */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {score.quizzes.score}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Quiz
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${getGradeAccent(
                score.quizzes.grade
              )}`}
            >
              {score.quizzes.grade}
            </div>
          </div>

          {/* Latihan */}
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {score.exercises.score}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Latihan
            </div>
            <div
              className={`text-xs px-2 py-1 rounded-full ${getGradeAccent(
                score.exercises.grade
              )}`}
            >
              {score.exercises.grade}
            </div>
          </div>
        </div>
      </div>

      {/* Footer with Final Score */}
      <div
        className={`p-4 bg-gradient-to-r ${getGradeColor(score.finalGrade)}`}
      >
        <div className="flex items-center justify-between text-white">
          <div>
            <div className="text-sm opacity-90">Nilai Akhir</div>
            <div className="text-2xl font-bold">{score.finalScore}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Semester</div>
            <div className="font-semibold">{score.semester}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
