export interface SubmissionMeta {
  id: string;
  taskId: string;
  filename: string;
  size: number;
  mimeType: string;
  submittedAt: string;
  graded?: {
    score: number;
    feedback?: string;
    gradedAt: string;
  } | null;
}
