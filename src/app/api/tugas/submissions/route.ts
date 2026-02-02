import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import { submissions, assignments } from "../store";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "teacher") {
      return NextResponse.json(
        { error: "Forbidden: Only teachers can view submissions." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId query parameter is required" },
        { status: 400 }
      );
    }

    // Security check: Ensure the teacher requesting is the one who created the assignment
    const assignment = assignments.get(taskId);
    if (!assignment || assignment.teacherId !== session.userId) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You are not authorized to view submissions for this assignment.",
        },
        { status: 403 }
      );
    }

    const allSubmissions = Array.from(submissions.values());
    const relevantSubmissions = allSubmissions.filter(
      (sub) => sub.taskId === taskId
    );

    return NextResponse.json(relevantSubmissions);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
