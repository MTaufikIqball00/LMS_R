mod config;
mod db;
mod error;
mod handlers;
mod middleware;
mod models;
mod routes;
mod app_state;

use axum::Router;
use config::Config;
use db::init_pool;
use dotenv::dotenv;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;
use app_state::AppState;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    dotenv().ok();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "backend_rs=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = Config::init();

    // Initialize DB pool
    let pool = init_pool(&config.database_url)
        .await
        .expect("Failed to create database connection pool");

    let state = AppState { db: pool };

    let app = Router::new()
        .nest("/api", routes::auth::auth_routes())
        .nest("/api/teacher", routes::teacher::teacher_routes())
        .nest("/api/courses", routes::course::course_routes())
        .nest("/api/assignments", routes::assignment::assignment_routes())
        .nest("/api/quizzes", routes::quiz::quiz_routes())
        .nest("/api/attendance", routes::attendance::attendance_routes())
        .nest("/api/grades", routes::grade::grade_routes())
        .nest("/api/admin", routes::admin::admin_routes())
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    tracing::info!("listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
