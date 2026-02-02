import { getSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";
import ModuleManager from "../../../app/components/admin/ModuleManager";

export default async function TeacherModulesPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  return (
    <div>
      <ModuleManager />
    </div>
  );
}
