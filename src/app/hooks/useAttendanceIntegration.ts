// hooks/useAttendanceIntegration.ts
"use client";
import { useMemo } from "react";
import { AttendanceRecord, AttendanceStats } from "../types/attendance";

interface GradeImpact {
  attendanceScore: number;
  contribution: number;
  weightedScore: number;
}

interface CourseProgress {
  completionRate: number;
  completedClasses: number;
  totalClasses: number;
  missedClasses: number;
}

interface ParentNotifications {
  sent: number;
  pending: number;
  lastSent?: string;
}

interface Achievements {
  totalBadges: number;
  streakBadges: number;
  perfectAttendanceDays: number;
  recentAchievements: string[];
}

export const useAttendanceIntegration = (
  records: AttendanceRecord[],
  stats: AttendanceStats | null
) => {
  const gradeImpact: GradeImpact = useMemo(() => {
    if (!stats || !records.length) {
      return {
        attendanceScore: 0,
        contribution: 20,
        weightedScore: 0,
      };
    }

    const attendanceRate = stats.attendanceRate;
    const attendanceScore = Math.round(attendanceRate);
    const contribution = 20; // 20% of final grade
    const weightedScore = (attendanceScore * contribution) / 100;

    return {
      attendanceScore,
      contribution,
      weightedScore,
    };
  }, [stats, records]);

  const courseProgress: CourseProgress = useMemo(() => {
    if (!records.length) {
      return {
        completionRate: 0,
        completedClasses: 0,
        totalClasses: 0,
        missedClasses: 0,
      };
    }

    const totalClasses = records.length;
    const completedClasses = records.filter(
      (record) => record.status === "present" || record.status === "late"
    ).length;
    const missedClasses = records.filter(
      (record) => record.status === "absent"
    ).length;
    const completionRate =
      totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

    return {
      completionRate,
      completedClasses,
      totalClasses,
      missedClasses,
    };
  }, [records]);

  const parentNotifications: ParentNotifications = useMemo(() => {
    if (!records.length) {
      return {
        sent: 0,
        pending: 0,
      };
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });

    const absentRecords = thisMonthRecords.filter(
      (record) => record.status === "absent"
    );

    const lateRecords = thisMonthRecords.filter(
      (record) => record.status === "late"
    );

    const sentNotifications = absentRecords.length + lateRecords.length;
    const pendingNotifications = 0; // Calculate based on your logic

    const lastAbsentRecord = absentRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      sent: sentNotifications,
      pending: pendingNotifications,
      lastSent: lastAbsentRecord?.date,
    };
  }, [records]);

  const achievements: Achievements = useMemo(() => {
    if (!stats || !records.length) {
      return {
        totalBadges: 0,
        streakBadges: 0,
        perfectAttendanceDays: 0,
        recentAchievements: [],
      };
    }

    const currentStreak = stats.currentStreak;
    let streakBadges = 0;
    const recentAchievements: string[] = [];

    if (currentStreak >= 30) {
      streakBadges = 4;
      recentAchievements.push("30-Day Perfect Streak 💎");
    } else if (currentStreak >= 15) {
      streakBadges = 3;
      recentAchievements.push("15-Day Perfect Streak 🥇");
    } else if (currentStreak >= 7) {
      streakBadges = 2;
      recentAchievements.push("Week Perfect Streak 🥈");
    } else if (currentStreak >= 3) {
      streakBadges = 1;
      recentAchievements.push("3-Day Streak 🥉");
    }

    const perfectAttendanceDays = records.filter(
      (record) => record.status === "present"
    ).length;

    if (stats.attendanceRate >= 95) {
      recentAchievements.push("Excellent Attendance 🌟");
    }
    if (stats.attendanceRate >= 90) {
      recentAchievements.push("Great Student 👨‍🎓");
    }

    const totalBadges = streakBadges + (stats.attendanceRate >= 90 ? 1 : 0);

    return {
      totalBadges,
      streakBadges,
      perfectAttendanceDays,
      recentAchievements: recentAchievements.slice(0, 3),
    };
  }, [stats, records]);

  return {
    gradeImpact,
    courseProgress,
    parentNotifications,
    achievements,
  };
};