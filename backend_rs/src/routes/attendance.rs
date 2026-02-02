use axum::{
    routing::get,
    Router,
};
use crate::AppState;
use crate::handlers::attendance::{get_attendance, get_attendance_by_course, mark_attendance};

pub fn attendance_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(get_attendance).post(mark_attendance))
        .route("/course/:course_id", get(get_attendance_by_course))
}
