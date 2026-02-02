// utils/forum.ts

export type Thread = {
  id: string;
  subject?: string;
  classId?: string;
  name: string;
  author: string;
  createdAt: string;
  zoomLink?: string;
};

export type Message = {
  id: string;
  threadId: string;
  author: string;
  content: string;
  createdAt: string;
};

export const formatForumDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export function filterThreadsBySubject(threads: Thread[], subject?: string) {
  return subject ? threads.filter((t) => t.subject === subject) : threads;
}

export function filterThreadsByClass(threads: Thread[], classId?: string) {
  return classId ? threads.filter((t) => t.classId === classId) : threads;
}

export function sortThreadsNewest(threads: Thread[]) {
  return threads
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
