"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  submitAttendance,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  checkIn,
  checkOut,
  bulkCheckIn,
  bulkCheckOut,
  markAbsent,
} from "../../lib/apiClient";
import { attendanceKeys } from "./useAttendanceRecords";
import { AttendanceRecord } from "../types/attendance";

// A helper function to invalidate attendance queries on success
const useInvalidateAttendance = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
    queryClient.invalidateQueries({ queryKey: ["attendanceStats"] }); // Assuming stats have their own key
  };
};

export const useSubmitAttendance = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: submitAttendance, onSuccess: invalidate });
};

export const useUpdateAttendance = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({
    mutationFn: (variables: { recordId: string; updateData: Partial<AttendanceRecord> }) =>
      updateAttendanceRecord(variables),
    onSuccess: invalidate,
  });
};

export const useDeleteAttendance = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: deleteAttendanceRecord, onSuccess: invalidate });
};

export const useCheckIn = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: checkIn, onSuccess: invalidate });
};

export const useCheckOut = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: checkOut, onSuccess: invalidate });
};

export const useBulkCheckIn = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: bulkCheckIn, onSuccess: invalidate });
};

export const useBulkCheckOut = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: bulkCheckOut, onSuccess: invalidate });
};

export const useMarkAbsent = () => {
  const invalidate = useInvalidateAttendance();
  return useMutation({ mutationFn: markAbsent, onSuccess: invalidate });
};
