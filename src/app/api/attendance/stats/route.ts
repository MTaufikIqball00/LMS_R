// app/api/attendance/stats/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Mock stats data
    const mockStats = {
      totalDays: 20,
      presentDays: 18,
      absentDays: 2,
      lateCount: 3,
      attendanceRate: 90.0,
      currentStreak: 5,
      weeklyData: [
        { day: "Sen", status: "present" },
        { day: "Sel", status: "present" },
        { day: "Rab", status: "present" },
        { day: "Kam", status: "late" },
        { day: "Jum", status: "present" },
        { day: "Sab", status: "absent" },
        { day: "Min", status: "absent" },
      ],
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error("Error fetching attendance stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance stats" },
      { status: 500 }
    );
  }
}
