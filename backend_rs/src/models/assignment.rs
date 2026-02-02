use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Assignment {
    pub id: String,
    pub course_id: Option<String>,
    pub teacher_id: String,
    pub title: String,
    pub description: Option<String>,
    pub due_date: Option<DateTime<Utc>>,
    pub max_score: Option<f64>,
    pub created_at: Option<DateTime<Utc>>,
}

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Submission {
    pub id: String,
    pub assignment_id: String,
    pub student_id: String,
    pub file_url: Option<String>,
    pub submitted_at: Option<DateTime<Utc>>,
    pub score: Option<f64>,
    pub feedback: Option<String>,
    pub graded_at: Option<DateTime<Utc>>,
}
