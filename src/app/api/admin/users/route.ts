import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// GET all users
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_langganan") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        // Try to fetch from backend
        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (backendResponse.ok) {
            const users = await backendResponse.json();
            return NextResponse.json({
                success: true,
                users,
            });
        }

        // Fallback: return empty array if backend fails
        return NextResponse.json({
            success: true,
            users: [],
            message: "Backend unavailable, returning empty data",
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({
            success: true,
            users: [],
            message: "Backend unavailable",
        });
    }
}

// POST create new user
export async function POST(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_langganan") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userData = await request.json();

        // Proxy to backend
        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (backendResponse.ok) {
            const result = await backendResponse.json();
            return NextResponse.json({
                success: true,
                user: result,
            }, { status: 201 });
        }

        return NextResponse.json(
            { success: false, message: "Failed to create user" },
            { status: backendResponse.status }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
