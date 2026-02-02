// types/discussion.ts
export type DiscussionRoom = {
  id: string;
  name: string;
  subject?: string;
  classId?: string;
  callId: string;
};

export type Message = {
  id: string | number;
  author: string;
  time: string;
  content: string;
  avatar?: string;
};

export type Thread = {
  id: string;
  subject?: string;
  classId?: string;
  name: string;
  author: string;
  createdAt: string;
  callId?: string;
};

export type DiscussionMessage = {
  id: string;
  text: string;
  timestamp: string;
  user: DiscussionUser;
};

export type DiscussionUser = {
  id: string;
  name: string;
  avatar: string;
  role: "student" | "teacher";
};
