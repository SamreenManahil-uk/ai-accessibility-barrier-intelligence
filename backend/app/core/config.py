from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Accessibility Barrier Intelligence API"
    app_version: str = "1.0.0"
    environment: str = "development"

    database_url: str = (
        "postgresql+psycopg://"
        "accessibility_user:"
        "accessibility_dev_password@"
        "127.0.0.1:55432/"
        "accessibility_db"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
