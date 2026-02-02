import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// GET all teachers for kepala sekolah
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "kepala_sekolah") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Try to fetch from backend - assuming there's a teachers endpoint
        const backendResponse = await fetch(`${BACKEND_URL}/api/kepala/teachers`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (backendResponse.ok) {
            const teachers = await backendResponse.json();
            return NextResponse.json({
                success: true,
                teachers,
            });
        }

        // Fallback: return empty array if backend fails
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
