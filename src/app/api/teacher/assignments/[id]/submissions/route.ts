import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";
import { assignments, submissions } from "../../../../tugas/store";

// ✅ FIXED: Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{
    id: string; // This is the assignmentId (tugasId)
  }>;
}

// GET all submissions for a specific assignment
// ✅ FIXED: Updated parameter structure and added await for params
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  // ✅ FIXED: Await the params Promise
  const { id: assignmentId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // First, verify the assignment exists and the teacher owns it.
  const assignment = assignments.get(assignmentId);
  if (!assignment || assignment.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Assignment not found or access denied" },
      { status: 404 }
    );
  }

  // Filter submissions for the given assignmentId
  const assignmentSubmissions = Array.from(submissions.values()).filter(
    (submission) => submission.taskId === assignmentId
  );

  return NextResponse.json(assignmentSubmissions);
}

// ✅ ADDED: If you need other HTTP methods, add them with the same pattern
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: assignmentId } = await context.params;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const assignment = assignments.get(assignmentId);
  if (!assignment) {
    return NextResponse.json(
      { success: false, message: "Assignment not found" },
      { status: 404 }
    );
  }

  const body = await request.json();

  // Create new submission logic here
  const newSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    taskId: assignmentId,
    studentId: session.userId,
    studentName: session.name || "Student",
    submittedAt: new Date().toISOString(),
    status: "submitted",
    ...body,
  };

  submissions.set(newSubmission.id, newSubmission);

  return NextResponse.json({
    success: true,
    message: "Submission created successfully",
    submission: newSubmission,
  });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: assignmentId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { submissionId, grade, feedback, status } = body;

  const submission = submissions.get(submissionId);
  if (!submission || submission.taskId !== assignmentId) {
    return NextResponse.json(
      { success: false, message: "Submission not found" },
      { status: 404 }
    );
  }

  // Update submission
  const updatedSubmission = {
    ...submission,
    grade,
    feedback,
    status: status || "graded",
    gradedAt: new Date().toISOString(),
  };

  submissions.set(submissionId, updatedSubmission);

  return NextResponse.json({
    success: true,
    message: "Submission updated successfully",
    submission: updatedSubmission,
  });
}
