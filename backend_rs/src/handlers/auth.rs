use axum::{
    extract::State,
    Json,
};
use crate::{
    error::AppError,
    models::user::{LoginRequest, LoginResponse, User},
    middleware::auth::Claims,
    AppState,
};
use jsonwebtoken::{encode, EncodingKey, Header};
use chrono::{Utc, Duration};
use crate::config::Config;

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, AppError> {
    let user = sqlx::query_as::<_, User>(
        "SELECT * FROM users WHERE email = ?",
    )
    .bind(&payload.email)
    .fetch_optional(&state.db)
    .await?;

    let user = match user {
        Some(u) => u,
        None => return Err(AppError::AuthError("Invalid email or password".to_string())),
    };

    if user.password != payload.password {
         return Err(AppError::AuthError("Invalid email or password".to_string()));
    }

    let config = Config::init();
    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user.id.clone(),
        email: user.email.clone(),
        role: user.role.clone(),
        exp: expiration,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(config.jwt_secret.as_bytes()),
    )
    .map_err(|e| AppError::InternalServerError(e.to_string()))?;

    Ok(Json(LoginResponse {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token,
    }))
}

pub async fn verify_session(
    user: crate::middleware::auth::AuthUser,
) -> Result<Json<serde_json::Value>, AppError> {
    Ok(Json(serde_json::json!({
        "status": "authenticated",
        "user": {
            "id": user.user_id,
            "email": user.email,
            "role": user.role
        }
    })))
}
