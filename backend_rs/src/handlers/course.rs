use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use crate::AppState;

#[derive(Debug, Serialize, FromRow)]
pub struct Course {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub teacher_id: i32,
}

#[derive(Debug, Deserialize)]
pub struct CreateCourseRequest {
    pub name: String,
    pub description: Option<String>,
    pub teacher_id: i32,
}

pub async fn get_courses(
    State(state): State<AppState>,
) -> Result<Json<Vec<Course>>, (StatusCode, String)> {
    let courses = sqlx::query_as::<_, Course>("SELECT id, name, description, teacher_id FROM courses")
        .fetch_all(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok(Json(courses))
}

pub async fn get_course_detail(
    State(state): State<AppState>,
    Path(id): Path<i32>,
) -> Result<Json<Course>, (StatusCode, String)> {
    let course = sqlx::query_as::<_, Course>("SELECT id, name, description, teacher_id FROM courses WHERE id = ?")
        .bind(id)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .ok_or((StatusCode::NOT_FOUND, "Course not found".to_string()))?;
    
    Ok(Json(course))
}

pub async fn create_course(
    State(state): State<AppState>,
    Json(payload): Json<CreateCourseRequest>,
) -> Result<(StatusCode, Json<serde_json::Value>), (StatusCode, String)> {
    let result = sqlx::query("INSERT INTO courses (name, description, teacher_id) VALUES (?, ?, ?)")
        .bind(&payload.name)
        .bind(&payload.description)
        .bind(payload.teacher_id)
        .execute(&state.db)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
    
    Ok((StatusCode::CREATED, Json(serde_json::json!({
        "id": result.last_insert_id(),
        "message": "Course created successfully"
    }))))
}
