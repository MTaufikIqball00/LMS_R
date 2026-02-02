use sqlx::mysql::MySqlPoolOptions;
use sqlx::{MySql, Pool};

pub type DbPool = Pool<MySql>;

pub async fn init_pool(database_url: &str) -> Result<DbPool, sqlx::Error> {
    MySqlPoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
}
