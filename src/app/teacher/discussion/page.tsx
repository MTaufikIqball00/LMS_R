import { getSession } from "../../../lib/auth/session";
import { redirect } from "next/navigation";
import VideoManager from "../../../app/components/admin/VideoManager";
import { Suspense } from "react";

export default async function TeacherDiscussionPage() {
  const session = await getSession();

  if (!session || session.role !== "teacher") {
    redirect("/login");
  }

  // Pass the user info to the client component
  const user = {
    id: session.userId,
    name: session.name || "Guru",
    role: session.role,
  };

  return (
    <div>
      {/* The API key is public and can be passed to the client */}
      <Suspense fallback={<div>Memuat Video...</div>}>
        <VideoManager
          user={user}
          apiKey={process.env.NEXT_PUBLIC_STREAM_API_KEY!}
        />
      </Suspense>
    </div>
  );
}
