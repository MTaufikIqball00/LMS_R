import StudentProfile from "./StudentProfile";
import StudentGradeComponent from "./StudentGrade";
import StudentAttendanceComponent from "./StudentAttendance";
import StudentActivities from "./StudentActivities";

import {
  Student,
  StudentGrade,
  StudentAttendance,
  StudentActivity,
} from "../../../lib/types/student";

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

interface StudentDetailProps {
  profile: StudentProfileData | null;
  grades: StudentGradesData | null;
  attendance: StudentAttendanceData | null;
  activities: StudentActivitiesData | null;
}

export default function StudentDetail({
  profile,
  grades,
  attendance,
  activities,
}: StudentDetailProps) {
  if (!profile) return null;

  return (
    <div className="space-y-8">
      <StudentProfile student={profile.student} />
      <StudentGradeComponent data={grades?.grades} />
      <StudentAttendanceComponent data={attendance?.attendance} />
      <StudentActivities data={activities?.activities} />
    </div>
  );
}
