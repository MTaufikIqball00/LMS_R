// utils/attendanceUtils.ts
import {
  AttendanceRecord,
  AttendanceStats,
  WeeklyAttendanceData,
  MonthlyAttendanceData,
  SubjectAttendanceStats,
} from "../../types/attendance";

/**
 * Date and Time Utilities
 */

// Format date to Indonesian locale string
export const formatDateIndo = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Format date to short format (dd/mm/yyyy)
export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID");
};

// Format time to HH:MM format
export const formatTime = (dateString?: string): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get current date in YYYY-MM-DD format
export const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Get current datetime in ISO format
export const getCurrentDateTime = (): string => {
  return new Date().toISOString();
};

// Check if a date is today
export const isToday = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};

// Check if a date is in this week
export const isThisWeek = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  return date >= weekStart && date <= weekEnd;
};

// Check if a date is in this month
export const isThisMonth = (dateString: string): boolean => {
  const today = new Date();
  const date = new Date(dateString);
  return (
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};

// Get days difference between two dates
export const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get week number of the year
export const getWeekNumber = (date: Date): number => {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

/**
 * Status and Badge Utilities
 */

// Get status badge color classes
export const getStatusBadgeClass = (status: string): string => {
  const statusClasses = {
    present:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    absent: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
    permission:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300",
    sick: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300",
    early_leave:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
    excused:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
  };
  return (
    statusClasses[status as keyof typeof statusClasses] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300"
  );
};

// Get status icon
export const getStatusIcon = (status: string): string => {
  const statusIcons = {
    present: "✅",
    late: "⏰",
    absent: "❌",
    permission: "📝",
    sick: "🤒",
    early_leave: "🚪",
    excused: "📋",
  };
  return statusIcons[status as keyof typeof statusIcons] || "❓";
};

// Get readable status label in Indonesian
export const getStatusLabel = (status: string): string => {
  const statusLabels = {
    present: "Hadir",
    late: "Terlambat",
    absent: "Tidak Hadir",
    permission: "Izin",
    sick: "Sakit",
    early_leave: "Pulang Awal",
    excused: "Dimaafkan",
  };
  return statusLabels[status as keyof typeof statusLabels] || "Tidak Diketahui";
};

// Get attendance grade based on percentage
export const getAttendanceGrade = (
  percentage: number
): { grade: string; color: string } => {
  if (percentage >= 95)
    return { grade: "A+", color: "text-green-600 dark:text-green-400" };
  if (percentage >= 90)
    return { grade: "A", color: "text-green-600 dark:text-green-400" };
  if (percentage >= 85)
    return { grade: "B+", color: "text-blue-600 dark:text-blue-400" };
  if (percentage >= 80)
    return { grade: "B", color: "text-blue-600 dark:text-blue-400" };
  if (percentage >= 75)
    return { grade: "C+", color: "text-yellow-600 dark:text-yellow-400" };
  if (percentage >= 70)
    return { grade: "C", color: "text-yellow-600 dark:text-yellow-400" };
  if (percentage >= 65)
    return { grade: "D+", color: "text-orange-600 dark:text-orange-400" };
  if (percentage >= 60)
    return { grade: "D", color: "text-orange-600 dark:text-orange-400" };
  return { grade: "F", color: "text-red-600 dark:text-red-400" };
};

/**
 * Validation Utilities
 */

// Validate attendance status
export const isValidAttendanceStatus = (status: string): boolean => {
  const allowedStatuses = [
    "present",
    "absent",
    "late",
    "permission",
    "sick",
    "early_leave",
    "excused",
  ];
  return allowedStatuses.includes(status.toLowerCase());
};

// Validate date format (YYYY-MM-DD)
export const isValidDateFormat = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString) && !isNaN(Date.parse(dateString));
};

// Validate time format (HH:MM)
export const isValidTimeFormat = (timeString: string): boolean => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeString);
};

