import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// GET all payments
export async function GET(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_langganan") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/payments`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (backendResponse.ok) {
            const payments = await backendResponse.json();
            return NextResponse.json({ success: true, payments });
        }

        return NextResponse.json({
            success: true,
            payments: [],
            message: "Backend unavailable",
        });
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json({
            success: true,
            payments: [],
            message: "Backend unavailable",
        });
    }
}

// PUT update payment status
export async function PUT(request: NextRequest) {
    const session = await getSession();

    if (!session || session.role !== "admin_langganan") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const paymentData = await request.json();

        const backendResponse = await fetch(`${BACKEND_URL}/api/admin/payments/${paymentData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(paymentData),
        });

        if (backendResponse.ok) {
            const result = await backendResponse.json();
            return NextResponse.json({ success: true, payment: result });
        }

        return NextResponse.json(
            { success: false, message: "Failed to update payment" },
            { status: backendResponse.status }
        );
    } catch (error) {
        console.error("Error updating payment:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
