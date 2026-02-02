import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// GET all students for kepala sekolah
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "kepala_sekolah") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Try to fetch from backend
        const backendResponse = await fetch(`${BACKEND_URL}/api/teacher/students`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (backendResponse.ok) {
            const students = await backendResponse.json();

            // Calculate stats
            const stats = {
                total: students.length,
                active: students.filter((s: any) => s.status === "active").length,
                inactive: students.filter((s: any) => s.status === "inactive").length,
            };

            return NextResponse.json({
                success: true,
                students,
                stats,
            });
        }

        // Fallback: return empty array if backend fails
        return NextResponse.json({
            success: true,
            students: [],
            stats: { total: 0, active: 0, inactive: 0 },
            message: "Backend unavailable",
        });
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json({
            success: true,
            students: [],
            stats: { total: 0, active: 0, inactive: 0 },
            message: "Backend unavailable",
        });
    }
}
