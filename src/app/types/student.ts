// src/data/students.ts
import {
  Student,
  StudentGrade,
  StudentAttendance,
  StudentActivity,
} from "../../lib/types/student";

// Sample students data
export const students = new Map<string, Student>();
export const studentGrades = new Map<string, StudentGrade[]>();
export const studentAttendance = new Map<string, StudentAttendance[]>();
export const studentActivities = new Map<string, StudentActivity[]>();

// Seed data
const sampleStudents: Student[] = [
  {
    id: "std-001",
    studentId: "2024001",
    name: "Ahmad Ridwan",
    email: "ahmad.ridwan@student.ac.id",
    phone: "081234567890",
    avatar: "/avatars/student1.jpg",
    enrollmentDate: "2024-08-15",
    class: "TI-2024-A",
    semester: 3,
    major: "Teknik Informatika",
    status: "active",
    grade: 11, // Added
    school: { name: "SMA Negeri 1 Jakarta", province: "DKI Jakarta" }, // Added
    gpa: 3.75,
    totalCredits: 144,
    completedCredits: 72,
    address: "Jl. Sudirman No. 123, Jakarta",
    parentName: "Budi Santoso",
    parentPhone: "081987654321",
    attendanceRate: 92.5,
    assignmentCompletion: 88.0,
    quizAverage: 85.5,
    createdAt: "2024-08-15T00:00:00.000Z",
    updatedAt: "2025-09-26T00:00:00.000Z",
  },
  {
    id: "std-002",
    studentId: "2024002",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@student.ac.id",
    avatar: "/avatars/student2.jpg",
    phone: "081234567891",
    class: "TI-2024-A",
    semester: 3,
    major: "Teknik Informatika",
    enrollmentDate: "2024-08-15",
    status: "active",
    grade: 11, // Added
    school: { name: "SMA Negeri 1 Jakarta", province: "DKI Jakarta" }, // Added
    gpa: 3.92,
    totalCredits: 144,
    completedCredits: 75,
    attendanceRate: 96.0,
    assignmentCompletion: 94.0,
    quizAverage: 91.2,
    createdAt: "2024-08-15T00:00:00.000Z",
    updatedAt: "2025-09-26T00:00:00.000Z",
  },
  {
    id: "std-003",
    studentId: "2024003",
    name: "Muhammad Fadil",
    email: "muhammad.fadil@student.ac.id",
    phone: "081234567892",
    avatar: "/avatars/student3.jpg",
    class: "TI-2024-B",
    semester: 3,
    major: "Teknik Informatika",
    enrollmentDate: "2024-08-15",
    status: "active",
    grade: 11, // Added
    school: { name: "SMA Negeri 1 Jakarta", province: "DKI Jakarta" }, // Added
    gpa: 3.45,
    totalCredits: 144,
    completedCredits: 68,
    attendanceRate: 78.5,
    assignmentCompletion: 72.0,
    quizAverage: 76.8,
    createdAt: "2024-08-15T00:00:00.000Z",
    updatedAt: "2025-09-26T00:00:00.000Z",
  },
];

// Initialize students
sampleStudents.forEach((student) => {
  students.set(student.id, student);
});

// Sample grades
const sampleGrades: { [key: string]: StudentGrade[] } = {
  "std-001": [
    {
      id: "gr-001",
      studentId: "std-001",
      subject: "Pemrograman Web",
      type: "quiz",
      title: "Quiz HTML & CSS",
      score: 85,
      maxScore: 100,
      percentage: 85,
      grade: "B",
      submittedAt: "2025-09-20T10:30:00.000Z",
      gradedAt: "2025-09-21T14:00:00.000Z",
    },
    {
      id: "gr-002",
      studentId: "std-001",
      subject: "Database",
      type: "assignment",
      title: "ER Diagram Design",
      score: 92,
      maxScore: 100,
      percentage: 92,
      grade: "A",
      submittedAt: "2025-09-18T23:59:00.000Z",
      gradedAt: "2025-09-19T16:30:00.000Z",
    },
  ],
};

// Initialize grades
Object.entries(sampleGrades).forEach(([studentId, grades]) => {
  studentGrades.set(studentId, grades);
});

// Sample attendance
const sampleAttendance: { [key: string]: StudentAttendance[] } = {
  "std-001": [
    {
      id: "att-001",
      studentId: "std-001",
      date: "2025-09-26",
      subject: "Pemrograman Web",
      status: "present",
      checkInTime: "08:15:00",
      location: "Lab Komputer 1",
      notes: "On time",
    },
    {
      id: "att-002",
      studentId: "std-001",
      date: "2025-09-25",
      subject: "Database",
      status: "late",
      checkInTime: "08:35:00",
      location: "Lab Komputer 2",
      notes: "Terlambat 5 menit",
    },
  ],
};

// Initialize attendance
Object.entries(sampleAttendance).forEach(([studentId, attendance]) => {
  studentAttendance.set(studentId, attendance);
});

// Sample activities
const sampleActivities: { [key: string]: StudentActivity[] } = {
  "std-001": [
    {
      id: "act-001",
      studentId: "std-001",
      type: "assignment_submit",
      title: "Tugas Database Submitted",
      description: "Submitted assignment: ER Diagram Design",
      timestamp: "2025-09-25T23:59:00.000Z",
      metadata: { assignmentId: "task-001", score: 92 },
    },
    {
      id: "act-002",
      studentId: "std-001",
      type: "quiz_complete",
      title: "Quiz Completed",
      description: "Completed quiz: HTML & CSS Basics",
      timestamp: "2025-09-24T10:30:00.000Z",
      metadata: { quizId: "quiz-001", score: 85 },
    },
  ],
};

// Initialize activities
Object.entries(sampleActivities).forEach(([studentId, activities]) => {
  studentActivities.set(studentId, activities);
});
