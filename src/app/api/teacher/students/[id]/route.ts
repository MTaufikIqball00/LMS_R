import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth/session";

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
    // Fetch student from backend Rust
    const backendResponse = await fetch(`${BACKEND_URL}/api/teacher/students/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json({ message: "Student not found" }, { status: 404 });
      }
      const error = await backendResponse.json();
      return NextResponse.json(
        { message: error.message || "Failed to fetch student" },
        { status: backendResponse.status }
      );
    }

    const student = await backendResponse.json();

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const updateData = await request.json();

    // Proxy PUT request to backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/teacher/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json({ message: "Student not found" }, { status: 404 });
      }
      const error = await backendResponse.json();
      return NextResponse.json(
        { message: error.message || "Failed to update student" },
        { status: backendResponse.status }
      );
    }

    const updatedStudent = await backendResponse.json();

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }
}
