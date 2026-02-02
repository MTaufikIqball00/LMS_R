import { getSession, getJwtToken } from "../../../../lib/auth/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Assignment, Submission } from "../../../../app/api/tugas/store";
import AssignmentGradeForm from "../../../../app/components/admin/AssignmentGradeForm";
import {
  FiArrowLeft,
  FiFileText,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiTrendingUp,
  FiClock,
  FiAlertCircle,
  FiBookOpen,
} from "react-icons/fi";

async function getAssignmentDetails(
  assignmentId: string,
  token: string | undefined
): Promise<Assignment | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/teacher/assignments/${assignmentId}`,
    {
      headers: { Cookie: `auth_token=${token}` },
      cache: "no-store",
    }
  );
  if (!res.ok) return null;
  return res.json();
}

async function getAssignmentSubmissions(
  assignmentId: string,
  token: string | undefined
): Promise<Submission[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/teacher/assignments/${assignmentId}/submissions`,
    {
      headers: { Cookie: `auth_token=${token}` },
      cache: "no-store",
    }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function AssignmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  const token = await getJwtToken();
  const [assignment, submissions] = await Promise.all([
    getAssignmentDetails(params.id, token),
    getAssignmentSubmissions(params.id, token),
  ]);

  if (!assignment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center p-16 bg-white rounded-2xl shadow-xl">
          <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700">Tugas Tidak Ditemukan</h2>
          <p className="text-red-600 mt-2">
            Tugas yang Anda cari tidak ada atau Anda tidak memiliki akses.
          </p>
          <Link
            href="/teacher/assignment"
            className="mt-6 inline-block bg-cyan-600 text-white px-6 py-2 rounded-lg"
          >
            Kembali ke Manajemen Tugas
          </Link>
        </div>
      </div>
    );
  }

  const completionRate = Math.round(
    (submissions.length / (assignment.totalStudents || 30)) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/teacher/assignment"
            className="flex items-center gap-2 text-slate-600 hover:text-orange-700 font-semibold mb-6"
          >
            <FiArrowLeft />
            Kembali ke Manajemen Tugas
          </Link>

          <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              {assignment.title}
            </h1>
            <div className="flex items-center gap-4 text-slate-600">
              <span className="flex items-center gap-2">
                <FiBookOpen className="h-5 w-5" /> {assignment.subject}
              </span>
              <span className="font-bold">·</span>
              <span className="flex items-center gap-2">
                <FiUsers className="h-5 w-5" /> {assignment.className}
              </span>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-gradient-to-r from-red-50/80 to-orange-50/80 rounded-xl border border-red-200/50">
                    <FiCalendar className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-red-600 font-medium">Deadline</p>
                    <p className="text-lg font-bold text-red-800">
                        {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tidak ada'}
                    </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl border border-emerald-200/50">
                    <FiCheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm text-emerald-600 font-medium">Pengumpulan</p>
                    <p className="text-lg font-bold text-emerald-800">
                        {submissions.length} / {assignment.totalStudents || 30}
                    </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 rounded-xl border border-blue-200/50">
                    <FiTrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-blue-600 font-medium">Completion</p>
                    <p className="text-lg font-bold text-blue-800">{completionRate}%</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/80 rounded-xl border border-purple-200/50">
                    <FiClock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-purple-600 font-medium">Dibuat</p>
                    <p className="text-lg font-bold text-purple-800">
                        {new Date(assignment.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                    </p>
                </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 p-8 backdrop-blur-xl bg-white/50 border border-white/30 rounded-3xl shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Deskripsi & Instruksi</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{assignment.description}</p>
        </div>

        {/* Submissions */}
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Pengumpulan Murid ({submissions.length})</h2>
          {submissions.length === 0 ? (
            <div className="text-center py-16 backdrop-blur-xl bg-white/50 border border-white/30 rounded-3xl shadow-2xl">
              <FiUsers className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">Belum ada murid yang mengumpulkan tugas ini.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <div key={submission.id} className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-3xl shadow-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">{submission.userName}</h3>
                    <span className="text-sm text-slate-500">
                      Dikumpulkan:{" "}
                      {new Date(submission.submittedAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                  
                  {submission.filename && (
                    <div className="mb-4">
                      <p className="font-semibold text-slate-700">File yang Dikumpulkan:</p>
                      <a href="#" className="text-orange-600 hover:underline flex items-center gap-2">
                        <FiFileText /> {submission.filename}
                      </a>
                    </div>
                  )}

                  <div className="border-t border-white/40 pt-4">
                    <h4 className="font-semibold text-slate-700 mb-2">Penilaian</h4>
                    {submission.grade !== null ? (
                      <div>
                        <p className="text-slate-600">
                          Nilai:{" "}
                          <span className="font-bold text-2xl text-emerald-600">
                            {submission.grade}
                          </span>
                        </p>
                        {submission.feedback && (
                          <p className="mt-2 text-sm italic bg-green-50 p-3 rounded-lg">
                            <b>Feedback:</b> "{submission.feedback}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <AssignmentGradeForm submissionId={submission.id} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
