use axum::{
    routing::get,
    Router,
};
use crate::AppState;
use crate::handlers::teacher::{get_students, get_student_detail, get_teacher_dashboard};

pub fn teacher_routes() -> Router<AppState> {
    Router::new()
        .route("/students", get(get_students))
        .route("/students/:id", get(get_student_detail))
        .route("/dashboard", get(get_teacher_dashboard))
}
