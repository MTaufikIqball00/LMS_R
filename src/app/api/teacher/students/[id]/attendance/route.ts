import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch attendance from backend Rust
    // Backend endpoint: /api/attendance (all) - filter by student_id client-side
    // Or we create a new endpoint. For now, fetch all and filter.
    const backendResponse = await fetch(`${BACKEND_URL}/api/attendance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(
        { message: error.message || "Failed to fetch attendance" },
        { status: backendResponse.status }
      );
    }

    const allAttendance = await backendResponse.json();

    // Filter by student_id
    const attendance = allAttendance.filter((a: any) => String(a.student_id) === id);

    // Calculate statistics
    const total = attendance.length;
    const present = attendance.filter((a: any) => a.status === "present").length;
    const late = attendance.filter((a: any) => a.status === "late").length;
    const absent = attendance.filter((a: any) => a.status === "absent").length;

    const statistics = {
      rate: total > 0 ? (present / total) * 100 : 100,
      totalPresent: present,
      totalLate: late,
      totalAbsent: absent,
    };

    return NextResponse.json({
      success: true,
      attendance,
      statistics,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
