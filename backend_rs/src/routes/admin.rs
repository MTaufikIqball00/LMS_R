use axum::{
    routing::get,
    Router,
};
use crate::AppState;
use crate::handlers::admin::{get_users, get_dashboard_stats};

pub fn admin_routes() -> Router<AppState> {
    Router::new()
        .route("/users", get(get_users))
        .route("/dashboard", get(get_dashboard_stats))
}
