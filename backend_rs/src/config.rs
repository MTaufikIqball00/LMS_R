use std::env;

#[derive(Clone)]
pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub port: u16,
    #[allow(dead_code)]
    pub ml_service_url: String, // Reserved for ML service integration
}

impl Config {
    pub fn init() -> Config {
        let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "mysql://root:password@localhost:3306/school_db".to_string());
        let jwt_secret = env::var("JWT_SECRET").unwrap_or_else(|_| "supersecretkey".to_string());
        let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string()).parse().unwrap_or(8080);
        let ml_service_url = env::var("ML_SERVICE_URL").unwrap_or_else(|_| "http://localhost:5000".to_string());

        Config {
            database_url,
            jwt_secret,
            port,
            ml_service_url,
        }
    }
}
