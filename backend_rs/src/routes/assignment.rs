use axum::{
    routing::{get, post},
    Router,
};
use crate::AppState;
use crate::handlers::assignment::{get_assignments, get_assignment_detail, submit_assignment};

pub fn assignment_routes() -> Router<AppState> {
    Router::new()
        .route("/", get(get_assignments))
        .route("/:id", get(get_assignment_detail))
        .route("/:id/submit", post(submit_assignment))
}