// Check if student is late based on scheduled time
export const isLate = (
  checkInTime: string,
  scheduledTime: string,
  graceMinutes: number = 15
): boolean => {
  const checkIn = new Date(`1970-01-01T${checkInTime}`);
  const scheduled = new Date(`1970-01-01T${scheduledTime}`);
  const diffMinutes = (checkIn.getTime() - scheduled.getTime()) / (1000 * 60);
  return diffMinutes > graceMinutes;
};

/**
 * Calculation Utilities
 */

// Calculate attendance rate percentage
export const calculateAttendanceRate = (
  presentDays: number,
  totalDays: number
): number => {
  return totalDays === 0
    ? 0
    : Math.round((presentDays / totalDays) * 100 * 100) / 100;
};

// ✅ Fixed: Calculate attendance statistics with proper interfaces
export const calculateAttendanceStats = (
  records: AttendanceRecord[]
): AttendanceStats => {
  const totalDays = records.length;
  const presentDays = records.filter((r) => r.status === "present").length;
  const lateDays = records.filter((r) => r.status === "late").length;
  const absentDays = records.filter((r) => r.status === "absent").length;
  const permissionDays = records.filter(
    (r) => r.status === "permission"
  ).length;
  const sickDays = records.filter((r) => r.status === "sick").length;
  const earlyLeaveDays = records.filter(
    (r) => r.status === "early_leave"
  ).length;

  // Calculate attendance rate
  const attendanceRate = calculateAttendanceRate(presentDays, totalDays);

  // Calculate punctuality rate (present on time vs late)
  const punctualityRate =
    presentDays > 0
      ? Math.round(((presentDays - lateDays) / presentDays) * 100 * 100) / 100
      : 0;

  // Calculate current streak
  let currentStreak = 0;
  const sortedRecords = [...records].sort(
    (a, b) =>
      new Date(b.date || b.createdAt).getTime() -
      new Date(a.date || a.createdAt).getTime()
  );

  for (const record of sortedRecords) {
    if (record.status === "present") {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  const chronologicalRecords = [...records].sort(
    (a, b) =>
      new Date(a.date || a.createdAt).getTime() -
      new Date(b.date || b.createdAt).getTime()
  );

  for (const record of chronologicalRecords) {
    if (record.status === "present") {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // ✅ Generate proper weekly data matching WeeklyAttendanceData interface
  const weeklyData: WeeklyAttendanceData[] = [];
  const today = new Date();
  const currentWeekNumber = getWeekNumber(today);

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const record = records.find(
      (r) => (r.date || r.createdAt.split("T")[0]) === dateStr
    );

    weeklyData.push({
      day: date.toLocaleDateString("id-ID", { weekday: "short" }),
      week: `Week ${currentWeekNumber}`, // ✅ Fixed: Changed from String to string
      present: record?.status === "present" ? 1 : 0,
      absent: record?.status === "absent" ? 1 : 0,
      late: record?.status === "late" ? 1 : 0,
      date: dateStr,
      status: record?.status || "absent",
      subject: record?.subject,
      period: record?.period,
    });
  }

  // ✅ Generate monthly data matching MonthlyAttendanceData interface
  const monthlyData: MonthlyAttendanceData[] = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(currentDate);
    monthDate.setMonth(currentDate.getMonth() - i);

    const monthRecords = records.filter((record) => {
      const recordDate = new Date(record.date || record.createdAt);
      return (
        recordDate.getMonth() === monthDate.getMonth() &&
        recordDate.getFullYear() === monthDate.getFullYear()
      );
    });

    const monthPresentDays = monthRecords.filter(
      (r) => r.status === "present"
    ).length;
    const monthAbsentDays = monthRecords.filter(
      (r) => r.status === "absent"
    ).length;
    const monthLateDays = monthRecords.filter(
      (r) => r.status === "late"
    ).length;
    const monthTotalDays = monthRecords.length;

    monthlyData.push({
      month: monthDate.toLocaleDateString("id-ID", { month: "long" }),
      year: monthDate.getFullYear(),
      totalDays: monthTotalDays,
      presentDays: monthPresentDays,
      absentDays: monthAbsentDays,
      lateCount: monthLateDays,
      attendanceRate: calculateAttendanceRate(monthPresentDays, monthTotalDays),
    });
  }

  // ✅ Generate subject statistics matching SubjectAttendanceStats interface
  const subjects = getUniqueSubjects(records);
  const subjectStats: SubjectAttendanceStats[] = subjects.map((subject) => {
    const subjectRecords = records.filter((r) => r.subject === subject);
    const subjectPresentDays = subjectRecords.filter(
      (r) => r.status === "present"
    ).length;
    const subjectTotalDays = subjectRecords.length;
    const subjectAbsentDays = subjectRecords.filter(
      (r) => r.status === "absent"
    ).length;
    const subjectLateDays = subjectRecords.filter(
      (r) => r.status === "late"
    ).length;

    return {
      subject,
      subjectCode:
        subjectRecords[0]?.subjectCode ||
        subject.toUpperCase().replace(/\s+/g, ""), // ✅ Added subjectCode
      teacher: subjectRecords[0]?.teacher || "Unknown",
      totalSessions: subjectTotalDays, // ✅ Changed from totalClasses to totalSessions
      attendedSessions: subjectPresentDays, // ✅ Changed from presentCount to attendedSessions
      missedSessions: subjectAbsentDays, // ✅ Changed from absentCount to missedSessions
      lateCount: subjectLateDays,
      attendanceRate: calculateAttendanceRate(
        subjectPresentDays,
        subjectTotalDays
      ),
    };
  });

  return {
    totalDays,
    presentDays,
    absentDays,
    lateCount: lateDays,
    permissionCount: permissionDays,
    sickCount: sickDays,
    earlyLeaveCount: earlyLeaveDays,
    attendanceRate,
    punctualityRate,
    currentStreak,
    longestStreak,
    weeklyData,
    monthlyData,
    subjectStats,
    lastUpdated: getCurrentDateTime(),
  };
};

// ✅ Enhanced monthly attendance summary to match interface
export const getMonthlyAttendanceSummary = (
  records: AttendanceRecord[],
  month: number,
  year: number
): MonthlyAttendanceData => {
  const monthlyRecords = records.filter((record) => {
    const date = new Date(record.date || record.createdAt);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const presentDays = monthlyRecords.filter(
    (r) => r.status === "present"
  ).length;
  const lateDays = monthlyRecords.filter((r) => r.status === "late").length;
  const absentDays = monthlyRecords.filter((r) => r.status === "absent").length;
  const totalDays = monthlyRecords.length;

  return {
    month: new Date(year, month).toLocaleDateString("id-ID", { month: "long" }),
    year,
    totalDays,
    presentDays,
    absentDays,
    lateCount: lateDays,
    attendanceRate: calculateAttendanceRate(presentDays, totalDays),
  };
};

// ✅ Helper function to get weekly summary matching interface
export const getWeeklyAttendanceSummary = (
  records: AttendanceRecord[],
  weekStart: Date
): WeeklyAttendanceData[] => {
  const weeklyData: WeeklyAttendanceData[] = [];
  const weekNumber = getWeekNumber(weekStart);

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const dayRecords = records.filter(
      (r) => (r.date || r.createdAt.split("T")[0]) === dateStr
    );

    const presentCount = dayRecords.filter(
      (r) => r.status === "present"
    ).length;
    const absentCount = dayRecords.filter((r) => r.status === "absent").length;
    const lateCount = dayRecords.filter((r) => r.status === "late").length;

    // Get the primary record for the day (or create a default)
    const primaryRecord = dayRecords[0];

    weeklyData.push({
      day: date.toLocaleDateString("id-ID", { weekday: "long" }),
      week: `Week ${weekNumber}`, // ✅ Fixed: string instead of String
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
};

/**
 * Data Processing Utilities
 */

// Group records by date
export const groupRecordsByDate = (records: AttendanceRecord[]) => {
  return records.reduce((groups, record) => {
    const date = record.date || record.createdAt.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, AttendanceRecord[]>);
};

// Group records by subject
export const groupRecordsBySubject = (records: AttendanceRecord[]) => {
  return records.reduce((groups, record) => {
    const subject = record.subject || "Unknown";
    if (!groups[subject]) {
      groups[subject] = [];
    }
    groups[subject].push(record);
    return groups;
  }, {} as Record<string, AttendanceRecord[]>);
};

// Get unique subjects from records
export const getUniqueSubjects = (records: AttendanceRecord[]): string[] => {
  return [...new Set(records.map((record) => record.subject).filter(Boolean))];
};

// Get unique teachers from records
export const getUniqueTeachers = (records: AttendanceRecord[]): string[] => {
  return [...new Set(records.map((record) => record.teacher).filter(Boolean))];
};

/**
 * Export Utilities
 */

// Convert records to CSV format
export const recordsToCSV = (records: AttendanceRecord[]): string => {
  const headers = [
    "Tanggal",
    "Mata Pelajaran",
    "Guru",
    "Status",
    "Waktu Masuk",
    "Waktu Keluar",
    "Catatan",
  ];
  const csvContent = [
    headers.join(","),
    ...records.map((record) =>
      [
        record.date || record.createdAt.split("T")[0],
        `"${record.subject || ""}"`,
        `"${record.teacher || ""}"`,
        getStatusLabel(record.status),
        formatTime(record.checkInTime),
        record.checkOutTime ? formatTime(record.checkOutTime) : "",
        `"${record.notes || ""}"`,
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
};

// Download CSV file
export const downloadCSV = (
  csvContent: string,
  filename: string = "attendance-data"
): void => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}-${getCurrentDate()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Formatting Utilities
 */

// Round number to specified decimal places
export const roundTo = (num: number, decimals: number = 2): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

// Format number with thousand separators
export const formatNumber = (num: number): string => {
  return num.toLocaleString("id-ID");
};

// Generate unique ID for attendance records
export const generateAttendanceId = (): string => {
  return `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get relative time description (e.g., "2 hours ago")
export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  if (diffHour < 24) return `${diffHour} jam lalu`;
  if (diffDay < 7) return `${diffDay} hari lalu`;
  return formatDateShort(dateString);
};

/**
 * Search and Filter Utilities
 */

// Search records by keyword
export const searchRecords = (
  records: AttendanceRecord[],
  keyword: string
): AttendanceRecord[] => {
  if (!keyword.trim()) return records;

  const searchTerm = keyword.toLowerCase();
  return records.filter(
    (record) =>
      (record.subject || "").toLowerCase().includes(searchTerm) ||
      (record.teacher || "").toLowerCase().includes(searchTerm) ||
      getStatusLabel(record.status).toLowerCase().includes(searchTerm) ||
      (record.notes || "").toLowerCase().includes(searchTerm)
  );
};

// Filter records by date range
export const filterRecordsByDateRange = (
  records: AttendanceRecord[],
  startDate: string,
  endDate: string
): AttendanceRecord[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return records.filter((record) => {
    const recordDate = new Date(record.date || record.createdAt);
    return recordDate >= start && recordDate <= end;
  });
};

// Filter records by status
export const filterRecordsByStatus = (
  records: AttendanceRecord[],
  status: string
): AttendanceRecord[] => {
  if (!status) return records;
  return records.filter((record) => record.status === status);
};

// Sort records by different criteria
export const sortRecords = (
  records: AttendanceRecord[],
  sortBy: "date" | "subject" | "status" | "teacher",
  order: "asc" | "desc" = "desc"
): AttendanceRecord[] => {
  return [...records].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison =
          new Date(a.date || a.createdAt).getTime() -
          new Date(b.date || b.createdAt).getTime();
        break;
      case "subject":
        comparison = (a.subject || "").localeCompare(b.subject || "");
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "teacher":
        comparison = (a.teacher || "").localeCompare(b.teacher || "");
        break;
    }

    return order === "desc" ? -comparison : comparison;
  });
};
