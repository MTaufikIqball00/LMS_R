use axum::{
    extract::{Path, State},
    Json,
};
use crate::{
    error::AppError,
    models::assignment::Assignment,
    AppState,
};
use serde::Deserialize;

// GET /api/assignments?course_id=...
pub async fn get_assignments(
    State(state): State<AppState>,
) -> Result<Json<Vec<Assignment>>, AppError> {
    // Ideally filter by course_id query param
    let assignments = sqlx::query_as::<_, Assignment>(
        "SELECT * FROM assignments ORDER BY due_date ASC",
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(assignments))
}

// GET /api/assignments/:id
pub async fn get_assignment_detail(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Assignment>, AppError> {
    let assignment = sqlx::query_as::<_, Assignment>(
        "SELECT * FROM assignments WHERE id = ?",
    )
    .bind(id)
    .fetch_optional(&state.db)
    .await?;

    match assignment {
        Some(a) => Ok(Json(a)),
        None => Err(AppError::NotFound("Assignment not found".to_string())),
    }
}

#[derive(Deserialize)]
pub struct SubmitAssignmentRequest {
    pub student_id: String,
    pub file_url: String,
}

// POST /api/assignments/:id/submit
pub async fn submit_assignment(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<SubmitAssignmentRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    // Basic implementation
    let submission_id = uuid::Uuid::new_v4().to_string();
    sqlx::query(
        "INSERT INTO submissions (id, assignment_id, student_id, file_url, submitted_at) VALUES (?, ?, ?, ?, NOW())",
    )
    .bind(submission_id)
    .bind(id)
    .bind(payload.student_id)
    .bind(payload.file_url)
    .execute(&state.db)
    .await?;

    Ok(Json(serde_json::json!({"status": "submitted"})))
}
