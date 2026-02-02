use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Quiz {
    pub id: String,
    pub course_id: Option<String>,
    pub teacher_id: String,
    pub title: String,
    pub description: Option<String>,
    pub time_limit: Option<i32>,
    pub passing_score: Option<f64>,
    pub created_at: Option<DateTime<Utc>>,
}

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct QuizQuestion {
    pub id: String,
    pub quiz_id: String,
    pub question_text: String,
    pub question_type: String,
    pub options: Option<String>, // JSON string of options
    pub correct_answer: Option<String>,
    pub points: Option<f64>,
}

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct QuizAttempt {
    pub id: String,
    pub quiz_id: String,
    pub student_id: String,
    pub score: Option<f64>,
    pub started_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,
}
