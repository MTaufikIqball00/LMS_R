// types/attendance.ts

// ============ ENUMS ============
export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "permission"
  | "sick"
  | "early_leave"
  | "excused";

export type NotificationType = "success" | "error" | "warning" | "info";

export type UserRole =
  | "student"
  | "teacher"
  | "admin"
  | "parent"
  | "admin_langganan"
  | "kepala_sekolah"
  | "admin_sekolah";

export type AttendanceMethod =
  | "qr_code"
  | "manual"
  | "GeolocationData"
  | "face_recognition"
  | "rfid";

export enum SemesterType {
  GANJIL = "ganjil",
  GENAP = "genap",
}

// ============ CORE INTERFACES ============
export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  studentId: string;
  studentName: string;
  data: string; // ID unik untuk data kehadiran
  studentClass: string;
  studentNumber: string;
  subject: string;
  subjectCode: string;
  teacher: string;
  teacherId: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  location: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
    buildingName?: string;
    roomNumber?: string;
  };
  checkOutLocation?: {
    // ✅ Tambahkan check-out location
    latitude: number;
    longitude: number;
    accuracy?: number;
    address?: string;
    buildingName?: string;
    roomNumber?: string;
  };
  sessionData?: {
    // ✅ Tambahkan sessionData
    sessionType?: "video_call" | "in_person" | "hybrid";
    callId?: string;
    duration?: number;
    userName?: string;
    participantId?: string;
    meetingRoom?: string;
    [key: string]: any; // Allow additional properties
  };
  qrCodeData?: string;
  notes?: string;
  semester: string;
  academicYear: string;
  period: number; // jam ke berapa
  duration?: number; // durasi dalam menit
  isActive: boolean; // apakah masih aktif di kelas
  method: AttendanceMethod;
  deviceInfo?: DeviceInfo;
  validatedBy?: string; // teacher/admin yang memvalidasi
  validatedAt?: string;
  parentNotified?: boolean;
  attachments?: AttendanceAttachment[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateCount: number;
  permissionCount: number;
  sickCount: number;
  earlyLeaveCount: number;
  attendanceRate: number;
  punctualityRate: number;
  currentStreak: number;
  longestStreak: number;
  weeklyData: WeeklyAttendanceData[];
  monthlyData: MonthlyAttendanceData[];
  subjectStats: SubjectAttendanceStats[];
  lastUpdated: string;
}

export interface WeeklyAttendanceData {
  day: string;
  week: String;
  present: number;
  absent: number;
  late: number;
  date: string;
  status: AttendanceStatus;
  subject?: string;
  period?: number;
}

export interface MonthlyAttendanceData {
  month: string;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateCount: number;
  attendanceRate: number;
}

export interface SubjectAttendanceStats {
  subject: string;
  subjectCode: string;
  teacher: string;
  totalSessions: number;
  attendedSessions: number;
  missedSessions: number;
  lateCount: number;
  attendanceRate: number;
}

// ============ GeolocationDataDataDataData & QR ============
export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
  address?: string;
}

export interface QRScanResult {
  data: string;
  timestamp: number;
  isValid: boolean;
  location?: GeolocationData;
  deviceInfo?: DeviceInfo;
  validationDetails?: {
    expectedData?: string;
    locationValid: boolean;
    timeValid: boolean;
    deviceValid: boolean;
  };
}

export interface QRCodeData {
  id: string;
  classId: string;
  subjectCode: string;
  date: string;
  period: number;
  validFrom: string;
  validUntil: string;
  location: GeolocationData;
  generatedBy: string;
  maxDistance: number; // meter
}

// ============ SCHEDULE & CLASS MANAGEMENT ============
export interface ClassSchedule {
  id: string;
  className: string;
  subject: string;
  subjectCode: string;
  teacher: string;
  teacherId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  period: number;
  room: string;
  building: string;
  semester: SemesterType;
  academicYear: string;
  isActive: boolean;
}

export interface AttendanceSession {
  id: string;
  classScheduleId: string;
  date: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  location: GeolocationData;
  qrCode?: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  attendanceRecords: AttendanceRecord[];
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ NOTIFICATIONS ============
export interface AttendanceNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  recipientId?: string; // ✅ Optional
  recipientRole?: UserRole; // ✅ Optional
  relatedRecordId?: string;
  actionRequired?: boolean;
  actionUrl?: string;
  isRead?: boolean; // ✅ Optional, default false
  timestamp: number;
  expiresAt?: number;
  metadata?: Record<string, any>;
}

