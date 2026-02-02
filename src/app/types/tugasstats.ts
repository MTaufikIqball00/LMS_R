export interface TugasStatsProps {
  stats: {
    total: number;
    pending: number;
    submitted: number;
    graded: number;
    overdue: number;
  };
}
