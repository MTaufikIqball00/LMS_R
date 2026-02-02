import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// GET all packages
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_langganan") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/packages`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (backendResponse.ok) {
            const packages = await backendResponse.json();
            return NextResponse.json({ success: true, packages });
        }

        return NextResponse.json({
            success: true,
            packages: [],
            message: "Backend unavailable",
        });
    } catch (error) {
        console.error("Error fetching packages:", error);
        return NextResponse.json({
            success: true,
            packages: [],
            message: "Backend unavailable",
        });
    }
}

// POST create new package
export async function POST(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_langganan") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const packageData = await request.json();

        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/packages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(packageData),
        });

        if (backendResponse.ok) {
            const result = await backendResponse.json();
            return NextResponse.json({ success: true, package: result }, { status: 201 });
        }

        return NextResponse.json(
            { success: false, message: "Failed to create package" },
            { status: backendResponse.status }
        );
    } catch (error) {
        console.error("Error creating package:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
