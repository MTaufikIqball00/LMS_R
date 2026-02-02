use axum::{
    routing::{get, post},
    Router,
};
use crate::AppState;
use crate::handlers::quiz::{get_quizzes, get_quiz_detail, submit_quiz_attempt};

pub fn quiz_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(get_quizzes))
        .route("/:id", get(get_quiz_detail))
        .route("/:id/submit", post(submit_quiz_attempt))
}
