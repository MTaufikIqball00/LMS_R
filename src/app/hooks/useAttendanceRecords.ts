"use client";

import { useQuery } from "@tanstack/react-query";
import { getAttendanceRecords } from "../../lib/apiClient";
import { AttendanceRecord } from "../types/attendance";

// Query key factory for organizing query keys
export const attendanceKeys = {
  all: ["attendance"] as const,
  lists: () => [...attendanceKeys.all, "list"] as const,
  list: (filters: string) => [...attendanceKeys.lists(), { filters }] as const,
  details: () => [...attendanceKeys.all, "detail"] as const,
  detail: (id: string) => [...attendanceKeys.details(), id] as const,
};

/**
 * Custom hook to fetch attendance records for the logged-in user.
 * It handles fetching, caching, and server state management via TanStack Query.
 */
export const useAttendanceRecords = () => {
  return useQuery<AttendanceRecord[], Error>({
    queryKey: attendanceKeys.lists(),
    queryFn: getAttendanceRecords,
    // Optional: Configure staleTime and gcTime for better caching behavior
    // staleTime: 5 * 60 * 1000, // 5 minutes
    // gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
