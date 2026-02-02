use axum::{
    extract::{Path, State},
    Json,
};
use crate::{
    error::AppError,
    models::student::Student,
    AppState,
};
use serde_json::{json, Value};

// GET /api/teacher/students
pub async fn get_students(
    State(state): State<AppState>,
) -> Result<Json<Vec<Student>>, AppError> {
    let students = sqlx::query_as::<_, Student>(
        "SELECT * FROM students ORDER BY name ASC",
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(students))
}

// GET /api/teacher/students/:id
pub async fn get_student_detail(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Student>, AppError> {
    let student = sqlx::query_as::<_, Student>(
        "SELECT * FROM students WHERE id = ?",
    )
    .bind(id)
    .fetch_optional(&state.db)
    .await?;

    match student {
        Some(s) => Ok(Json(s)),
        None => Err(AppError::NotFound("Student not found".to_string())),
    }
}

// GET /api/teacher/dashboard
// Calculates metrics for the dashboard
pub async fn get_teacher_dashboard(
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    // 1. Total Students
    let total_students: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM students",
    )
    .fetch_one(&state.db)
    .await?;

    // 2. Average Attendance
    // Note: In a real app, use AVG() in SQL.
    // Assuming attendance_rate is stored in `students` table as per schema, or derived from `attendance` table.
    // The schema has `attendance_rate` in `students`.
    let avg_attendance: Option<f64> = sqlx::query_scalar(
        "SELECT AVG(attendance_rate) FROM students WHERE attendance_rate IS NOT NULL",
    )
    .fetch_one(&state.db)
    .await?;

    // 3. At Risk Students
    let at_risk_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM students WHERE risk_status IN ('high', 'moderate')",
    )
    .fetch_one(&state.db)
    .await?;

    // 4. Recent Activities (Mocked or from `activities` table)
    // The schema has `activities` table.
    // Let's just return stats for now as per dashboard requirements.

    Ok(Json(json!({
        "total_students": total_students,
        "average_attendance": avg_attendance.unwrap_or(0.0),
        "at_risk_students": at_risk_count,
        // Add more dashboard metrics here
    })))
}