// ============ PERMISSIONS & LEAVE ============
export interface AttendancePermission {
  id: string;
  studentId: string;
  studentName: string;
  type: "sick" | "permission" | "family_emergency" | "other";
  reason: string;
  startDate: string;
  endDate?: string;
  attachments?: AttendanceAttachment[];
  requestedBy: string; // parent/student
  requestedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  affectedSessions: string[]; // session IDs
  notes?: string;
}

export interface AttendanceAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

// ============ DEVICE & SECURITY ============
export interface DeviceInfo {
  deviceId: string;
  userAgent: string;
  platform: string;
  browser: string;
  ipAddress: string;
  screenResolution: string;
  timezone: string;
  language: string;
  isRegistered: boolean;
  isTrusted: boolean;
  lastUsed: string;
}

export interface SecurityLog {
  id: string;
  userId: string;
  userRole: UserRole;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  location?: GeolocationData;
  result: "success" | "failed" | "suspicious";
  details?: Record<string, any>;
  timestamp: string;
}

// ============ REPORTING & ANALYTICS ============
export interface AttendanceReport {
  id: string;
  title: string;
  type: "student" | "class" | "subject" | "teacher" | "comprehensive";
  dateRange: {
    start: string;
    end: string;
  };
  filters: AttendanceFilters;
  data: any;
  generatedBy: string;
  generatedAt: string;
  format: "json" | "csv" | "xlsx" | "pdf";
  fileUrl?: string;
  statistics: {
    totalRecords: number;
    totalStudents: number;
    avgAttendanceRate: number;
    trendData: TrendData[];
  };
}

export interface AttendanceFilters {
  dateRange?: { start: string; end: string };
  status?: AttendanceStatus[];
  studentIds?: string[];
  classNames?: string[];
  subjects?: string[];
  teachers?: string[];
  semester?: string;
  academicYear?: string;
  method?: AttendanceMethod[];
  minAttendanceRate?: number;
  maxAttendanceRate?: number;
}

export interface TrendData {
  period: string; // daily, weekly, monthly
  date: string;
  value: number;
  change?: number;
  changePercent?: number;
}

export interface AttendanceAnalytics {
  overview: {
    totalStudents: number;
    avgAttendanceRate: number;
    totalSessions: number;
    activeSessions: number;
  };
  trends: {
    attendanceRate: TrendData[];
    punctualityRate: TrendData[];
    absenteeism: TrendData[];
  };
  distributions: {
    byStatus: { status: AttendanceStatus; count: number; percentage: number }[];
    bySubject: SubjectAttendanceStats[];
    byClass: {
      className: string;
      attendanceRate: number;
      studentCount: number;
    }[];
    byTime: { hour: number; count: number }[];
  };
  insights: {
    topPerformers: {
      studentId: string;
      studentName: string;
      attendanceRate: number;
    }[];
    chronicAbsentees: {
      studentId: string;
      studentName: string;
      absentDays: number;
    }[];
    subjectsNeedingAttention: {
      subject: string;
      attendanceRate: number;
      trendDirection: "up" | "down" | "stable";
    }[];
  };
}

// ============ BULK OPERATIONS ============
export interface BulkAttendanceOperation {
  id: string;
  type: "check_in" | "check_out" | "mark_absent" | "update_status";
  sessionId: string;
  studentIds: string[];
  status?: AttendanceStatus;
  reason?: string;
  processedBy: string;
  processedAt: string;
  results: {
    success: string[];
    failed: { studentId: string; error: string }[];
  };
}

export interface BulkImportResult {
  id: string;
  filename: string;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: { row: number; studentId: string; error: string }[];
  processedAt: string;
  processedBy: string;
}

// ============ OFFLINE SUPPORT ============
export interface OfflineAttendanceRecord {
  id: string;
  tempId: string;
  data: Partial<AttendanceRecord>;
  action: "create" | "update" | "delete";
  timestamp: number;
  syncStatus: "pending" | "syncing" | "synced" | "failed";
  retryCount: number;
  lastError?: string;
}

