// app/forum/video/[id]/page.tsx - FIXED VERSION
import { getSession } from "../../../../lib/auth/session";
import { redirect } from "next/navigation";
import VideoJoiner from "../../../../app/components/forum/VideoJoiner";
import { Suspense } from "react";

// ✅ PERBAIKAN: Update interface untuk Next.js 15
interface PageProps {
  params: Promise<{ id: string }>; // ✅ params sekarang Promise
}

export default async function StudentVideoPage({ params }: PageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // ✅ PERBAIKAN: Await params sebelum mengakses propertinya
  const { id } = await params;

  const user = {
    id: session.userId,
    name: session.name || "Murid",
    role: session.role || "student",
  };

  const callId = id; // ✅ Gunakan id yang sudah di-await

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Ruang Diskusi Video
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Bergabung ke dalam sesi diskusi langsung.
      </p>

      <Suspense fallback={<div>Memuat Video...</div>}>
        <VideoJoiner
          user={user}
          apiKey={process.env.NEXT_PUBLIC_STREAM_API_KEY!}
          callId={callId}
        />
      </Suspense>
    </div>
  );
}
