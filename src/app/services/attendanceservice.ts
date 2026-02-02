// services/attendanceService.ts
import {
  AttendanceRecord,
  AttendanceStats,
  AttendanceStatus,
  AttendanceSession,
  AttendanceFilters,
  BulkAttendanceOperation,
  GeolocationData,
  QRScanResult,
  QRCodeData,
  ClassSchedule,
  AttendanceMethod,
  CheckInFormData,
  AttendanceRecordUpdate,
  WeeklyAttendanceData,
  MonthlyAttendanceData,
  SubjectAttendanceStats,
  DeviceInfo,
  SecurityLog,
} from "../types/attendance";

// ✅ Constants for method values (instead of enum)
const ATTENDANCE_METHODS = {
  QR_CODE: "qr_code",
  MANUAL: "manual",
  GEOLOCATION: "GeolocationData",
  FACE_RECOGNITION: "face_recognition",
  RFID: "rfid",
} as const;

// Updated interface untuk bulk operations - lebih fleksibel
export interface BulkCheckInData {
  records: (CheckInFormData | Partial<AttendanceRecord>)[];
  validateLocation: boolean;
  allowDuplicates: boolean;
  sessionId?: string;
  method?: AttendanceMethod;
}

// Extended CheckIn data yang lebih fleksibel
export interface ExtendedCheckInData {
  // Required field
  studentId: string;

  // Optional fields dari CheckInFormData
  sessionId?: string;
  location?: GeolocationData;
  qrCodeData?: string;
  method?: AttendanceMethod;
  notes?: string;

  // Additional optional fields
  userId?: string;
  userName?: string;
  studentName?: string;
  studentClass?: string;
  studentNumber?: string;
  subject?: string;
  subjectCode?: string;
  teacher?: string;
  teacherId?: string;
  date?: string;
  checkInTime?: string;
  semester?: string;
  academicYear?: string;
  period?: number;
  duration?: number;
  deviceInfo?: DeviceInfo;
  sessionData?: any;
  status?: AttendanceStatus;
  checkOutLocation?: GeolocationData;
}

// Union type untuk input flexibility
export type CheckInInput = ExtendedCheckInData | Partial<AttendanceRecord>;

// Mock API delay for realistic behavior
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Storage keys for localStorage
const STORAGE_KEYS = {
  RECORDS: "attendance_records",
  STATS: "attendance_stats",
  SESSIONS: "attendance_sessions",
  SCHEDULES: "class_schedules",
  NOTIFICATIONS: "attendance_notifications",
  PERMISSIONS: "attendance_permissions",
  SETTINGS: "attendance_settings",
  OFFLINE_QUEUE: "offline_attendance_queue",
  QR_CODES: "qr_codes",
  DEVICE_INFO: "device_info",
  SECURITY_LOGS: "security_logs",
};

class AttendanceService {
  private isOnline(): boolean {
    return navigator.onLine;
  }

