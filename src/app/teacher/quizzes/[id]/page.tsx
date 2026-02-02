import { getSession, getJwtToken } from "../../../../lib/auth/session";
import { redirect } from "next/navigation";
import {
  Quiz,
  QuizSubmission,
} from "../../../../app/api/teacher/quizzes/store";
import GradeForm from "../../../../app/components/admin/GradeForm";

async function getQuizDetails(
  quizId: string,
  token: string | undefined
): Promise<Quiz | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teacher/quizzes/${quizId}`,
    {
      headers: { Cookie: `auth_token=${token}` },
    }
  );
  if (!res.ok) return null;
  return res.json();
}

async function getQuizSubmissions(
  quizId: string,
  token: string | undefined
): Promise<QuizSubmission[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/teacher/quizzes/${quizId}/submissions`,
    {
      headers: { Cookie: `auth_token=${token}` },
    }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function QuizDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  const token = await getJwtToken();
  const [quiz, submissions] = await Promise.all([
    getQuizDetails(id, token),
    getQuizSubmissions(id, token),
  ]);

  if (!quiz) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Kuis Tidak Ditemukan</h1>
        <p>Kuis yang Anda cari tidak ada atau Anda tidak memiliki akses.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {quiz.title}
      </h1>
      <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
        {quiz.subject}
      </p>
      <p className="mt-2 text-gray-500">{quiz.description}</p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Hasil Pengumpulan</h2>
        {submissions.length === 0 ? (
          <p className="mt-4">Belum ada murid yang mengumpulkan kuis ini.</p>
        ) : (
          <div className="mt-4 space-y-6">
            {submissions.map((submission) => (
              <div
                key={submission.submissionId}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">
                    {submission.studentName}
                  </h3>
                  <span className="text-sm text-gray-500">
                    Dikumpulkan:{" "}
                    {new Date(submission.submittedAt).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="mt-4 border-t pt-4">
                  {quiz.questions.map((question) => {
                    const answer = submission.answers.find(
                      (a) => a.questionId === question.id
                    );
                    return (
                      <div key={question.id} className="mb-4">
                        <p className="font-semibold">{question.questionText}</p>
                        {question.questionType === "multiple_choice" ? (
                          <p
                            className={`mt-1 ${
                              answer?.selectedChoiceId ===
                              question.correctAnswer
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            Jawaban:{" "}
                            {question.choices?.find(
                              (c) => c.id === answer?.selectedChoiceId
                            )?.text || "Tidak dijawab"}
                          </p>
                        ) : (
                          <p className="mt-1 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                            {answer?.answerText || "Tidak dijawab"}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold">Penilaian</h4>
                  {submission.grade !== null ? (
                    <p>
                      Nilai:{" "}
                      <span className="font-bold text-xl">
                        {submission.grade}
                      </span>
                    </p>
                  ) : (
                    <GradeForm submissionId={submission.submissionId} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