export interface SyncResult {
  totalItems: number;
  syncedItems: number;
  failedItems: number;
  errors: { tempId: string; error: string }[];
  syncedAt: string;
}

// ============ DASHBOARD DATA ============
export interface DashboardData {
  summary: {
    todayAttendance: {
      present: number;
      absent: number;
      late: number;
      total: number;
      rate: number;
    };
    weeklyTrend: { day: string; rate: number }[];
    monthlyComparison: { current: number; previous: number; change: number };
  };
  recentActivities: {
    type: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }[];
  alerts: {
    type: "warning" | "error" | "info";
    message: string;
    count: number;
    actionRequired: boolean;
  }[];
  quickStats: {
    label: string;
    value: number | string;
    change?: number;
    trend?: "up" | "down" | "stable";
  }[];
}

// ============ PARENT INTEGRATION ============
export interface ParentNotification {
  id: string;
  parentId: string;
  studentId: string;
  type:
    | "attendance_alert"
    | "absence_report"
    | "permission_request"
    | "academic_update";
  title: string;
  message: string;
  data: any;
  channels: ("push" | "email" | "sms" | "whatsapp")[];
  sentAt?: string;
  readAt?: string;
  actionTaken?: string;
}

// ============ SYSTEM CONFIGURATION ============
export interface AttendanceSettings {
  school: {
    name: string;
    address: string;
    timezone: string;
    academicYear: string;
    currentSemester: SemesterType;
  };
  attendance: {
    lateThresholdMinutes: number;
    autoMarkAbsentAfterMinutes: number;
    allowEarlyCheckIn: boolean;
    allowLateCheckOut: boolean;
    requireLocation: boolean;
    maxLocationDistance: number;
    allowedMethods: AttendanceMethod[];
  };
  notifications: {
    parentNotificationEnabled: boolean;
    adminAlertThreshold: number;
    reminderBeforeClass: boolean;
    dailyReports: boolean;
  };
  security: {
    requireDeviceRegistration: boolean;
    maxDevicesPerUser: number;
    sessionTimeout: number;
    enableAuditLog: boolean;
  };
}

// ============ API RESPONSE TYPES ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  meta?: Record<string, any>;
}

// ============ FORM DATA TYPES ============
export interface CheckInFormData {
  studentId: string;
  location?: GeolocationData;
  qrCodeData?: string;
  method: AttendanceMethod;
  notes?: string;
}

export interface PermissionFormData {
  studentId: string;
  type: "sick" | "permission" | "family_emergency" | "other";
  reason: string;
  startDate: string;
  endDate?: string;
  attachments?: File[];
  parentContact: string;
}

// ============ UTILITY TYPES ============
export type AttendanceRecordCreate = Omit<
  AttendanceRecord,
  "id" | "createdAt" | "updatedAt"
>;
export type AttendanceRecordUpdate = Partial<
  Pick<
    AttendanceRecord,
    "status" | "checkOutTime" | "notes" | "validatedBy" | "validatedAt"
  >
>;

export type StudentAttendanceSummary = {
  studentId: string;
  studentName: string;
  className: string;
  totalSessions: number;
  attendedSessions: number;
  attendanceRate: number;
  lastAttendance?: string;
  currentStreak: number;
};

export type TeacherAttendanceOverview = {
  teacherId: string;
  teacherName: string;
  subjects: string[];
  totalSessions: number;
  completedSessions: number;
  avgClassAttendanceRate: number;
  activeSessions: number;
};

// ============ VALIDATION SCHEMAS (for runtime validation) ============
export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: "string" | "number" | "boolean" | "date" | "email";
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export const AttendanceRecordValidation: ValidationRule[] = [
  { field: "studentId", required: true, type: "string", minLength: 1 },
  { field: "studentName", required: true, type: "string", minLength: 2 },
  { field: "subject", required: true, type: "string", minLength: 1 },
  { field: "teacher", required: true, type: "string", minLength: 2 },
  { field: "date", required: true, type: "date" },
  { field: "checkInTime", required: true, type: "string" },
  { field: "status", required: true, type: "string" },
];

// ============ USER SESSION ============
export interface UserSession {
  userId: string;
  name: string;
  role: string;
  grade?: 10 | 11 | 12;
  school?: {
    province: string;
  };
  [key: string]: any;
}
