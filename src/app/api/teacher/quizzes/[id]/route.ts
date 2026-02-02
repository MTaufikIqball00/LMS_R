import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth/session";
import { quizzes } from "../store";

// ✅ FIXED: Updated interface for Next.js 15
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// GET a specific quiz by its ID
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

  const quiz = quizzes.get(quizId);

  if (!quiz) {
    return NextResponse.json(
      { success: false, message: "Quiz not found" },
      { status: 404 }
    );
  }

  // Security check: Ensure the teacher owns the quiz
  if (quiz.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json(quiz);
}

// ✅ ADDED: If you need other HTTP methods, add them with the same pattern
export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: quizId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const quiz = quizzes.get(quizId);

  if (!quiz) {
    return NextResponse.json(
      { success: false, message: "Quiz not found" },
      { status: 404 }
    );
  }

  // Security check: Ensure the teacher owns the quiz
  if (quiz.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await request.json();

  // Update the quiz with new data
  const updatedQuiz = {
    ...quiz,
    ...body,
    id: quizId, // Ensure ID doesn't change
    teacherId: session.userId, // Ensure teacherId doesn't change
    updatedAt: new Date().toISOString(),
  };

  quizzes.set(quizId, updatedQuiz);

  return NextResponse.json({
    success: true,
    message: "Quiz updated successfully",
    quiz: updatedQuiz,
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

  const quiz = quizzes.get(quizId);

  if (!quiz) {
    return NextResponse.json(
      { success: false, message: "Quiz not found" },
      { status: 404 }
    );
  }

  // Security check: Ensure the teacher owns the quiz
  if (quiz.teacherId !== session.userId) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  const deleted = quizzes.delete(quizId);

  if (deleted) {
    return NextResponse.json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } else {
    return NextResponse.json(
      { success: false, message: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  const { id: quizId } = await context.params;

  if (!session || session.role !== "teacher") {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // Check if quiz with this ID already exists
  if (quizzes.has(quizId)) {
    return NextResponse.json(
      { success: false, message: "Quiz with this ID already exists" },
      { status: 409 }
    );
  }

  const body = await request.json();

  // Create new quiz with the specified ID
  const newQuiz = {
    id: quizId,
    teacherId: session.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...body,
  };

  quizzes.set(quizId, newQuiz);

  return NextResponse.json(
    {
      success: true,
      message: "Quiz created successfully",
      quiz: newQuiz,
    },
    { status: 201 }
  );
}
