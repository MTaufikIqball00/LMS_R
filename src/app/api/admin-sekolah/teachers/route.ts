import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// GET all teachers for admin sekolah
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_sekolah") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const backendResponse = await fetch(`${BACKEND_URL}/api/kepala/teachers`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (backendResponse.ok) {
            const teachers = await backendResponse.json();
            return NextResponse.json({ success: true, teachers });
        }

        return NextResponse.json({
            success: true,
            teachers: [],
            message: "Backend unavailable",
        });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        return NextResponse.json({
            success: true,
            teachers: [],
            message: "Backend unavailable",
        });
    }
}

// POST create new teacher
export async function POST(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_sekolah") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const teacherData = await request.json();

        const backendResponse = await fetch(`${BACKEND_URL}/api/admin-sekolah/teachers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(teacherData),
        });

        if (backendResponse.ok) {
            const result = await backendResponse.json();
            return NextResponse.json({ success: true, teacher: result }, { status: 201 });
        }

        return NextResponse.json(
            { success: false, message: "Failed to create teacher" },
            { status: backendResponse.status }
        );
    } catch (error) {
        console.error("Error creating teacher:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
