export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  avatar?: string;
  semester: number;
  grade: 10 | 11 | 12; // Tingkat kelas
  school: {
    name: string;
    province: string; // e.g., "Jawa Barat"
  };
  phone: string;
  class: string;
  major: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "suspended";
  gpa: number;

  // Academic Info
  totalCredits: number;
  completedCredits: number;

  // Contact Info
  address?: string;
  parentName?: string;
  parentPhone?: string;

  // Stats
  attendanceRate: number;
  assignmentCompletion: number;
  quizAverage: number;

  // Risk Analysis
  riskStatus?: "Aman" | "Berisiko Sedang" | "Berisiko Tinggi";
  riskScore?: number;

  createdAt: string;
  updatedAt: string;
}

export interface StudentGrade {
  id: string;
  studentId: string;
  subject: string;
  type: string;
  title: string;
  score: number;
  maxScore: number; // e.g., A, B, C, etc.
  percentage: number;
  grade: string;
  submittedAt: string; // Optional remarks or comments
  gradedAt: string;
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  subject: string;
  checkInTime: string; // e.g., "09:00 AM"
  location: string; // e.g., "Room 101"
  notes: string; // Optional remarks or comments
}

export interface StudentActivity {
  id: string;
  studentId: string;
  type:
    | "login"
    | "logout"
    | "quiz_complete"
    | "forum_post"
    | "video_join"
    | "assignment_submit";
  timestamp: string;
  title: string; // e.g., "Quiz 1 Completed"
  description: string; // e.g., "Logged in from IP
  metadata?: Record<string, any>; // Additional data related to the activity
}
