import ScoresList from "../components/ui/ScoresList";

export default function ScoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950">
      {/* Hero section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium mb-4">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Performa Akademik
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Nilai Akademik
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Anda
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Lacak kemajuan Anda, rayakan pencapaian, dan identifikasi area yang
            perlu ditingkatkan di semua mata pelajaran Anda.
          </p>
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group relative overflow-hidden bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  85%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pass Rate
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  8
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Subjects
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  A-
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Top Grade
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  +12%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Improvement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main scores section */}
        <div className="relative">
          <ScoresList />
        </div>

        {/* Action buttons */}
        <div className="mt-12 flex justify-center space-x-4">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Export Report</span>
          </button>

          <button className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 via-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div
          className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-3/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.15)_1px,_transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.05)_1px,_transparent_0)] [background-size:20px_20px] pointer-events-none opacity-40"></div>
    </div>
  );
}
