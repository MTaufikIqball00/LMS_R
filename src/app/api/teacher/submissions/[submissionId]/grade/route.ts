import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";
import { assignments, submissions } from "../../../../tugas/store";

// ✅ FIXED: Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{
    submissionId: string;
  }>;
}

// ✅ FIXED: Updated parameter structure and added await for params
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  // ✅ FIXED: Await the params Promise
  const { submissionId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { grade, feedback } = await request.json();
    if (typeof grade !== "number") {
      return NextResponse.json(
        { success: false, message: "Grade must be a number." },
        { status: 400 }
      );
    }

    const submission = submissions.get(submissionId);
    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found." },
        { status: 404 }
      );
    }

    // Critical Security Check: Ensure the teacher owns the assignment this submission belongs to.
    const assignment = assignments.get(submission.taskId);
    if (!assignment || assignment.teacherId !== session.userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden: You do not own the assignment this submission belongs to.",
        },
        { status: 403 }
      );
    }

    // Update grade and feedback
    submission.grade = grade;
    submission.feedback = feedback || null; // Allow optional feedback
    submissions.set(submissionId, submission);

    return NextResponse.json({
      success: true,
      message: "Assignment graded successfully.",
      submission,
    });
  } catch (error) {
    console.error("Error grading submission:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
