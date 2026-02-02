// components/forum/DiscussionRoomHeader.tsx
import StreamVideoButton from "./StreamVideoButton";
import type { DiscussionRoom } from "../../types/discussion";

export default function DiscussionRoomHeader({
  room,
}: {
  room: DiscussionRoom;
}) {
  return (
    <div className="flex items-center justify-between bg-blue-600 text-white rounded-lg p-4 mb-4">
      <div>
        <h1 className="font-bold text-xl">{room.name}</h1>
        <div className="text-xs">
          {room.subject ? (
            <>
              Mapel: <b>{room.subject}</b>{" "}
            </>
          ) : (
            "General Forum"
          )}
          {room.classId && (
            <>
              {" "}
              | Kelas: <b>{room.classId}</b>
            </>
          )}
        </div>
      </div>

      {/* ✅ BENAR - Gunakan props yang sesuai */}
      {room.callId && (
        <StreamVideoButton
          callId={room.callId}
          roomName={room.name}
          userId="default_user"
          userName="User"
        />
      )}
    </div>
  );
}
