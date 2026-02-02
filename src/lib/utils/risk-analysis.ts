import { kmeans } from "ml-kmeans";
import { Student } from "../types/student";

interface RiskStats {
  mean: number;
  min: number;
  max: number;
  count: number;
}

interface RiskAnalysisResult {
  students: Student[];
  stats: Record<string, { averageScore: RiskStats; attendance: RiskStats }>;
}

export function analyzeStudentRisk(students: Student[]): RiskAnalysisResult {
  if (students.length === 0) {
    return { students: [], stats: {} };
  }

  // Handle case with too few students for K-Means
  if (students.length < 3) {
    // Fallback to threshold-based if not enough data points
    const enriched = students.map((s) => {
      let riskStatus: "Aman" | "Berisiko Sedang" | "Berisiko Tinggi" = "Aman";
      // Simple heuristic
      if (s.gpa < 2.0 || s.attendanceRate < 80) riskStatus = "Berisiko Tinggi";
      else if (s.gpa < 3.0 || s.attendanceRate < 90)
        riskStatus = "Berisiko Sedang";

      // Calculate risk score (simple linear combination)
      // Normalize GPA (0-4) to 0-1, Attendance (0-100) to 0-1
      const normGPA = s.gpa / 4.0;
      const normAtt = s.attendanceRate / 100.0;
      // High risk score = Low GPA + Low Attendance (High Absence)
      // Risk = (1 - GPA) + (1 - Attendance)
      const riskScore = (1 - normGPA) + (1 - normAtt);

      return {
        ...s,
        riskStatus,
        riskScore,
      };
    });
    return { students: enriched, stats: {} }; // Stats not computed for small sample
  }

  // Prepare data for K-Means: [AbsenceRate, GPA]
  // AbsenceRate = 100 - attendanceRate
  // We should normalize/scale features first as K-Means is sensitive to scale
  const data = students.map((s) => [100 - s.attendanceRate, s.gpa]);

  // StandardScaler logic
  const mean = [0, 0];
  const std = [0, 0];
  const n = data.length;

  // Calculate Mean
  for (let i = 0; i < n; i++) {
    mean[0] += data[i][0];
    mean[1] += data[i][1];
  }
  mean[0] /= n;
  mean[1] /= n;

  // Calculate Std Dev
  for (let i = 0; i < n; i++) {
    std[0] += Math.pow(data[i][0] - mean[0], 2);
    std[1] += Math.pow(data[i][1] - mean[1], 2);
  }
  std[0] = Math.sqrt(std[0] / n) || 1; // Avoid division by zero
  std[1] = Math.sqrt(std[1] / n) || 1;

  // Scale data
  const scaledData = data.map((point) => [
    (point[0] - mean[0]) / std[0],
    (point[1] - mean[1]) / std[1],
  ]);

  // Run K-Means
  const result = kmeans(scaledData, 3, { seed: 42 });

  // Interpret Clusters
  // We need to map cluster ID to Risk Status
  // Logic: Cluster with lowest average GPA is High Risk
  const clusters = result.clusters;
  const clusterStats = [0, 1, 2].map((id) => {
    const indices = clusters
      .map((c, i) => (c === id ? i : -1))
      .filter((i) => i !== -1);
    const avgGPA =
      indices.reduce((sum, idx) => sum + students[idx].gpa, 0) /
        (indices.length || 1);
    return { id, avgGPA };
  });

  // Sort clusters by avgGPA (ascending: Low GPA -> High GPA)
  clusterStats.sort((a, b) => a.avgGPA - b.avgGPA);

  const riskMap: Record<number, "Berisiko Tinggi" | "Berisiko Sedang" | "Aman"> = {
    [clusterStats[0].id]: "Berisiko Tinggi",
    [clusterStats[1].id]: "Berisiko Sedang",
    [clusterStats[2].id]: "Aman",
  };

  const enrichedStudents = students.map((s, i) => {
    const clusterId = clusters[i];
    const status = riskMap[clusterId];

    // Risk Score: scaled_absence - scaled_grade
    // (Higher absence and Lower grade => Higher Risk Score)
    // scaledData[i][0] is scaled absence (higher is worse)
    // scaledData[i][1] is scaled grade (higher is better)
    const riskScore = scaledData[i][0] - scaledData[i][1];

    return {
      ...s,
      riskStatus: status,
      riskScore: riskScore,
    };
  });

  // Calculate Stats per Category
  const stats: Record<string, { averageScore: RiskStats; attendance: RiskStats }> = {};

  ["Berisiko Tinggi", "Berisiko Sedang", "Aman"].forEach(cat => {
      const catStudents = enrichedStudents.filter(s => s.riskStatus === cat);
      if (catStudents.length > 0) {
          const gpas = catStudents.map(s => s.gpa);
          const atts = catStudents.map(s => 100 - s.attendanceRate); // Count as absence

          stats[cat] = {
              averageScore: {
                  mean: gpas.reduce((a,b)=>a+b,0)/gpas.length,
                  min: Math.min(...gpas),
                  max: Math.max(...gpas),
                  count: gpas.length
              },
              attendance: { // Stats for ABSENCE
                  mean: atts.reduce((a,b)=>a+b,0)/atts.length,
                  min: Math.min(...atts),
                  max: Math.max(...atts),
                  count: atts.length
              }
          }
      }
  });

  return { students: enrichedStudents, stats };
}
