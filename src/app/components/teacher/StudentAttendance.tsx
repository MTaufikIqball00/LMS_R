import { StudentAttendance } from "../../../lib/types/student";
import { Clock, MapPin, Info } from 'lucide-react';

interface StudentAttendanceProps {
  data: StudentAttendance[] | undefined; // Ubah dari object ke array
}

const statusStyles: { [key: string]: string } = {
  present: "bg-green-100 text-green-800",
  late: "bg-yellow-100 text-yellow-800",
  absent: "bg-red-100 text-red-800",
};

export default function StudentAttendanceComponent({
  data,
}: StudentAttendanceProps) {
  return (
    <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Kehadiran</h2>
      {data && data.length > 0 ? ( // Langsung cek data.length
        <ul className="space-y-4">
          {data.map(
            (
              att // Langsung map data
            ) => (
              <li key={att.id} className="border-b pb-4 last:border-none">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold text-lg text-slate-700">{att.subject}</p>
                    <p className="text-sm text-slate-500">
                      {new Date(att.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mt-2">
                      {att.checkInTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-cyan-600" />
                          {att.checkInTime}
                        </span>
                      )}
                      {att.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-cyan-600" />
                          {att.location}
                        </span>
                      )}
                    </div>
                    {att.notes && (
                       <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                         <Info className="h-4 w-4 text-cyan-600" />
                         {att.notes}
                       </p>
                    )}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[att.status] || "bg-gray-100 text-gray-800"}`}>
                    {att.status}
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      ) : (
        <p>Tidak ada data kehadiran untuk ditampilkan.</p>
      )}
    </div>
  );
}
