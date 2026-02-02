import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import { analyzeStudentRisk } from "../../../../lib/utils/risk-analysis";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch students from backend Rust
    const backendResponse = await fetch(`${BACKEND_URL}/api/teacher/students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(
        { message: error.message || "Failed to fetch students" },
        { status: backendResponse.status }
      );
    }

    const studentsArray = await backendResponse.json();

    // Perform Risk Analysis on the fetched data
    const { students: enrichedStudents, stats } = analyzeStudentRisk(studentsArray);

    return NextResponse.json({
      success: true,
      total: enrichedStudents.length,
      students: enrichedStudents,
      stats: stats,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
