use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use crate::AppState;

#[derive(Debug, Serialize, FromRow)]
pub struct Attendance {
    pub id: i32,
    pub student_id: i32,
    pub course_id: i32,
    pub date: String,
    pub status: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateAttendanceRequest {
    pub student_id: i32,
    pub course_id: i32,
    pub date: String,
    pub status: String,
}

pub async fn get_attendance(
    State(state): State<AppState>,
) -> Result<Json<Vec<Attendance>>, (StatusCode, String)> {
    let records = sqlx::query_as::<_, Attendance>("SELECT id, student_id, course_id, date, status FROM attendance")
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok(Json(records))
}

pub async fn get_attendance_by_course(
    State(state): State<AppState>,
    Path(course_id): Path<i32>,
) -> Result<Json<Vec<Attendance>>, (StatusCode, String)> {
    let records = sqlx::query_as::<_, Attendance>(
        "SELECT id, student_id, course_id, date, status FROM attendance WHERE course_id = ?"
    )
        .bind(course_id)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok(Json(records))
}

pub async fn mark_attendance(
    State(state): State<AppState>,
    Json(payload): Json<CreateAttendanceRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, String)> {
    let result = sqlx::query(
        "INSERT INTO attendance (student_id, course_id, date, status) VALUES (?, ?, ?, ?)"
    )
        .bind(payload.student_id)
        .bind(payload.course_id)
        .bind(&payload.date)
        .bind(&payload.status)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok((StatusCode::CREATED, Json(serde_json::json!({
        "id": result.last_insert_id(),
        "message": "Attendance marked successfully"
    }))))
}
