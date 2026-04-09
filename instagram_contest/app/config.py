from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Meta / Instagram
    verify_token: str = Field(..., description="Webhook verification token (hub.verify_token)")
    instagram_access_token: str = Field(..., description="Long-lived Page or IG User access token")
    meta_app_secret: str | None = Field(
        default=None,
        description="App Secret — required for X-Hub-Signature-256 verification in production",
    )
    instagram_graph_version: str = Field(default="v21.0")
    instagram_graph_base: str = Field(
        default="https://graph.facebook.com",
        description="Use graph.facebook.com for connected IG Business accounts",
    )

    # Telegram
    telegram_token: str = Field(...)
    telegram_admin_id: int = Field(..., description="Numeric user id of the admin (private messages)")

    # Database
    database_url: str = Field(default="sqlite+aiosqlite:///./contest.db")

    # Webhook rate limit: max requests per client IP per window (seconds)
    webhook_rate_limit_max: int = Field(default=120)
    webhook_rate_limit_window_seconds: int = Field(default=60)

    # Default seed for /tirage when not provided (set a fixed value for reproducible demos)
    contest_default_random_seed: int | None = Field(default=None)

    # --- Optional / bonus flags ---
    enable_csv_export_command: bool = Field(
        default=False,
        description="If true, admin can use /export to receive a CSV of participants",
    )
    # BONUS: AUTO_FOLLOW — never enable without reading Meta policy; high ban risk.
    instagram_auto_follow_enabled: bool = Field(
        default=False,
        description="DANGEROUS: attempt to follow mentioner via Graph API (commented implementation)",
    )
    # BONUS: require DM keyword after mention — needs messaging webhooks + extra logic
    keyword_dm_filter_enabled: bool = Field(
        default=False,
        description="If true, only count participants who DM a keyword (requires extra implementation)",
    )

    @field_validator("telegram_admin_id", mode="before")
    @classmethod
    def coerce_admin_id(cls, v: object) -> int:
        if isinstance(v, str) and v.strip().isdigit():
            return int(v.strip())
        if isinstance(v, int):
            return v
        raise ValueError("TELEGRAM_ADMIN_ID must be an integer")


@lru_cache
def get_settings() -> Settings:
    return Settings()
