import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth/session";
import { submissions, assignments } from "../store";
import { z } from "zod";

const gradeSchema = z.object({
  submissionId: z.string(),
  grade: z.number().min(0).max(100),
  feedback: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = gradeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { submissionId, grade, feedback } = validation.data;

    const submission = submissions.get(submissionId);
    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    // Security check: Ensure the teacher is authorized to grade this submission
    const parentAssignment = assignments.get(submission.taskId);
    if (!parentAssignment || parentAssignment.teacherId !== session.userId) {
      return NextResponse.json(
        {
          error: "Forbidden: You are not authorized to grade this submission.",
        },
        { status: 403 }
      );
    }

    // Update the submission with the grade and feedback
    submission.grade = grade;
    submission.feedback = feedback || null;

    submissions.set(submissionId, submission);

    console.log(
      `✅ Submission ${submissionId} graded by ${session.name} (ID: ${session.userId})`
    );

    return NextResponse.json({ success: true, submission });
  } catch (err) {
    console.error("Error grading submission:", err);
    return NextResponse.json(
      { error: "Failed to grade submission" },
      { status: 500 }
    );
  }
}
