import { JadwalDay as JadwalDayType } from "../../constants/jadwal";
import JadwalCard from "./JadwalCard";

interface JadwalDayProps {
  day: JadwalDayType;
  isToday?: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const isToday = (dateString: string) => {
  const today = new Date();
  const date = new Date(dateString);
  return today.toDateString() === date.toDateString();
};

export default function JadwalDay({ day, isToday: isTodayProp = false }: JadwalDayProps) {
  const isCurrentDay = isToday(day.date) || isTodayProp;
  const hasSchedules = day.schedules.length > 0;

  return (
    <div className={`bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 ${
      isCurrentDay ? "ring-2 ring-cyan-400/50 shadow-cyan-500/20" : ""
    }`}>
      {/* Day Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isCurrentDay 
              ? "bg-gradient-to-br from-cyan-400 to-blue-400 animate-pulse" 
              : "bg-gradient-to-br from-blue-400 to-indigo-400"
          }`}>
            <span className="text-white font-bold text-lg">
              {day.dayName.charAt(0)}
            </span>
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${
              isCurrentDay ? "text-cyan-300" : "text-white"
            }`}>
              {day.dayName}
            </h2>
            <p className="text-blue-200/70 text-sm">
              {formatDate(day.date)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-blue-200/70 text-sm">Total Jadwal</div>
          <div className="text-white font-bold text-2xl">
            {day.schedules.length}
          </div>
        </div>
      </div>

      {/* Schedules */}
      {hasSchedules ? (
        <div className="space-y-4">
          {day.schedules.map((schedule) => (
            <JadwalCard 
              key={schedule.id} 
              jadwal={schedule} 
              isToday={isCurrentDay}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">📅</div>
          <h3 className="text-white text-xl font-bold mb-2">
            Tidak Ada Jadwal
          </h3>
          <p className="text-blue-200/70">
            Tidak ada jadwal pelajaran untuk hari ini
          </p>
        </div>
      )}
    </div>
  );
}
