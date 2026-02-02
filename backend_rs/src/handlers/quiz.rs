use axum::{
    extract::{Path, State},
    Json,
};
use crate::{
    error::AppError,
    models::quiz::Quiz,
    AppState,
};
use serde::Deserialize;

// GET /api/quizzes
pub async fn get_quizzes(
    State(state): State<AppState>,
) -> Result<Json<Vec<Quiz>>, AppError> {
    let quizzes = sqlx::query_as::<_, Quiz>(
        "SELECT * FROM quizzes ORDER BY created_at DESC",
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(quizzes))
}

// GET /api/quizzes/:id
pub async fn get_quiz_detail(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<Quiz>, AppError> {
    let quiz = sqlx::query_as::<_, Quiz>(
        "SELECT * FROM quizzes WHERE id = ?",
    )
    .bind(id)
    .fetch_optional(&state.db)
    .await?;

    match quiz {
        Some(q) => Ok(Json(q)),
        None => Err(AppError::NotFound("Quiz not found".to_string())),
    }
}

#[derive(Deserialize)]
pub struct SubmitQuizRequest {
    pub student_id: String,
    #[allow(dead_code)]
    pub answers: serde_json::Value, // JSON object of answers - reserved for scoring logic
}

// POST /api/quizzes/:id/submit
pub async fn submit_quiz_attempt(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(payload): Json<SubmitQuizRequest>,
) -> Result<Json<serde_json::Value>, AppError> {
    // Basic implementation: Record attempt start/finish
    let attempt_id = uuid::Uuid::new_v4().to_string();

    // Calculate score logic would go here (simplified for migration)
    let score = 0.0;

    sqlx::query(
        "INSERT INTO quiz_attempts (id, quiz_id, student_id, score, started_at, completed_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
    )
    .bind(attempt_id)
    .bind(id)
    .bind(payload.student_id)
    .bind(score)
    .execute(&state.db)
    .await?;

    Ok(Json(serde_json::json!({"status": "submitted", "score": score})))
}
