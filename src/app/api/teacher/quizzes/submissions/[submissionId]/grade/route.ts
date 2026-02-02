import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../../../lib/auth/session";
import { quizzes, quizSubmissions } from "../../../store";

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
    const { grade } = await request.json();
    if (typeof grade !== "number") {
      return NextResponse.json(
        { success: false, message: "Grade must be a number" },
        { status: 400 }
      );
    }

    const submission = quizSubmissions.get(submissionId);
    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    // Security check: Ensure the teacher owns the quiz associated with this submission
    const quiz = quizzes.get(submission.quizId);
    if (!quiz || quiz.teacherId !== session.userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden: You do not own the quiz this submission belongs to.",
        },
        { status: 403 }
      );
    }

    // Update the grade
    submission.grade = grade;
    quizSubmissions.set(submissionId, submission);

    return NextResponse.json({
      success: true,
      message: "Submission graded successfully",
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

// ✅ ADDED: If you need other HTTP methods, add them with the same pattern
export async function GET(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { submissionId } = await context.params;

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const submission = quizSubmissions.get(submissionId);
  if (!submission) {
    return NextResponse.json(
      { success: false, message: "Submission not found" },
      { status: 404 }
    );
  }

  // Security check based on role
  if (session.role === "teacher") {
    const quiz = quizzes.get(submission.quizId);
    if (!quiz || quiz.teacherId !== session.userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }
  } else if (session.role === "student") {
    if (submission.studentId !== session.userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    submission,
  });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { submissionId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { grade, feedback, status } = body;

    const submission = quizSubmissions.get(submissionId);
    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    // Security check: Ensure the teacher owns the quiz associated with this submission
    const quiz = quizzes.get(submission.quizId);
    if (!quiz || quiz.teacherId !== session.userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden: You do not own the quiz this submission belongs to.",
        },
        { status: 403 }
      );
    }

    // Update the submission with new data
    const updatedSubmission = {
      ...submission,
      ...(grade !== undefined && { grade }),
      ...(feedback !== undefined && { feedback }),
      ...(status !== undefined && { status }),
      gradedAt: new Date().toISOString(),
      gradedBy: session.userId,
      updatedAt: new Date().toISOString(),
    };

    quizSubmissions.set(submissionId, updatedSubmission);

    return NextResponse.json({
      success: true,
      message: "Submission updated successfully",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { submissionId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const submission = quizSubmissions.get(submissionId);
    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 }
      );
    }

    // Security check: Ensure the teacher owns the quiz associated with this submission
    const quiz = quizzes.get(submission.quizId);
    if (!quiz || quiz.teacherId !== session.userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden: You do not own the quiz this submission belongs to.",
        },
        { status: 403 }
      );
    }

    const deleted = quizSubmissions.delete(submissionId);

    if (deleted) {
      return NextResponse.json({
        success: true,
        message: "Submission deleted successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to delete submission" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
