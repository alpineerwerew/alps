import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request

from app.config import get_settings


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


class SlidingWindowRateLimiter:
    """In-memory sliding window rate limiter per client IP (suitable for single-instance deploy)."""

    def __init__(self, max_events: int, window_seconds: float) -> None:
        self.max_events = max_events
        self.window_seconds = window_seconds
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def check(self, key: str) -> None:
        now = time.monotonic()
        dq = self._hits[key]
        while dq and now - dq[0] > self.window_seconds:
            dq.popleft()
        if len(dq) >= self.max_events:
            raise HTTPException(status_code=429, detail="Too Many Requests")
        dq.append(now)


_limiter: SlidingWindowRateLimiter | None = None


def get_rate_limiter() -> SlidingWindowRateLimiter:
    global _limiter
    if _limiter is None:
        s = get_settings()
        _limiter = SlidingWindowRateLimiter(
            max_events=s.webhook_rate_limit_max,
            window_seconds=float(s.webhook_rate_limit_window_seconds),
        )
    return _limiter


def rate_limited_webhook(request: Request) -> None:
    get_rate_limiter().check(_client_ip(request))
