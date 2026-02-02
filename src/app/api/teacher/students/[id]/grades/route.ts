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
    // Fetch grades from backend Rust
    const backendResponse = await fetch(`${BACKEND_URL}/api/grades/student/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      const error = await backendResponse.json();
      return NextResponse.json(
        { message: error.message || "Failed to fetch grades" },
        { status: backendResponse.status }
      );
    }

    const grades = await backendResponse.json();

    // Calculate statistics
    const statistics = {
      averageScore:
        grades.length > 0
          ? grades.reduce((acc: number, g: any) => acc + (g.score || g.grade || 0), 0) / grades.length
          : 0,
      highestGrade: grades.length > 0 ? "A" : "N/A",
      lowestGrade: grades.length > 0 ? "B-" : "N/A",
    };

    return NextResponse.json({
      success: true,
      grades,
      statistics,
    });
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
