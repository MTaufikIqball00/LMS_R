use axum::{
    routing::{post, get},
    Router,
};
use crate::AppState;
use crate::handlers::auth::{login, verify_session};

pub fn auth_routes() -> Router<AppState> {
    Router::new()
        .route("/login", post(login))
        .route("/verifikasi-login", get(verify_session))
}
