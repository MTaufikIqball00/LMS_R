use axum::{
    routing::get,
    Router,
};
use crate::AppState;
use crate::handlers::grade::{get_grades, get_grades_by_student, create_grade};

pub fn grade_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(get_grades).post(create_grade))
        .route("/student/:student_id", get(get_grades_by_student))
}
