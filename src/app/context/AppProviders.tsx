// app/context/AppProviders.tsx
"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./NotificationContext";
import { LocationProvider } from "./LocationContext";
import { AttendanceDataProvider } from "./AttendanceDataContext";
import { AttendanceProvider } from "./AttendanceContext"; // ✅ Tambahkan import ini

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Create a client
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AttendanceProvider>
          {" "}
          {/* ✅ Tambahkan AttendanceProvider */}
          <AttendanceDataProvider>
            <LocationProvider>{children}</LocationProvider>
          </AttendanceDataProvider>
        </AttendanceProvider>{" "}
        {/* ✅ Tutup AttendanceProvider */}
      </NotificationProvider>
    </QueryClientProvider>
  );
}
