import { getSession } from "../../../../lib/auth/session";
import { redirect } from "next/navigation";
import QuizBuilder from "../../../../app/components/admin/QuizBuilder";

export default async function NewQuizPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  return (
    <div>
      <QuizBuilder />
    </div>
  );
}
