"use client";
import { useState, useEffect } from "react";
import CourseCard from "../components/ui/CourseCard";
import { COURSES } from "../constants/dashboard";
import type { Course } from "../types/dashboard";

export default function MataPelajaranPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(COURSES);

  useEffect(() => {
    const filtered = COURSES.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-black text-3xl lg:text-4xl mb-4">
            Mata Pelajaran
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 text-lg mb-2">
              Jelajahi berbagai mata pelajaran dengan pendekatan pembelajaran
            </p>
            <p className="text-gray-600 text-lg">yang modern dan interaktif</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto mb-8">
          <div className="relative">
            {/* Search Icon */}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Cari mata pelajaran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Course Grid */}
        <section className="mb-12">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white shadow-md rounded-lg p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6 opacity-50">🔍</div>
                <h3 className="text-gray-800 text-2xl font-bold mb-4">
                  Tidak Ditemukan
                </h3>
                <p className="text-gray-600 text-lg mb-2">
                  Tidak ada mata pelajaran yang cocok
                </p>
                <p className="text-gray-500">
                  Coba gunakan kata kunci yang berbeda
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Results Counter */}
              <div className="text-center mb-6">
                <p className="text-gray-600 text-lg">
                  Menampilkan{" "}
                  <span className="text-gray-800 font-semibold">
                    {filteredCourses.length}
                  </span>{" "}
                  mata pelajaran
                  {searchTerm && (
                    <>
                      {" "}
                      untuk "
                      <span className="text-blue-600 font-semibold">
                        {searchTerm}
                      </span>
                      "
                    </>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCourses.map(
                  (course, index) =>
                    course &&
                    course.slug && (
                      <div
                        key={course.id}
                        className={`w-full h-80 transform transition-all duration-200 hover:scale-105 ${
                          course.title === "Pancawaluya"
                            ? "lg:col-span-2"
                            : ""
                        }`}
                      >
                        <div className="h-full flex flex-col">
                          <CourseCard course={course} priority={index < 4} />
                        </div>
                      </div>
                    )
                )}
              </div>
            </>
          )}
        </section>

        {/* Stats Section */}
        {filteredCourses.length > 0 && (
          <section className="mt-12">
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center hover:bg-white/15 transition-all duration-200">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-300 mb-2">
                  {COURSES.length}+
                </div>
                <div className="text-blue-200/80 text-lg font-medium">
                  Mata Pelajaran
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center hover:bg-white/15 transition-all duration-200">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-blue-300 mb-2">
                  5000+
                </div>
                <div className="text-blue-200/80 text-lg font-medium">
                  Siswa Aktif
                </div>
              </div>

              {/* <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center hover:bg-white/15 transition-all duration-200">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-300 mb-2">
                  4.8★
                </div>
                <div className="text-blue-200/80 text-lg font-medium">
                  Rating Rata-rata
                </div>
              </div> */}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
