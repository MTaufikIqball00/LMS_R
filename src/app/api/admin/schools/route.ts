import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// GET all schools
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || !["admin_langganan", "admin_sekolah"].includes(session.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Try to fetch from backend
        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/schools`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (backendResponse.ok) {
            const schools = await backendResponse.json();
            return NextResponse.json({
                success: true,
                schools,
            });
        }

        // Fallback: return empty array if backend fails
        return NextResponse.json({
            success: true,
            schools: [],
            message: "Backend unavailable, returning empty data",
        });
    } catch (error) {
        console.error("Error fetching schools:", error);
        return NextResponse.json({
            success: true,
            schools: [],
            message: "Backend unavailable",
        });
    }
}

// POST create new school
export async function POST(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_langganan") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const schoolData = await request.json();

        // Proxy to backend
        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/schools`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(schoolData),
        });

        if (backendResponse.ok) {
            const result = await backendResponse.json();
            return NextResponse.json({
                success: true,
                school: result,
            }, { status: 201 });
        }

        return NextResponse.json(
            { success: false, message: "Failed to create school" },
            { status: backendResponse.status }
        );
    } catch (error) {
        console.error("Error creating school:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
