import { getSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";
import QuizList from "../../../app/components/admin/QuizList";

export default async function TeacherQuizzesPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  return (
    <div>
      <QuizList />
    </div>
  );
}
