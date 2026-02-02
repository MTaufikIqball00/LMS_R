import { StudentActivity } from "../../../lib/types/student";
import {
  FiAward,
  FiCheckSquare,
  FiMessageSquare,
  FiActivity,
} from "react-icons/fi";

interface StudentActivitiesProps {
  data: StudentActivity[] | undefined; // Ubah dari object ke array
}

const activityIcons: {
  [key: string]: React.ComponentType<{ className?: string }>;
} = {
  assignment_submit: FiCheckSquare,
  quiz_complete: FiAward,
  forum_post: FiMessageSquare,
};

const getActivityIcon = (type: string) => {
  const IconComponent = activityIcons[type] || FiActivity;
  const colorClass =
    type === "assignment_submit"
      ? "text-blue-500"
      : type === "quiz_complete"
      ? "text-purple-500"
      : type === "forum_post"
      ? "text-green-500"
      : "text-gray-500";

  return <IconComponent className={colorClass} />;
};

export default function StudentActivities({ data }: StudentActivitiesProps) {
  return (
    <div className="backdrop-blur-xl bg-white/50 border border-white/30 rounded-2xl p-8 shadow-xl">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Aktivitas Terakhir
      </h2>
      {data && data.length > 0 ? ( // Langsung cek data.length
        <ul className="space-y-4">
          {data.map(
            (
              act // Langsung map data
            ) => (
              <li key={act.id} className="flex items-start gap-4">
                <div className="mt-1">{getActivityIcon(act.type)}</div>
                <div>
                  <p className="font-semibold">{act.title}</p>
                  <p className="text-sm text-slate-500">{act.description}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(act.timestamp).toLocaleString("id-ID")}
                  </p>
                </div>
              </li>
            )
          )}
        </ul>
      ) : (
        <p>Tidak ada aktivitas terbaru.</p>
      )}
    </div>
  );
}
