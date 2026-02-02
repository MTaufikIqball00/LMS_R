import { getSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";
import TeacherDashboard from "../../components/admin/TeacherDashboard";
import { analyzeStudentRisk } from "../../../lib/utils/risk-analysis";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchStudents() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/teacher/students`, {
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Failed to fetch students from backend");
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

async function fetchDashboardStats() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/teacher/dashboard`, {
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Failed to fetch dashboard stats from backend");
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

export default async function TeacherDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  // Fetch data from backend
  const [studentsArray, backendStats] = await Promise.all([
    fetchStudents(),
    fetchDashboardStats(),
  ]);

  // Calculate dynamic risk stats using K-Means
  const { students } = analyzeStudentRisk(studentsArray);
  const atRiskCount = students.filter(
    (s) => s.riskStatus === "Berisiko Tinggi" || s.riskStatus === "Berisiko Sedang"
  ).length;

  const dashboardStats = {
    activeAssignments: 12,
    assignmentCompletion: "85%",
    totalModules: 24,
    modulesViewed: 156,
    verifiedAttendance: backendStats?.average_attendance?.toFixed(0) || 89,
    pendingAttendance: 5,
    totalQuizzes: 18,
    avgQuizScore: "78%",
    studentsAtRisk: backendStats?.at_risk_students || atRiskCount,
    totalStudents: backendStats?.total_students || students.length,
  };

  return <TeacherDashboard session={session} stats={dashboardStats} />;
}