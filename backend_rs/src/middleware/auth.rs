use axum::{
    async_trait,
    extract::FromRequestParts,
    http::{request::Parts, StatusCode},
    response::{IntoResponse, Response},
    Json,
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use serde_json::json;
use crate::config::Config;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub email: String,
    pub role: String,
    pub exp: usize,
}

pub struct AuthUser {
    pub user_id: String,
    pub email: String,
    pub role: String,
    #[allow(dead_code)]
    pub token: String, // Reserved for next-auth structure if needed
    #[allow(dead_code)]
    pub roles: Vec<String>, // Reserved for multiple roles
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
{
    type Rejection = Response;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts
            .headers
            .get("Authorization")
            .and_then(|value| value.to_str().ok());

        let token = match auth_header {
            Some(header) if header.starts_with("Bearer ") => &header[7..],
            _ => {
                return Err((
                    StatusCode::UNAUTHORIZED,
                    Json(json!({"error": "Missing or invalid Authorization header"})),
                )
                    .into_response())
            }
        };

        let config = Config::init();
        let decoding_key = DecodingKey::from_secret(config.jwt_secret.as_bytes());
        let validation = Validation::default();

        match decode::<Claims>(token, &decoding_key, &validation) {
            Ok(token_data) => Ok(AuthUser {
                user_id: token_data.claims.sub,
                email: token_data.claims.email,
                role: token_data.claims.role.clone(),
                token: token.to_string(),
                roles: vec![token_data.claims.role],
            }),
            Err(_) => Err((
                StatusCode::UNAUTHORIZED,
                Json(json!({"error": "Invalid token"})),
            )
                .into_response()),
        }
    }
}
