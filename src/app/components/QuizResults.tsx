// components/QuizResults.tsx
import { useEffect, useState } from "react";

interface QuizResultsProps {
  results: {
    score: number;
    totalPoints: number;
    percentage: number;
    correctAnswers: number;
    wrongAnswers: number;
  };
  onRestart: () => void;
}

export default function QuizResults({ results, onRestart }: QuizResultsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    // Trigger main component animation
    const timer1 = setTimeout(() => setIsVisible(true), 100);

    // Trigger icon animation
    const timer2 = setTimeout(() => setShowIcon(true), 300);

    // Trigger progress bar animation
    const timer3 = setTimeout(() => setAnimateProgress(true), 800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 dark:text-green-400";
    if (percentage >= 75) return "text-blue-600 dark:text-blue-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getGradeText = (percentage: number) => {
    if (percentage >= 90) return "Excellent!";
    if (percentage >= 75) return "Good Job!";
    if (percentage >= 60) return "Not Bad!";
    return "Need Improvement";
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950 p-6">
      <div className="max-w-2xl mx-auto">
        <div
          className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-8 text-center transform transition-all duration-500 ${
            isVisible
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 translate-y-4"
          }`}
        >
          {/* Success Icon */}
          <div className="mb-6">
            <div
              className={`w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-all duration-500 ${
                showIcon ? "scale-100 rotate-0" : "scale-0 rotate-45"
              }`}
              style={{
                transitionDelay: showIcon ? "0ms" : "200ms",
                animation: showIcon ? "bounce 0.6s ease-in-out 0.2s" : "none",
              }}
            >
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h1
            className={`text-3xl font-bold text-gray-900 dark:text-white mb-2 transform transition-all duration-500 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Quiz Selesai!
          </h1>

          <p
            className={`text-xl font-semibold mb-8 transform transition-all duration-500 delay-150 ${getGradeColor(
              results.percentage
            )} ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {getGradeText(results.percentage)}
          </p>

          {/* Score Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                value: results.score,
                label: `dari ${results.totalPoints} poin`,
                bgColor: "bg-blue-50 dark:bg-blue-900/20",
                textColor: "text-blue-600 dark:text-blue-400",
                delay: "delay-200",
              },
              {
                value: results.correctAnswers,
                label: "jawaban benar",
                bgColor: "bg-green-50 dark:bg-green-900/20",
                textColor: "text-green-600 dark:text-green-400",
                delay: "delay-250",
              },
              {
                value: results.wrongAnswers,
                label: "jawaban salah",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                textColor: "text-red-600 dark:text-red-400",
                delay: "delay-300",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${
                  item.bgColor
                } rounded-xl p-4 transform transition-all duration-500 ${
                  item.delay
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95"
                }`}
              >
                <div
                  className={`text-3xl font-bold ${item.textColor} transition-all duration-300`}
                >
                  <CountUpNumber
                    target={item.value}
                    duration={1000}
                    delay={500}
                  />
                </div>
                <div className={`${item.textColor} text-sm`}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Percentage Score */}
          <div
            className={`mb-8 transform transition-all duration-500 delay-350 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
              <CountUpNumber
                target={results.percentage}
                duration={1500}
                delay={600}
                decimal={1}
              />
              %
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressBarColor(
                  results.percentage
                )}`}
                style={{
                  width: animateProgress ? `${results.percentage}%` : "0%",
                  transitionDelay: "0.5s",
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-500 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={onRestart}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg transform"
            >
              Coba Lagi
            </button>

            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-all duration-200 hover:scale-105"
            >
              Kembali ke Tugas
            </button>
          </div>
        </div>
      </div>

      {/* CSS Keyframes */}
      <style jsx>{`
        @keyframes bounce {
          0%,
          20%,
          53%,
          80%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          40%,
          43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -1px, 0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}

// Component untuk animasi count up numbers
function CountUpNumber({
  target,
  duration = 1000,
  delay = 0,
  decimal = 0,
}: {
  target: number;
  duration?: number;
  delay?: number;
  decimal?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = target / (duration / 16); // 60fps

      const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(counter);
        } else {
          setCount(start);
        }
      }, 16);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [target, duration, delay]);

  return (
    <span>{decimal > 0 ? count.toFixed(decimal) : Math.floor(count)}</span>
  );
}
