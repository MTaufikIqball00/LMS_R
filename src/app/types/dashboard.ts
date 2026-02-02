
// General course information for listings
export interface Course {
  id: number;
  title: string;
  description: string;
  slug: string; // Important for routing
  image: string;
  level?: string;
  duration?: string;
  students?: number;
  rating?: number;
}

// Detailed course information including modules and lessons
export interface CourseDetails {
  title: string;
  description: string;
  teacher: string;
  modules: Module[];
}

export interface Module {
  title: string;
  isLocked: boolean;
  lessons: Lesson[];
}

export interface Lesson {
  id?: number; // Optional because it comes from the old type
  title: string;
  status?: "completed" | "locked" | "in-progess"; // Optional
  time?: string; // Optional, renamed from duration
  duration?: string; // from store.ts
  isUnlocked?: boolean; // Optional
  isCompleted?: boolean; // from store.ts
  type: "video" | "pdf" | "text" | "quiz" | "assignment";
}

export interface ScheduleItem {
  day: string;
  time: string;
  subjects?: string[];
}