  private generateId(): string {
    return `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ============ STORAGE UTILITIES ============
  private getStoredData<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveData<T>(key: string, data: T): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
    }
  }

  // ============ HELPER FUNCTIONS ============
  private normalizeLocation(location: any): GeolocationData | undefined {
    if (!location) return undefined;

    if ("timestamp" in location) {
      return location as GeolocationData;
    }

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy || 10,
      timestamp: Date.now(),
      address: location.address,
    };
  }

  private getSessionId(input: CheckInInput): string | undefined {
    if ("sessionId" in input && typeof input.sessionId === "string") {
      return input.sessionId;
    }
    return undefined;
  }

  // ============ INPUT NORMALIZATION ============
  private normalizeCheckInInput(input: CheckInInput): ExtendedCheckInData {
    const studentId = input.studentId || input.userId || "unknown_student";

    if (!studentId || studentId === "unknown_student") {
      throw new Error("Student ID is required for attendance");
    }

    const normalized: ExtendedCheckInData = {
      studentId,
      sessionId: this.getSessionId(input),
      location: this.normalizeLocation(input.location),
      qrCodeData: "qrCodeData" in input ? input.qrCodeData : undefined,
      method: "method" in input ? input.method : ATTENDANCE_METHODS.MANUAL,
      notes: input.notes,
      userId: input.userId,
      userName: input.userName,
      studentName: input.studentName,
      studentClass: "studentClass" in input ? input.studentClass : undefined,
      studentNumber: "studentNumber" in input ? input.studentNumber : undefined,
      subject: input.subject,
      subjectCode: "subjectCode" in input ? input.subjectCode : undefined,
      teacher: input.teacher,
      teacherId: "teacherId" in input ? input.teacherId : undefined,
      date: input.date,
      checkInTime: input.checkInTime,
      semester: "semester" in input ? input.semester : undefined,
      academicYear: "academicYear" in input ? input.academicYear : undefined,
      period: "period" in input ? input.period : undefined,
      duration: "duration" in input ? input.duration : undefined,
      deviceInfo: "deviceInfo" in input ? input.deviceInfo : undefined,
      sessionData: "sessionData" in input ? input.sessionData : undefined,
      status: "status" in input ? input.status : undefined,
      checkOutLocation: this.normalizeLocation(
        "checkOutLocation" in input ? input.checkOutLocation : undefined
      ),
    };

    return normalized;
  }

  // ============ CORE ATTENDANCE METHODS ============
  async getRecords(filters?: AttendanceFilters): Promise<AttendanceRecord[]> {
    await mockDelay();

    let records = this.getStoredData<AttendanceRecord[]>(
      STORAGE_KEYS.RECORDS,
      []
    );

    if (records.length === 0) {
      records = await this.initializeMockData();
    }

    if (filters) {
      records = this.applyFilters(records, filters);
    }

    return records.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getStats(
    studentId?: string,
    filters?: AttendanceFilters
  ): Promise<AttendanceStats> {
    await mockDelay();

    const records = await this.getRecords(filters);
    const filteredRecords = studentId
      ? records.filter((r) => r.studentId === studentId)
      : records;

    const presentRecords = filteredRecords.filter(
      (r) => r.status === "present"
    );
    const absentRecords = filteredRecords.filter((r) => r.status === "absent");
    const lateRecords = filteredRecords.filter((r) => r.status === "late");
    const permissionRecords = filteredRecords.filter(
      (r) => r.status === "permission"
    );
    const sickRecords = filteredRecords.filter((r) => r.status === "sick");
    const earlyLeaveRecords = filteredRecords.filter(
      (r) => r.status === "early_leave"
    );

    const totalDays = filteredRecords.length;
    const presentDays = presentRecords.length;
    const attendanceRate =
      totalDays > 0
        ? Math.round((presentDays / totalDays) * 100 * 100) / 100
        : 0;

    // Calculate punctuality rate (present without being late)
    const punctualPresentRecords = presentRecords.filter(
      (r) => !r.notes?.includes("late")
    );
    const punctualityRate =
      presentDays > 0
        ? Math.round(
            (punctualPresentRecords.length / presentDays) * 100 * 100
          ) / 100
        : 0;

    // ✅ Use the fixed helper methods
    const weeklyData = this.generateWeeklyData(filteredRecords);
    const monthlyData = this.generateMonthlyData(filteredRecords);
    const subjectStats = this.generateSubjectStats(filteredRecords);

    return {
      totalDays,
      presentDays,
      absentDays: absentRecords.length,
      lateCount: lateRecords.length,
      permissionCount: permissionRecords.length,
      sickCount: sickRecords.length,
      earlyLeaveCount: earlyLeaveRecords.length,
      attendanceRate,
      punctualityRate,
      currentStreak: this.calculateCurrentStreak(filteredRecords),
      longestStreak: this.calculateLongestStreak(filteredRecords),
      weeklyData,
      monthlyData,
      subjectStats,
      lastUpdated: new Date().toISOString(),
    };
  }

  // MAIN CHECK-IN METHOD
  async checkIn(input: CheckInInput): Promise<AttendanceRecord> {
    await mockDelay();

    const records = this.getStoredData<AttendanceRecord[]>(
      STORAGE_KEYS.RECORDS,
      []
    );
    const data = this.normalizeCheckInInput(input);
    const now = new Date().toISOString();
    const today = new Date().toISOString().split("T")[0];

    const existingRecord = records.find(
      (r) =>
        r.studentId === data.studentId &&
        r.date === (data.date || today) &&
        !r.checkOutTime
    );

    if (existingRecord) {
      throw new Error("Student already checked in today");
    }

    const newRecord: AttendanceRecord = {
      id: this.generateId(),
      userId: data.userId || data.studentId,
      userName: data.userName || data.studentName || "Current User",
      studentId: data.studentId,
      studentName: data.studentName || data.userName || "Current User",
      data: this.generateId(),
      studentClass: data.studentClass || "Unknown Class",
      studentNumber: data.studentNumber || "001",
      subject: data.subject || "General",
      subjectCode: data.subjectCode || "GEN001",
      teacher: data.teacher || "Teacher",
      teacherId: data.teacherId || "teacher_1",
      date: data.date || today,
      checkInTime: data.checkInTime || now,
      status: data.status || this.determineStatus(now, data.checkInTime),
      location: data.location || {
        latitude: -6.2088,
        longitude: 106.8456,
        accuracy: 10,
        timestamp: Date.now(),
        address: "Jakarta, Indonesia",
      },
      checkOutLocation: data.checkOutLocation,
      sessionData: data.sessionData,
      qrCodeData: data.qrCodeData,
      notes: data.notes,
      semester: data.semester || "ganjil",
      academicYear: data.academicYear || "2025/2026",
      period: data.period || 1,
      duration: data.duration,
      isActive: true,
      method: data.method || ATTENDANCE_METHODS.MANUAL,
      deviceInfo: data.deviceInfo || this.getCurrentDeviceInfo(),
      parentNotified: false,
      attachments: [],
      metadata: {},
      createdAt: now,
      updatedAt: now,
    };

    const updatedRecords = [newRecord, ...records];
    this.saveData(STORAGE_KEYS.RECORDS, updatedRecords);

    await this.logSecurityEvent(
      "attendance_checkin",
      newRecord.studentId,
      "success"
    );

    return newRecord;
  }

  async checkOut(recordId: string): Promise<AttendanceRecord> {
    await mockDelay();

    const records = this.getStoredData<AttendanceRecord[]>(
      STORAGE_KEYS.RECORDS,
      []
    );
    const recordIndex = records.findIndex((r) => r.id === recordId);

    if (recordIndex === -1) {
      throw new Error("Attendance record not found");
    }

    const now = new Date().toISOString();
    const updatedRecord = {
      ...records[recordIndex],
      checkOutTime: now,
      checkOutLocation: records[recordIndex].location,
      isActive: false,
      updatedAt: now,
    };

    if (!updatedRecord.duration && updatedRecord.checkInTime) {
      const checkInTime = new Date(updatedRecord.checkInTime);
      const checkOutTime = new Date(now);
      updatedRecord.duration = Math.round(
        (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60)
      );
    }

    records[recordIndex] = updatedRecord;
    this.saveData(STORAGE_KEYS.RECORDS, records);

    await this.logSecurityEvent(
      "attendance_checkout",
      updatedRecord.studentId,
      "success"
    );

    return updatedRecord;
  }

  // ============ BULK OPERATIONS ============
  async bulkCheckIn(data: BulkCheckInData): Promise<AttendanceRecord[]> {
    await mockDelay(1000);

    const results: AttendanceRecord[] = [];
    const errors: { studentId: string; error: string }[] = [];

    for (const recordData of data.records) {
      try {
        const studentId = recordData.studentId || "unknown_student";
        if (!studentId || studentId === "unknown_student") {
          throw new Error("Student ID is required");
        }

        const checkInInput: CheckInInput = {
          ...recordData,
          studentId,
          method:
            data.method ||
            ("method" in recordData
              ? recordData.method
              : ATTENDANCE_METHODS.MANUAL),
          sessionId: data.sessionId || this.getSessionId(recordData),
        };

        const record = await this.checkIn(checkInInput);
        results.push(record);
      } catch (error: any) {
        errors.push({
          studentId: recordData.studentId || "unknown",
          error: error.message,
        });

        if (!data.allowDuplicates) {
          console.error("Bulk check-in stopped due to error:", error);
          break;
        }
      }
    }

    const bulkOp: BulkAttendanceOperation = {
      id: this.generateId(),
      type: "check_in",
      sessionId: data.sessionId || "bulk_session",
      studentIds: data.records.map((r) => r.studentId || "unknown"),
      processedBy: "system",
      processedAt: new Date().toISOString(),
      results: {
        success: results.map((r) => r.studentId),
        failed: errors,
      },
    };

    this.saveBulkOperation(bulkOp);
    return results;
  }

  async bulkCheckOut(recordIds: string[]): Promise<AttendanceRecord[]> {
    await mockDelay(1000);

    const results: AttendanceRecord[] = [];
    const errors: { studentId: string; error: string }[] = [];

    for (const recordId of recordIds) {
      try {
        const record = await this.checkOut(recordId);
        results.push(record);
      } catch (error: any) {
        errors.push({
          studentId: recordId,
          error: error.message,
        });
      }
    }

    const bulkOp: BulkAttendanceOperation = {
      id: this.generateId(),
      type: "check_out",
      sessionId: "bulk_checkout",
      studentIds: recordIds,
      processedBy: "system",
      processedAt: new Date().toISOString(),
      results: {
        success: results.map((r) => r.studentId),
        failed: errors,
      },
    };

    this.saveBulkOperation(bulkOp);
    return results;
  }

  // ============ SPECIFIC STATUS METHODS ============
  async markAbsent(
    studentId: string,
    date: string,
    reason?: string
  ): Promise<AttendanceRecord> {
    await mockDelay();

    const checkInInput: CheckInInput = {
      studentId,
      studentName: `Student ${studentId}`,
      location: {
        latitude: 0,
        longitude: 0,
        accuracy: 0,
        timestamp: Date.now(),
      },
      method: ATTENDANCE_METHODS.MANUAL,
      notes: reason,
      date,
      checkInTime: new Date().toISOString(),
      status: "absent",
    };

    return this.checkIn(checkInInput);
  }

  async markPresent(
    studentId: string,
    sessionData?: any
  ): Promise<AttendanceRecord> {
    const checkInInput: CheckInInput = {
      studentId,
      studentName: `Student ${studentId}`,
      location: sessionData?.location || {
        latitude: -6.2088,
        longitude: 106.8456,
        accuracy: 10,
        timestamp: Date.now(),
      },
      method: ATTENDANCE_METHODS.MANUAL,
      notes: sessionData
        ? `Session: ${JSON.stringify(sessionData)}`
        : undefined,
      sessionData,
      sessionId: sessionData?.sessionId,
      status: "present",
    };

    return this.checkIn(checkInInput);
  }

  // ============ RECORD MANAGEMENT ============
  async updateRecord(
    recordId: string,
    updates: AttendanceRecordUpdate
  ): Promise<AttendanceRecord> {
    await mockDelay();

    const records = this.getStoredData<AttendanceRecord[]>(
      STORAGE_KEYS.RECORDS,
      []
    );
    const recordIndex = records.findIndex((r) => r.id === recordId);

    if (recordIndex === -1) {
      throw new Error("Attendance record not found");
    }

    const updatedRecord = {
      ...records[recordIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    records[recordIndex] = updatedRecord;
    this.saveData(STORAGE_KEYS.RECORDS, records);

    return updatedRecord;
  }

  async deleteRecord(recordId: string): Promise<boolean> {
    await mockDelay();

    const records = this.getStoredData<AttendanceRecord[]>(
      STORAGE_KEYS.RECORDS,
      []
    );
    const filteredRecords = records.filter((r) => r.id !== recordId);

    if (filteredRecords.length === records.length) {
      throw new Error("Attendance record not found");
    }

    this.saveData(STORAGE_KEYS.RECORDS, filteredRecords);
    return true;
  }

  async verifyRecord(
    recordId: string,
    verifiedBy?: string
  ): Promise<AttendanceRecord> {
    return this.updateRecord(recordId, {
      validatedBy: verifiedBy || "system",
      validatedAt: new Date().toISOString(),
    });
  }

  // ============ SESSION MANAGEMENT ============
  async createSession(
    scheduleId: string,
    date: string
  ): Promise<AttendanceSession> {
    await mockDelay();

    const sessions = this.getStoredData<AttendanceSession[]>(
      STORAGE_KEYS.SESSIONS,
      []
    );
    const schedules = this.getStoredData<ClassSchedule[]>(
      STORAGE_KEYS.SCHEDULES,
      []
    );

    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) {
      throw new Error("Schedule not found");
    }

    const newSession: AttendanceSession = {
      id: this.generateId(),
      classScheduleId: scheduleId,
      date,
      subject: schedule.subject,
      teacher: schedule.teacher,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        accuracy: 10,
        timestamp: Date.now(),
        address: `${schedule.building}, ${schedule.room}`,
      },
      status: "scheduled",
      attendanceRecords: [],
      totalStudents: 30,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessions.push(newSession);
    this.saveData(STORAGE_KEYS.SESSIONS, sessions);

    return newSession;
  }

  async getSessions(filters?: {
    date?: string;
    teacherId?: string;
    status?: string;
  }): Promise<AttendanceSession[]> {
    await mockDelay();

    let sessions = this.getStoredData<AttendanceSession[]>(
      STORAGE_KEYS.SESSIONS,
      []
    );

    if (filters?.date) {
      sessions = sessions.filter((s) => s.date === filters.date);
    }
    if (filters?.status) {
      sessions = sessions.filter((s) => s.status === filters.status);
    }

    return sessions;
  }

  // ============ QR CODE METHODS ============
  async generateQRCode(
    sessionId: string,
    validDuration: number = 300000
  ): Promise<QRCodeData> {
    await mockDelay();

    const qrData: QRCodeData = {
      id: this.generateId(),
      classId: sessionId,
      subjectCode: "GEN001",
      date: new Date().toISOString().split("T")[0],
      period: 1,
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + validDuration).toISOString(),
      location: {
        latitude: -6.2088,
        longitude: 106.8456,
        accuracy: 10,
        timestamp: Date.now(),
      },
      generatedBy: "system",
      maxDistance: 50,
    };

    const qrCodes = this.getStoredData<QRCodeData[]>(STORAGE_KEYS.QR_CODES, []);
    qrCodes.push(qrData);
    this.saveData(STORAGE_KEYS.QR_CODES, qrCodes);

    return qrData;
  }

  async validateQRCode(
    qrData: string,
    location?: GeolocationData
  ): Promise<QRScanResult> {
    await mockDelay();

    const qrCodes = this.getStoredData<QRCodeData[]>(STORAGE_KEYS.QR_CODES, []);
    const qrCode = qrCodes.find((qr) => qr.id === qrData);

    if (!qrCode) {
      return {
        data: qrData,
        timestamp: Date.now(),
        isValid: false,
        location,
        validationDetails: {
          locationValid: false,
          timeValid: false,
          deviceValid: false,
        },
      };
    }

    const now = Date.now();
    const validFrom = new Date(qrCode.validFrom).getTime();
    const validUntil = new Date(qrCode.validUntil).getTime();
    const timeValid = now >= validFrom && now <= validUntil;

    let locationValid = true;
    if (location && qrCode.location) {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        qrCode.location.latitude,
        qrCode.location.longitude
      );
      locationValid = distance <= qrCode.maxDistance;
    }

    return {
      data: qrData,
      timestamp: now,
      isValid: timeValid && locationValid,
      location,
      deviceInfo: this.getCurrentDeviceInfo(),
      validationDetails: {
        expectedData: qrCode.id,
        locationValid,
        timeValid,
        deviceValid: true,
      },
    };
  }

  // ============ GEOLOCATION METHODS ============
  async getCurrentLocation(): Promise<GeolocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude || undefined,
            altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed || undefined,
            timestamp: position.timestamp,
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }

  async validateLocation(
    currentLocation: GeolocationData,
    targetLocation: GeolocationData,
    maxDistance: number = 100
  ): Promise<boolean> {
    const distance = this.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      targetLocation.latitude,
      targetLocation.longitude
    );

    return distance <= maxDistance;
  }

  // ============ EXPORT METHODS ============
  async exportRecords(
    startDate?: string,
    endDate?: string,
    format: "csv" | "json" | "xlsx" = "csv"
  ): Promise<string> {
    await mockDelay(1000);

    const filters: AttendanceFilters = {};
    if (startDate && endDate) {
      filters.dateRange = { start: startDate, end: endDate };
    }

    const records = await this.getRecords(filters);

    if (format === "json") {
      return JSON.stringify(records, null, 2);
    }

    // CSV format
    const csvHeader =
      [
        "ID",
        "Student ID",
        "Student Name",
        "Class",
        "Subject",
        "Teacher",
        "Date",
        "Check In",
        "Check Out",
        "Status",
        "Duration",
        "Location",
        "Method",
        "Notes",
        "Verified By",
        "Created At",
      ].join(",") + "\n";

    const csvData = records
      .map((record) =>
        [
          record.id,
          record.studentId,
          record.studentName,
          record.studentClass,
          record.subject,
          record.teacher,
          record.date,
          record.checkInTime,
          record.checkOutTime || "",
          record.status,
          record.duration || "",
          record.location
            ? `"${record.location.latitude},${record.location.longitude}"`
            : "",
          record.method,
          record.notes || "",
          record.validatedBy || "",
          record.createdAt,
        ]
          .map((field) => `"${field}"`)
          .join(",")
      )
      .join("\n");

    return csvHeader + csvData;
  }

  // ============ UTILITY METHODS ============
  private async initializeMockData(): Promise<AttendanceRecord[]> {
    const mockRecords: AttendanceRecord[] = [
      {
        id: this.generateId(),
        userId: "user_1",
        userName: "Ahmad Subarjo",
        studentId: "STD001",
        studentName: "Ahmad Subarjo",
        data: this.generateId(),
        studentClass: "XI IPA 1",
        studentNumber: "001",
        subject: "Biologi",
        subjectCode: "BIO001",
        teacher: "Dr. Sarah",
        teacherId: "teacher_1",
        date: new Date().toISOString().split("T")[0],
        checkInTime: new Date().toISOString(),
        status: "present",
        location: {
          latitude: -6.2088,
          longitude: 106.8456,
          accuracy: 10,
          address: "Jakarta, Indonesia",
        },
        semester: "ganjil",
        academicYear: "2025/2026",
        period: 1,
        isActive: true,
        method: ATTENDANCE_METHODS.QR_CODE,
        deviceInfo: this.getCurrentDeviceInfo(),
        parentNotified: false,
        attachments: [],
        metadata: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    this.saveData(STORAGE_KEYS.RECORDS, mockRecords);
    return mockRecords;
  }

  private applyFilters(
    records: AttendanceRecord[],
    filters: AttendanceFilters
  ): AttendanceRecord[] {
    let filtered = [...records];

    if (filters.dateRange) {
      filtered = filtered.filter(
        (r) =>
          r.date >= filters.dateRange!.start && r.date <= filters.dateRange!.end
      );
    }

    if (filters.status?.length) {
      filtered = filtered.filter((r) => filters.status!.includes(r.status));
    }

    if (filters.studentIds?.length) {
      filtered = filtered.filter((r) =>
        filters.studentIds!.includes(r.studentId)
      );
    }

    if (filters.classNames?.length) {
      filtered = filtered.filter((r) =>
        filters.classNames!.includes(r.studentClass)
      );
    }

    if (filters.subjects?.length) {
      filtered = filtered.filter((r) => filters.subjects!.includes(r.subject));
    }

    if (filters.teachers?.length) {
      filtered = filtered.filter((r) => filters.teachers!.includes(r.teacher));
    }

    if (filters.method?.length) {
      filtered = filtered.filter((r) => filters.method!.includes(r.method));
    }

    return filtered;
  }

  private determineStatus(
    currentTime: string,
    scheduledTime?: string
  ): AttendanceStatus {
    if (!scheduledTime) return "present";

    const current = new Date(currentTime);
    const scheduled = new Date(scheduledTime);
    const diffMinutes = (current.getTime() - scheduled.getTime()) / (1000 * 60);

    if (diffMinutes > 15) return "late";
    return "present";
  }

  private getCurrentDeviceInfo(): DeviceInfo {
    return {
      deviceId: "device_" + Math.random().toString(36).substr(2, 9),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      browser: this.getBrowserName(),
      ipAddress: "192.168.1.1",
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      isRegistered: true,
      isTrusted: true,
      lastUsed: new Date().toISOString(),
    };
  }

  private getBrowserName(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown";
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private async logSecurityEvent(
    action: string,
    userId: string,
    result: "success" | "failed" | "suspicious"
  ): Promise<void> {
    const securityLogs = this.getStoredData<SecurityLog[]>(
      STORAGE_KEYS.SECURITY_LOGS,
      []
    );

    const log: SecurityLog = {
      id: this.generateId(),
      userId,
      userRole: "student",
      action,
      resource: "attendance",
      ipAddress: "192.168.1.1",
      userAgent: navigator.userAgent,
      result,
      timestamp: new Date().toISOString(),
    };

    securityLogs.push(log);
    this.saveData(STORAGE_KEYS.SECURITY_LOGS, securityLogs);
  }

  private saveBulkOperation(operation: BulkAttendanceOperation): void {
    const operations = this.getStoredData<BulkAttendanceOperation[]>(
      "bulk_operations",
      []
    );
    operations.push(operation);
    this.saveData("bulk_operations", operations);
  }

  // ============ HELPER METHOD IMPLEMENTATIONS ============
  // ✅ Fixed generateWeeklyData to match WeeklyAttendanceData interface
  private generateWeeklyData(
    records: AttendanceRecord[]
  ): WeeklyAttendanceData[] {
    const weeklyData: WeeklyAttendanceData[] = [];
    const today = new Date();

    // Generate last 7 days of data
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Find all records for this date
      const dayRecords = records.filter((r) => r.date === dateStr);

      // Count status occurrences
      const presentCount = dayRecords.filter(
        (r) => r.status === "present"
      ).length;
      const absentCount = dayRecords.filter(
        (r) => r.status === "absent"
      ).length;
      const lateCount = dayRecords.filter((r) => r.status === "late").length;

      // Get primary record for additional info (subject, period)
      const primaryRecord = dayRecords[0];

      // Get week number
      const weekNumber = this.getWeekNumber(date);

      weeklyData.push({
        day: date.toLocaleDateString("id-ID", { weekday: "short" }),
        week: `Week ${weekNumber}`,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        date: dateStr,
        status: primaryRecord?.status || "absent",
        subject: primaryRecord?.subject,
        period: primaryRecord?.period,
      });
    }

    return weeklyData;
  }

  private generateMonthlyData(
    records: AttendanceRecord[]
  ): MonthlyAttendanceData[] {
    const monthlyMap = new Map<string, MonthlyAttendanceData>();

    records.forEach((record) => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString("id-ID", { month: "long" });

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthName,
          year: date.getFullYear(),
          totalDays: 0,
          presentDays: 0,
          absentDays: 0,
          lateCount: 0,
          attendanceRate: 0,
        });
      }

      const monthData = monthlyMap.get(monthKey)!;
      monthData.totalDays++;

      if (record.status === "present") monthData.presentDays++;
      if (record.status === "absent") monthData.absentDays++;
      if (record.status === "late") monthData.lateCount++;

      monthData.attendanceRate =
        monthData.totalDays > 0
          ? (monthData.presentDays / monthData.totalDays) * 100
          : 0;
    });

    return Array.from(monthlyMap.values()).slice(-6); // Return last 6 months
  }

  private generateSubjectStats(
    records: AttendanceRecord[]
  ): SubjectAttendanceStats[] {
    const subjects = new Set(records.map((r) => r.subject));
    return Array.from(subjects).map((subject) => {
      const subjectRecords = records.filter((r) => r.subject === subject);
      const attendedSessions = subjectRecords.filter(
        (r) => r.status === "present"
      ).length;
      const missedSessions = subjectRecords.filter(
        (r) => r.status === "absent"
      ).length;
      const lateCount = subjectRecords.filter(
        (r) => r.status === "late"
      ).length;

      return {
        subject,
        subjectCode:
          subjectRecords[0]?.subjectCode ||
          subject.toUpperCase().replace(/\s+/g, ""),
        teacher: subjectRecords[0]?.teacher || "Unknown Teacher",
        totalSessions: subjectRecords.length,
        attendedSessions,
        missedSessions,
        lateCount,
        attendanceRate:
          subjectRecords.length > 0
            ? Math.round(
                (attendedSessions / subjectRecords.length) * 100 * 100
              ) / 100
            : 0,
      };
    });
  }

  // ✅ Add missing helper method for week calculation
  private getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  private calculateCurrentStreak(records: AttendanceRecord[]): number {
    if (records.length === 0) return 0;

    // Sort records by date (most recent first)
    const sortedRecords = records.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;

    // Count consecutive present days from most recent
    for (const record of sortedRecords) {
      if (record.status === "present") {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateLongestStreak(records: AttendanceRecord[]): number {
    if (records.length === 0) return 0;

    // Sort records by date (oldest first)
    const sortedRecords = records.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let longestStreak = 0;
    let currentStreak = 0;

    for (const record of sortedRecords) {
      if (record.status === "present") {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return longestStreak;
  }
}

export const attendanceService = new AttendanceService();
export { ATTENDANCE_METHODS };
