use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[allow(dead_code)]
#[derive(Debug, Serialize, Deserialize, Clone, sqlx::Type)]
#[sqlx(type_name = "role", rename_all = "snake_case")]
pub enum UserRole {
    Student,
    Teacher,
    #[serde(rename = "admin_langganan")]
    AdminLangganan,
    #[serde(rename = "admin_sekolah")]
    AdminSekolah,
    #[serde(rename = "kepala_sekolah")]
    KepalaSekolah,
    Parent,
}

#[derive(Debug, Serialize, Deserialize, FromRow, Clone)]
pub struct User {
    pub id: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub email: String,
    pub role: String,
    pub name: String,
    pub grade: Option<i32>,
    pub school_name: Option<String>,
    pub school_province: Option<String>,
    pub school_subscription_status: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub id: String,
    pub email: String,
    pub name: String,
    pub role: String,
    pub token: String,
}
