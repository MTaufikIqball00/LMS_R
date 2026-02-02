use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use crate::AppState;

#[derive(Debug, Serialize, FromRow)]
pub struct Grade {
    pub id: i32,
    pub student_id: i32,
    pub course_id: i32,
    pub grade: f64,
    pub grade_type: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateGradeRequest {
    pub student_id: i32,
    pub course_id: i32,
    pub grade: f64,
    pub grade_type: String,
}

pub async fn get_grades(
    State(state): State<AppState>,
) -> Result<Json<Vec<Grade>>, (StatusCode, String)> {
    let grades = sqlx::query_as::<_, Grade>("SELECT id, student_id, course_id, grade, grade_type FROM grades")
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok(Json(grades))
}

pub async fn get_grades_by_student(
    State(state): State<AppState>,
    Path(student_id): Path<i32>,
) -> Result<Json<Vec<Grade>>, (StatusCode, String)> {
    let grades = sqlx::query_as::<_, Grade>(
        "SELECT id, student_id, course_id, grade, grade_type FROM grades WHERE student_id = ?"
    )
        .bind(student_id)
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok(Json(grades))
}

pub async fn create_grade(
    State(state): State<AppState>,
    Json(payload): Json<CreateGradeRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, String)> {
    let result = sqlx::query(
        "INSERT INTO grades (student_id, course_id, grade, grade_type) VALUES (?, ?, ?, ?)"
    )
        .bind(payload.student_id)
        .bind(payload.course_id)
        .bind(payload.grade)
        .bind(&payload.grade_type)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok((StatusCode::CREATED, Json(serde_json::json!({
        "id": result.last_insert_id(),
        "message": "Grade created successfully"
    }))))
}
