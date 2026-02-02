import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const session = await getSession();
  const { id } = await params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Note: Backend doesn't have activities endpoint yet
    // For now, return an empty array with a message
    // TODO: Add activities endpoint to backend

    const activities: any[] = [];

    const statistics = {
      totalActivities: activities.length,
      lastActivity: null,
    };

    return NextResponse.json({
      success: true,
      activities,
      statistics,
      message: "Activities endpoint pending backend implementation",
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
