import { getSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";
import AttendanceVerifier from "../../../app/components/admin/AttendanceVerifier";

export default async function TeacherAttendancePage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  return (
    <div>
      <AttendanceVerifier />
    </div>
  );
}
