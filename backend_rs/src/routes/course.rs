use axum::{
    routing::get,
    Router,
};
use crate::AppState;
use crate::handlers::course::{get_courses, get_course_detail, create_course};

pub fn course_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(get_courses).post(create_course))
        .route("/:id", get(get_course_detail))
}
