"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Loader2,
  AlertTriangle,
  ChevronLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  TrendingUp,
  CheckCircle,
  BookOpen,
  Award,
  Activity,
} from "lucide-react";

import StudentDetail from "../../../../app/components/teacher/StudentDetail";

import {
  Student,
  StudentGrade,
  StudentAttendance,
  StudentActivity,
} from "../../../../lib/types/student";

// Tipe untuk data yang difetch
type StudentProfileData = {
  student: Student;
};
type StudentGradesData = {
  grades: StudentGrade[];
  statistics: any;
};
type StudentAttendanceData = {
  attendance: StudentAttendance[];
  statistics: any;
};
type StudentActivitiesData = {
  activities: StudentActivity[];
  statistics: any;
};

export default function StudentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [grades, setGrades] = useState<StudentGradesData | null>(null);
  const [attendance, setAttendance] = useState<StudentAttendanceData | null>(
    null
  );
  const [activities, setActivities] = useState<StudentActivitiesData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID siswa tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [profileRes, gradesRes, attendanceRes, activitiesRes] =
          await Promise.all([
            fetch(`/api/teacher/students/${id}`),
            fetch(`/api/teacher/students/${id}/grades`),
            fetch(`/api/teacher/students/${id}/attendance`),
            fetch(`/api/teacher/students/${id}/activities`),
          ]);

        if (!profileRes.ok) throw new Error("Gagal memuat profil siswa.");

        const profileData = await profileRes.json();
        const gradesData = await gradesRes.json();
        const attendanceData = await attendanceRes.json();
        const activitiesData = await activitiesRes.json();

        setProfile(profileData);
        setGrades(gradesData);
        setAttendance(attendanceData);
        setActivities(activitiesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-4 text-xl font-semibold text-slate-600">
          <Loader2 className="animate-spin h-8 w-8 text-cyan-600" />
          <span>Memuat data detail siswa...</span>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center p-16 bg-white rounded-2xl shadow-xl">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700">Terjadi Kesalahan</h2>
          <p className="text-red-600 mt-2">
            {error || "Data profil siswa tidak ditemukan"}
          </p>
          <Link
            href="/teacher/students"
            className="mt-6 inline-block bg-cyan-600 text-white px-6 py-2 rounded-lg"
          >
            Kembali ke Daftar Siswa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/teacher/students"
            className="flex items-center gap-2 text-slate-600 hover:text-cyan-700 font-semibold"
          >
            <ChevronLeft />
            Kembali ke Daftar Siswa
          </Link>
        </div>

        <StudentDetail
          profile={profile}
          grades={grades}
          attendance={attendance}
          activities={activities}
        />
      </div>
    </div>
  );
}
