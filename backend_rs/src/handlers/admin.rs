use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use serde::Serialize;
use sqlx::FromRow;
use crate::AppState;

#[derive(Debug, Serialize, FromRow)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub role: String,
}

#[derive(Debug, Serialize)]
pub struct DashboardStats {
    pub total_users: i64,
    pub total_courses: i64,
    pub total_students: i64,
    pub total_teachers: i64,
}

pub async fn get_users(
    State(state): State<AppState>,
) -> Result<Json<Vec<User>>, (StatusCode, String)> {
    let users = sqlx::query_as::<_, User>("SELECT id, username, email, role FROM users")
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok(Json(users))
}

pub async fn get_dashboard_stats(
    State(state): State<AppState>,
) -> Result<Json<DashboardStats>, (StatusCode, String)> {
    let total_users: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let total_courses: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM courses")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let total_students: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users WHERE role = 'student'")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    let total_teachers: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM users WHERE role = 'teacher'")
        .fetch_one(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok(Json(DashboardStats {
        total_users: total_users.0,
        total_courses: total_courses.0,
        total_students: total_students.0,
        total_teachers: total_teachers.0,
    }))
}
