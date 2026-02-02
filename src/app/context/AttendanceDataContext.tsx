"use client";
import React, { createContext, useContext, useMemo } from "react";
import { AttendanceRecord, AttendanceStats } from "../types/attendance";
import { useAttendanceRecords } from "../hooks/useAttendanceRecords";
import {
  useSubmitAttendance,
  useUpdateAttendance,
  useDeleteAttendance,
  useCheckIn,
  useCheckOut,
  useBulkCheckIn,
  useBulkCheckOut,
  useMarkAbsent,
} from "../hooks/useAttendanceMutations";
import { BulkCheckInData } from "../../lib/apiClient";

interface AttendanceContextType {
  // Queries
  data: AttendanceRecord[];
  stats: AttendanceStats;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  // Mutations
  submitAttendance: (data: any) => void;
  updateRecord: (variables: {
    recordId: string;
    updateData: Partial<AttendanceRecord>;
  }) => void;
  deleteRecord: (recordId: string) => void;
  checkIn: (data: Partial<AttendanceRecord>) => void;
  checkOut: (recordId: string) => void;
  bulkCheckIn: (data: BulkCheckInData) => void;
  bulkCheckOut: (recordIds: string[]) => void;
  markAbsent: (params: {
    userId: string;
    date: string;
    reason?: string;
  }) => void;
}

const AttendanceDataContext = createContext<AttendanceContextType | null>(null);

export const AttendanceDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { data: records, isLoading, isError, error } = useAttendanceRecords();

  // --- All mutations are now handled by TanStack Query ---
  const { mutate: submitAttendance } = useSubmitAttendance();
  const { mutate: updateRecord } = useUpdateAttendance();
  const { mutate: deleteRecord } = useDeleteAttendance();
  const { mutate: checkIn } = useCheckIn();
  const { mutate: checkOut } = useCheckOut();
  const { mutate: bulkCheckIn } = useBulkCheckIn();
  const { mutate: bulkCheckOut } = useBulkCheckOut();
  const { mutate: markAbsent } = useMarkAbsent();

  const stats = useMemo((): AttendanceStats => {
    const data = records || [];
    if (data.length === 0) {
      return {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        lateCount: 0,
        permissionCount: 0,
        sickCount: 0,
        earlyLeaveCount: 0,
        attendanceRate: 0,
        punctualityRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyData: [],
        monthlyData: [],
        subjectStats: [],
        lastUpdated: new Date().toISOString(),
      };
    }
    let presentDays = 0,
      absentDays = 0,
      lateCount = 0,
      permissionCount = 0,
      sickCount = 0,
      earlyLeaveCount = 0;
    data.forEach((record) => {
      switch (record.status) {
        case "present":
          presentDays++;
          break;
        case "absent":
          absentDays++;
          break;
        case "late":
          lateCount++;
          break;
        case "permission":
          permissionCount++;
          break;
        case "sick":
          sickCount++;
          break;
        case "early_leave":
          earlyLeaveCount++;
          break;
      }
    });
    const totalDays = data.length;
    const attendanceRate =
      totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
    const punctualityRate =
      totalDays > 0
        ? Math.round(((presentDays + lateCount * 0.5) / totalDays) * 100)
        : 0;
    let currentStreak = 0,
      longestStreak = 0,
      tempStreak = 0;
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.date || a.createdAt || "").getTime() -
        new Date(b.date || b.createdAt || "").getTime()
    );
    sortedData.forEach((record) => {
      if (record.status === "present") {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });
    currentStreak =
      sortedData.length > 0 &&
      sortedData[sortedData.length - 1].status === "present"
        ? tempStreak
        : 0;
    return {
      totalDays,
      presentDays,
      absentDays,
      lateCount,
      permissionCount,
      sickCount,
      earlyLeaveCount,
      attendanceRate,
      punctualityRate,
      currentStreak,
      longestStreak,
      weeklyData: [],
      monthlyData: [],
      subjectStats: [],
      lastUpdated: new Date().toISOString(),
    };
  }, [records]);

  const value: AttendanceContextType = {
    data: records || [],
    stats,
    isLoading,
    isError,
    error,
    submitAttendance,
    updateRecord,
    deleteRecord,
    checkIn,
    checkOut,
    bulkCheckIn,
    bulkCheckOut,
    markAbsent,
  };

  return (
    <AttendanceDataContext.Provider value={value}>
      {children}
    </AttendanceDataContext.Provider>
  );
};

export const useAttendanceData = () => {
  const context = useContext(AttendanceDataContext);
  if (!context) {
    throw new Error(
      "useAttendanceData must be used within AttendanceDataProvider"
    );
  }
  return context;
};
