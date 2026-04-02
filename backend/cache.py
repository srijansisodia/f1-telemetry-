import time
from functools import wraps
from typing import Any, Callable

_cache: dict[str, tuple[Any, float]] = {}


def cached(ttl_seconds: int = 3600):
    """Simple in-memory TTL cache decorator for async functions."""
    def decorator(fn: Callable):
        @wraps(fn)
        async def wrapper(*args, **kwargs):
            key = f"{fn.__name__}:{args}:{sorted(kwargs.items())}"
            if key in _cache:
                value, ts = _cache[key]
                if time.time() - ts < ttl_seconds:
                    return value
            result = await fn(*args, **kwargs)
            _cache[key] = (result, time.time())
            return result
        return wrapper
    return decorator


def clear_cache():
    _cache.clear()
