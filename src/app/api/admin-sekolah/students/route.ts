import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// GET all students for admin sekolah
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_sekolah") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const backendResponse = await fetch(`${BACKEND_URL}/api/teacher/students`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (backendResponse.ok) {
            const students = await backendResponse.json();
            return NextResponse.json({ success: true, students });
        }

        return NextResponse.json({
            success: true,
            students: [],
            message: "Backend unavailable",
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json({
            success: true,
            students: [],
            message: "Backend unavailable",
        });
    }
}

// POST create new student
export async function POST(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_sekolah") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const studentData = await request.json();

        const backendResponse = await fetch(`${BACKEND_URL}/api/admin-sekolah/students`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentData),
        });

        if (backendResponse.ok) {
            const result = await backendResponse.json();
            return NextResponse.json({ success: true, student: result }, { status: 201 });
        }

        return NextResponse.json(
            { success: false, message: "Failed to create student" },
            { status: backendResponse.status }
        );
    } catch (error) {
        console.error("Error creating student:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
