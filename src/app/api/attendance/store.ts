import type { AttendanceRecord } from "../../../app/types/attendance";

// In-memory store for all attendance records
export const attendanceRecords = new Map<string, AttendanceRecord>();

// --- Seed with some initial data for development ---

// An unverified attendance record for the teacher to see
const unverifiedRecordId1 = "att-rec-01";
attendanceRecords.set(unverifiedRecordId1, {
  id: unverifiedRecordId1,
  userId: "1", // student
  userName: "Siswa Rajin",
  studentId: "student-001",
  studentName: "Siswa Rajin",
  data: "att-data-01",
  studentClass: "12A",
  studentNumber: "15",
  subject: "Biologi",
  subjectCode: "BIO-12",
  teacher: "Guru Hebat",
  teacherId: "2", // teacher
  date: new Date().toISOString(),
  checkInTime: new Date().toISOString(),
  status: "present",
  location: { latitude: -6.2, longitude: 106.8 },
  semester: "Ganjil",
  academicYear: "2025/2026",
  period: 1,
  isActive: true,
  method: "qr_code",
  validatedBy: undefined, // NOT VERIFIED
  validatedAt: undefined, // NOT VERIFIED
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// A second unverified record for the same teacher
const unverifiedRecordId2 = "att-rec-02";
attendanceRecords.set(unverifiedRecordId2, {
  id: unverifiedRecordId2,
  userId: "3", // another student
  userName: "Siswa Lain",
  studentId: "student-003",
  studentName: "Siswa Lain",
  data: "att-data-02",
  studentClass: "12A",
  studentNumber: "20",
  subject: "Biologi",
  subjectCode: "BIO-12",
  teacher: "Guru Hebat",
  teacherId: "2", // teacher
  date: new Date().toISOString(),
  checkInTime: new Date().toISOString(),
  status: "present",
  location: { latitude: -6.21, longitude: 106.81 },
  semester: "Ganjil",
  academicYear: "2025/2026",
  period: 1,
  isActive: true,
  method: "qr_code",
  validatedBy: undefined, // NOT VERIFIED
  validatedAt: undefined, // NOT VERIFIED
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// A record that has already been verified
const verifiedRecordId1 = "att-rec-03";
attendanceRecords.set(verifiedRecordId1, {
  id: verifiedRecordId1,
  userId: "4",
  userName: "Siswa Teladan",
  studentId: "student-004",
  studentName: "Siswa Teladan",
  data: "att-data-03",
  studentClass: "12A",
  studentNumber: "22",
  subject: "Biologi",
  subjectCode: "BIO-12",
  teacher: "Guru Hebat",
  teacherId: "2", // teacher
  date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
  checkInTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  status: "present",
  location: { latitude: -6.2, longitude: 106.8 },
  semester: "Ganjil",
  academicYear: "2025/2026",
  period: 1,
  isActive: true,
  method: "qr_code",
  validatedBy: "2", // VERIFIED by the teacher
  validatedAt: new Date().toISOString(),
  createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
});
