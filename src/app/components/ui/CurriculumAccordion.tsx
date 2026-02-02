"use client";

import { useState } from "react";
import type { Lesson } from "../../types/dashboard";

// Helper Icons
const VideoIcon = () => (
  <svg
    className="w-5 h-5 text-blue-400 group-hover:text-cyan-300 transition-colors duration-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.55a1 1 0 011.45.89v2.22a1 1 0 01-1.45.89L15 12.5M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const PdfIcon = () => (
  <svg
    className="w-5 h-5 text-indigo-400 group-hover:text-purple-300 transition-colors duration-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const TextIcon = () => (
  <svg
    className="w-5 h-5 text-emerald-400 group-hover:text-teal-300 transition-colors duration-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-5 h-5 text-gray-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    className="w-6 h-6 transition-transform duration-300"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const LessonItem = ({ lesson }: { lesson: Lesson }) => {
  const getIconForType = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return <VideoIcon />;
      case "pdf":
        return <PdfIcon />;
      case "text":
      default:
        return <TextIcon />;
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 h-16 flex-shrink-0 ${
        lesson.isUnlocked
          ? "bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20"
          : "bg-gray-500/5 cursor-not-allowed opacity-60"
      }`}
    >
      <div className="flex items-center gap-4">
        {getIconForType(lesson.type)}
        <span
          className={`text-lg font-medium line-clamp-1 ${
            lesson.isUnlocked ? "text-white" : "text-gray-400"
          }`}
        >
          {lesson.title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {lesson.time && (
          <span className="text-cyan-300 font-medium px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full text-sm border border-cyan-400/30 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all duration-300">
            {lesson.time}
          </span>
        )}
        {!lesson.isUnlocked && <LockIcon />}
      </div>
    </div>
  );
};

interface CurriculumAccordionProps {
  curriculum: {
    pendahuluan: Lesson[];
    penguasaan: Lesson[];
  };
}

export default function CurriculumAccordion({
  curriculum,
}: CurriculumAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSection((prev) => (prev === title ? null : title));
  };

  const sections = [
    {
      id: "pendahuluan",
      title: "Pendahuluan",
      lessons: curriculum.pendahuluan,
    },
    { id: "penguasaan", title: "Penguasaan", lessons: curriculum.penguasaan },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-300 mb-4">
          Kurikulum Pembelajaran
        </h2>
        <p className="text-blue-200/80 text-lg max-w-2xl mx-auto">
          Jelajahi materi pembelajaran yang terstruktur dan interaktif untuk
          menguasai konsep dengan baik
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {sections.map((section) => {
          const isOpen = openSection === section.title;

          return (
            <div
              key={section.id} // ✅ Menggunakan id unik untuk key
              className="group bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 flex flex-col shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02]"
            >
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex justify-between items-center text-left p-6 focus:outline-none hover:bg-white/10 rounded-xl transition-all duration-300 flex-shrink-0 group-hover:bg-white/5"
                aria-expanded={isOpen}
                aria-controls={`${section.id}-content`}
                id={`${section.id}-header`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      section.id === "pendahuluan"
                        ? "bg-gradient-to-br from-blue-400 to-cyan-400"
                        : "bg-gradient-to-br from-indigo-400 to-purple-400"
                    }`}
                  >
                    {section.id === "pendahuluan" ? (
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
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    ) : (
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
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      {section.title}
                    </h2>
                    <p className="text-blue-200/70 text-sm">
                      {section.lessons.length} materi pembelajaran
                    </p>
                  </div>
                </div>
                <div
                  className={`transition-all duration-300 ${
                    isOpen
                      ? "transform rotate-180 text-cyan-300"
                      : "text-blue-300"
                  }`}
                >
                  <ChevronDownIcon />
                </div>
              </button>

              <div
                className={`overflow-hidden mt-3 transition-all duration-500 ease-in-out ${
                  isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
                style={{
                  display: isOpen ? "block" : "none",
                }}
              >
                <div
                  id={`${section.id}-content`}
                  role="region"
                  aria-labelledby={`${section.id}-header`}
                  className="px-6 pb-6 space-y-3"
                >
                  {section.lessons.map((lesson, index) => (
                    <LessonItem
                      key={lesson.id || `${section.id}-lesson-${index}`} // ✅ Fallback key jika lesson.id tidak ada
                      lesson={lesson}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
