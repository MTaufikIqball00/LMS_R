use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

#[derive(Debug)]
pub enum AppError {
    DbError(sqlx::Error),
    AuthError(String),
    NotFound(String),
    InternalServerError(String),
}

impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        AppError::DbError(err)
    }
}

impl From<anyhow::Error> for AppError {
    fn from(err: anyhow::Error) -> Self {
        AppError::InternalServerError(err.to_string())
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            AppError::DbError(err) => {
                tracing::error!("Database error: {:?}", err);
                (StatusCode::INTERNAL_SERVER_ERROR, "Database error".to_string())
            }
            AppError::AuthError(msg) => (StatusCode::UNAUTHORIZED, msg),
            AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
            AppError::InternalServerError(msg) => {
                tracing::error!("Internal server error: {}", msg);
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error".to_string())
            }
        };

        let body = Json(json!({
            "error": message,
        }));

        (status, body).into_response()
    }
}
