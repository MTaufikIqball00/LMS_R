import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// GET all subscriptions
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_langganan") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/subscriptions`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (backendResponse.ok) {
            const subscriptions = await backendResponse.json();
            return NextResponse.json({ success: true, subscriptions });
        }

        return NextResponse.json({
            success: true,
            subscriptions: [],
            message: "Backend unavailable",
        });
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return NextResponse.json({
            success: true,
            subscriptions: [],
            message: "Backend unavailable",
        });
    }
}

// PUT update subscription
export async function PUT(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_langganan") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const subscriptionData = await request.json();

        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/subscriptions/${subscriptionData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(subscriptionData),
        });

        if (backendResponse.ok) {
            const result = await backendResponse.json();
            return NextResponse.json({ success: true, subscription: result });
        }

        return NextResponse.json(
            { success: false, message: "Failed to update subscription" },
            { status: backendResponse.status }
        );
    } catch (error) {
        console.error("Error updating subscription:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
