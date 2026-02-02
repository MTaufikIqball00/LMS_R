// app/api/attendance/records/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Mock data sementara - ganti dengan database query
    const mockRecords = [
      {
        id: "1",
        studentId: "STD001",
        studentName: "John Doe",
        subject: "Matematika",
        teacher: "Dr. Ahmad Wijaya",
        date: "2025-09-10",
        checkInTime: "2025-09-10T07:00:00Z",
        status: "present",
        location: {
          latitude: -6.2,
          longitude: 106.8,
        },
        notes: "Hadir tepat waktu",
        semester: "Ganjil 2025",
      },
      {
        id: "2",
        studentId: "STD001",
        studentName: "John Doe",
        subject: "Fisika",
        teacher: "Prof. Siti Nurhaliza",
        date: "2025-09-09",
        checkInTime: "2025-09-09T09:00:00Z",
        status: "late",
        location: {
          latitude: -6.2,
          longitude: 106.8,
        },
        notes: "Terlambat 10 menit",
        semester: "Ganjil 2025",
      },
    ];

    return NextResponse.json(mockRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}
