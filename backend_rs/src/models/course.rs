use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Course {
    pub id: String,
    pub code: String,
    pub name: String,
    pub description: Option<String>,
    pub teacher_id: String,
    pub semester: String, // enum 'ganjil', 'genap'
    pub academic_year: String,
    pub created_at: Option<DateTime<Utc>>,
}

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Enrollment {
    pub id: String,
    pub student_id: String,
    pub course_id: String,
    pub enrolled_at: Option<DateTime<Utc>>,
}

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Module {
    pub id: String,
    pub course_id: Option<String>,
    pub teacher_id: String,
    pub title: String,
    pub description: Option<String>,
    pub r#type: String, // enum 'video', 'pdf', 'quiz', 'document' - using raw identifier for type
    pub content_url: String,
    pub file_name: Option<String>,
    pub file_type: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
}
