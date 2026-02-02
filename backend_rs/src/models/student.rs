use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::NaiveDateTime;
use std::fmt;

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, Clone, sqlx::Type)]
#[sqlx(type_name = "status", rename_all = "snake_case")]
pub enum StudentStatus {
    Active,
    Inactive,
    Suspended,
}

impl fmt::Display for StudentStatus {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            StudentStatus::Active => write!(f, "active"),
            StudentStatus::Inactive => write!(f, "inactive"),
            StudentStatus::Suspended => write!(f, "suspended"),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct Student {
    pub id: String,
    pub student_id: String, // NIM
    pub name: String,
    pub email: String,
    pub avatar: Option<String>,
    pub semester: Option<i32>,
    pub grade: Option<i32>,
    pub school_name: Option<String>,
    pub school_province: Option<String>,
    pub phone: Option<String>,
    pub class_name: Option<String>,
    pub major: Option<String>,
    pub enrollment_date: Option<NaiveDateTime>,
    pub status: Option<String>,
    pub gpa: Option<f64>,
    pub total_credits: Option<i32>,
    pub completed_credits: Option<i32>,
    pub address: Option<String>,
    pub parent_name: Option<String>,
    pub parent_phone: Option<String>,
    pub attendance_rate: Option<f64>,
    pub assignment_completion: Option<f64>,
    pub quiz_average: Option<f64>,
    pub risk_status: Option<String>,
    pub risk_score: Option<f64>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
}

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize)]
pub struct StudentRiskUpdate {
    pub risk_status: String,
    pub risk_score: f64,
}
