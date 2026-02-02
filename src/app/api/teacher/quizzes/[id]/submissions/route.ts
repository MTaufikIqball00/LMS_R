import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../lib/auth/session";
import { quizzes, quizSubmissions } from "../../store";

// ✅ FIXED: Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{
    id: string; // This is the quizId
  }>;
}

// GET all submissions for a specific quiz
// ✅ FIXED: Updated parameter structure and added await for params
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  // ✅ FIXED: Await the params Promise
  const { id: quizId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // First, verify the quiz exists and the teacher owns it.
  const quiz = quizzes.get(quizId);
  if (!quiz || quiz.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Quiz not found or access denied" },
      { status: 404 }
    );
  }

  // Filter submissions for the given quizId
  const submissions = Array.from(quizSubmissions.values()).filter(
    (submission) => submission.quizId === quizId
  );

  return NextResponse.json(submissions);
}

// ✅ ADDED: If you need other HTTP methods, add them with the same pattern
export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: quizId } = await context.params;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Verify the quiz exists
  const quiz = quizzes.get(quizId);
  if (!quiz) {
    return NextResponse.json(
      { success: false, message: "Quiz not found" },
      { status: 404 }
    );
  }

  const body = await request.json();

  // Create new quiz submission
  const newSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    quizId,
    studentId: session.userId,
    studentName: session.name || "Student",
    submittedAt: new Date().toISOString(),
    status: "submitted",
    ...body,
  };

  quizSubmissions.set(newSubmission.id, newSubmission);

  return NextResponse.json(
    {
      success: true,
      message: "Quiz submission created successfully",
      submission: newSubmission,
    },
    { status: 201 }
  );
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: quizId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Verify the quiz exists and teacher owns it
  const quiz = quizzes.get(quizId);
  if (!quiz || quiz.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Quiz not found or access denied" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { submissionId, grade, feedback, status } = body;

  const submission = quizSubmissions.get(submissionId);
  if (!submission || submission.quizId !== quizId) {
    return NextResponse.json(
      { success: false, message: "Submission not found" },
      { status: 404 }
    );
  }

  // Update submission with grading information
  const updatedSubmission = {
    ...submission,
    grade,
    feedback,
    status: status || "graded",
    gradedAt: new Date().toISOString(),
    gradedBy: session.userId,
  };

  quizSubmissions.set(submissionId, updatedSubmission);

  return NextResponse.json({
    success: true,
    message: "Quiz submission updated successfully",
    submission: updatedSubmission,
  });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: quizId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Verify the quiz exists and teacher owns it
  const quiz = quizzes.get(quizId);
  if (!quiz || quiz.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Quiz not found or access denied" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const { submissionId } = body;

  const submission = quizSubmissions.get(submissionId);
  if (!submission || submission.quizId !== quizId) {
    return NextResponse.json(
      { success: false, message: "Submission not found" },
      { status: 404 }
    );
  }

  const deleted = quizSubmissions.delete(submissionId);

  if (deleted) {
    return NextResponse.json({
      success: true,
      message: "Quiz submission deleted successfully",
    });
  } else {
    return NextResponse.json(
      { success: false, message: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
