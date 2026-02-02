import { notFound } from "next/navigation";
import CurriculumAccordion from "../../components/ui/CurriculumAccordion";
import { CourseDetails, Lesson } from "../../types/dashboard";
import { getAllCourses, getCourse } from "../../../app/api/modules/store";


async function getCourseData(slug: string): Promise<CourseDetails | null> {
  try {
    const course = getCourse(slug);
    return course || null;
  } catch (error) {
    console.error("Failed to fetch course data:", error);
    return null;
  }
}


export async function generateStaticParams() {
  const courses = getAllCourses();
  const slugs = Object.keys(courses);
  return slugs.map((slug) => ({
    slug,
  }));
}


interface PageProps {
  params: Promise<{ slug: string }>;
}


export default async function DetailMataPelajaranPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseData(slug);


  if (!course) {
    notFound();
  }


  const allLessons = course.modules.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(
    (lesson) => lesson.isCompleted
  ).length;


  const progress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;


  const curriculum = {
    pendahuluan: course.modules[0]?.lessons || [],
    penguasaan: course.modules[1]?.lessons || [],
  };


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


      <div className="relative z-10 max-w-6xl mx-auto px-6 py-6">
        <nav className="mb-8">
          <div className="flex items-center gap-3 text-blue-200/80">
            <a
              href="/matapelajaran"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 group"
            >
              <svg
                className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Mata Pelajaran
            </a>
            <svg
              className="w-4 h-4 text-blue-300/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="font-semibold bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
              {course.title}
            </span>
          </div>
        </nav>


        <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-2xl shadow-blue-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 rounded-3xl"></div>


          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-300 mb-4 leading-tight">
                  {course.title}
                </h1>
                <p className="text-blue-100/90 text-base mb-6 leading-relaxed max-w-2xl">
                  {course.description}
                </p>
              </div>


              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full border border-yellow-400/30">
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-yellow-300 font-semibold">4.8</span>
              </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 text-center border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 h-full flex flex-col justify-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  12 Jam
                </div>
                <div className="text-blue-200/80 text-sm font-medium">
                  Durasi
                </div>
              </div>


              <div className="group bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 text-center border border-indigo-400/30 hover:border-indigo-400/50 transition-all duration-300 hover:scale-105 h-full flex flex-col justify-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  234
                </div>
                <div className="text-blue-200/80 text-sm font-medium">
                  Siswa Aktif
                </div>
              </div>


              <div className="group bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 text-center border border-emerald-400/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 h-full flex flex-col justify-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.round(progress)}%
                </div>
                <div className="text-blue-200/80 text-sm font-medium">
                  Progress
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* ✅ Progress Card - Full Width */}
        <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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
              <span className="text-white font-semibold text-xl">
                Progress Pembelajaran
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {completedLessons}/{totalLessons}
              </div>
              <div className="text-blue-200/70 text-sm">Pelajaran</div>
            </div>
          </div>


          <div className="relative">
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-blue-200/70 text-sm font-medium">
                Mulai belajar
              </span>
              <span className="text-white font-bold text-sm">
                {Math.round(progress)}% Selesai
              </span>
            </div>
          </div>
        </div>


        {/* ✅ Curriculum Section - Full Width */}
        <CurriculumAccordion curriculum={curriculum} />
      </div>
    </div>
  );
}
