import asyncio
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from cache import cached
from telemetry import get_sector_times, get_driver_telemetry, compute_battle_metrics

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm Bahrain sector data on startup
    async def prewarm():
        try:
            print("Pre-warming Bahrain 2024 sector data...")
            await cached_get_sectors(2024, "bahrain")
            print("Pre-warm complete.")
        except Exception as e:
            print(f"Pre-warm failed (non-fatal): {e}")

    asyncio.create_task(prewarm())
    yield


app = FastAPI(title="F1 Telemetry API", version="1.0.0", lifespan=lifespan)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ─── Cached wrappers ─────────────────────────────────────────────────────────

@cached(ttl_seconds=86400)  # 24h
async def cached_get_sectors(season: int, race: str):
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, get_sector_times, season, race)


@cached(ttl_seconds=86400)
async def cached_get_telemetry(season: int, race: str, driver: str):
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, get_driver_telemetry, season, race, driver)


@cached(ttl_seconds=21600)  # 6h
async def cached_get_battle(driver_a: str, driver_b: str, season: int):
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, compute_battle_metrics, driver_a, driver_b, season)


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/sectors/{season}/{race}")
@limiter.limit("30/minute")
async def get_sectors(request: Request, season: int, race: str):
    try:
        data = await cached_get_sectors(season, race)
        return data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load sector data: {e}")


@app.get("/telemetry/{season}/{race}/{driver}")
@limiter.limit("20/minute")
async def get_telemetry(request: Request, season: int, race: str, driver: str):
    try:
        data = await cached_get_telemetry(season, race, driver.upper())
        return data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load telemetry: {e}")


@app.get("/battle/{driver_a}/{driver_b}")
@limiter.limit("20/minute")
async def get_battle(request: Request, driver_a: str, driver_b: str, season: int = 2024):
    try:
        data = await cached_get_battle(driver_a.upper(), driver_b.upper(), season)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute battle: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
