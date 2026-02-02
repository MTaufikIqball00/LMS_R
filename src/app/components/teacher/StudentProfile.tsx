import Image from "next/image";
import { FiMail, FiPhone } from "react-icons/fi";
import { Student } from "../../../lib/types/student";

interface StudentProfileProps {
  student: Student;
}

export default function StudentProfile({ student }: StudentProfileProps) {
  return (
    <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-8 shadow-xl">
      <div className="flex items-center gap-6">
        {student.avatar ? (
          <Image
            src={student.avatar}
            alt={student.name}
            width={128}
            height={128}
            className="rounded-full border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-gray-500">
            No Avatar
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold text-slate-800">{student.name}</h1>
          <p className="text-lg text-slate-600">{student.major}</p>
          <div className="flex gap-4 mt-4 text-slate-500">
            <span className="flex items-center gap-2">
              <FiMail /> {student.email}
            </span>
            <span className="flex items-center gap-2">
              <FiPhone /> {student.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
