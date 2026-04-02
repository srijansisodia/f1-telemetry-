import fastf1
import pandas as pd
import numpy as np
from pathlib import Path
from mappings import RACE_NAME_MAP, TEAM_ID_MAP

# Enable FastF1 disk cache
CACHE_DIR = Path(__file__).parent / "ff1_cache"
CACHE_DIR.mkdir(exist_ok=True)
fastf1.Cache.enable_cache(str(CACHE_DIR))


def _load_session(season: int, race_name: str, session_type: str = "Q"):
    session = fastf1.get_session(season, race_name, session_type)
    session.load(telemetry=True, laps=True, weather=False, messages=False)
    return session


def get_sector_times(season: int, race_slug: str) -> list[dict]:
    race_name = RACE_NAME_MAP.get(race_slug.lower())
    if not race_name:
        raise ValueError(f"Unknown race slug: {race_slug}")

    session = _load_session(season, race_name, "Q")
    laps = session.laps.copy()

    results = []
    for driver_code in laps["Driver"].unique():
        driver_laps = laps[laps["Driver"] == driver_code].copy()

        for sector_num in [1, 2, 3]:
            col = f"Sector{sector_num}Time"
            if col not in driver_laps.columns:
                continue

            sector_times = driver_laps[col].dropna()
            if sector_times.empty:
                continue

            # Convert timedelta to milliseconds
            times_ms = sector_times.apply(lambda t: t.total_seconds() * 1000 if hasattr(t, "total_seconds") else None).dropna()
            if times_ms.empty:
                continue

            best_ms = float(times_ms.min())
            avg_ms = float(times_ms.mean())
            std_ms = float(times_ms.std()) if len(times_ms) > 1 else 0.0

            # Consistency: inverse of coefficient of variation (0-100 scale)
            cv = (std_ms / avg_ms * 100) if avg_ms > 0 else 0
            consistency = max(0, min(100, round(100 - cv * 2)))

            # Clutch score: performance on outlap / flying lap (simplified)
            # Use best time percentile as proxy
            clutch_score = round(min(100, max(0, 90 - (best_ms - times_ms.min()) / times_ms.mean() * 50)))

            # Get team
            car_data = driver_laps.iloc[0] if len(driver_laps) > 0 else None
            team_name = car_data.get("Team", "Unknown") if car_data is not None else "Unknown"
            team_id = TEAM_ID_MAP.get(team_name, "haas")

            # Ergast driver ID (approximate from code)
            results.append({
                "driverId": driver_code.lower(),
                "driverCode": driver_code,
                "teamId": team_id,
                "sectorId": f"S{sector_num}",
                "bestTime": round(best_ms),
                "avgTime": round(avg_ms),
                "consistency": consistency,
                "clutchScore": clutch_score,
            })

    # Compute timeGainVsLeader per sector
    for sector_id in ["S1", "S2", "S3"]:
        sector_results = [r for r in results if r["sectorId"] == sector_id]
        if sector_results:
            min_time = min(r["bestTime"] for r in sector_results)
            for r in sector_results:
                r["timeGainVsLeader"] = round((r["bestTime"] - min_time) / 1000, 3)

    return results


def get_driver_telemetry(season: int, race_slug: str, driver_code: str) -> dict:
    race_name = RACE_NAME_MAP.get(race_slug.lower())
    if not race_name:
        raise ValueError(f"Unknown race slug: {race_slug}")

    session = _load_session(season, race_name, "Q")
    laps = session.laps
    driver_laps = laps.pick_driver(driver_code)

    if driver_laps.empty:
        raise ValueError(f"No laps found for driver {driver_code}")

    # Get the fastest lap
    fastest_lap = driver_laps.pick_fastest()
    telemetry = fastest_lap.get_telemetry()

    return {
        "driverCode": driver_code,
        "speed": telemetry["Speed"].fillna(0).tolist(),
        "throttle": telemetry["Throttle"].fillna(0).tolist(),
        "brake": telemetry["Brake"].astype(int).tolist(),
        "distance": telemetry["Distance"].fillna(0).tolist(),
        "lapTimes": [float(fastest_lap["LapTime"].total_seconds() * 1000)],
    }


def compute_battle_metrics(driver_a: str, driver_b: str, season: int) -> dict:
    """Aggregate battle metrics across all qualifying sessions of the season."""
    # Iterate through completed rounds
    quali_wins_a = 0
    quali_wins_b = 0
    race_times_a = []
    race_times_b = []
    pos_gained_a = 0
    pos_gained_b = 0
    rounds_checked = 0

    for round_num in range(1, 25):
        try:
            session_q = fastf1.get_session(season, round_num, "Q")
            session_q.load(telemetry=False, laps=True, weather=False, messages=False)
            laps_q = session_q.laps

            a_laps = laps_q[laps_q["Driver"] == driver_a]
            b_laps = laps_q[laps_q["Driver"] == driver_b]

            if a_laps.empty or b_laps.empty:
                continue

            a_best = a_laps["LapTime"].dropna().min()
            b_best = b_laps["LapTime"].dropna().min()

            if pd.notna(a_best) and pd.notna(b_best):
                if a_best < b_best:
                    quali_wins_a += 1
                else:
                    quali_wins_b += 1

            rounds_checked += 1
        except Exception:
            continue

    # If no data found, return neutral
    if rounds_checked == 0:
        return {
            "driverAId": driver_a,
            "driverBId": driver_b,
            "driverAScore": 50,
            "driverBScore": 50,
            "winnerId": driver_a,
            "metrics": [
                {"label": "Qualifying H2H", "driverA": 1, "driverB": 1, "unit": "wins", "weight": 0.4},
                {"label": "Race Pace Index", "driverA": 50, "driverB": 50, "unit": "", "weight": 0.4},
                {"label": "Strategy Score", "driverA": 50, "driverB": 50, "unit": "", "weight": 0.2},
            ],
            "breakdown": {
                "qualifying": {"driverA": 1, "driverB": 1},
                "racePace": {"driverA": 50, "driverB": 50},
                "strategy": {"driverA": 50, "driverB": 50},
            },
        }

    # Normalize scores to 0-100
    total_quali = quali_wins_a + quali_wins_b or 1
    pace_a = round((quali_wins_a / total_quali) * 100)
    pace_b = 100 - pace_a

    score_a = round(0.4 * (quali_wins_a / total_quali * 100) + 0.4 * pace_a + 0.2 * 50)
    score_b = 100 - score_a

    return {
        "driverAId": driver_a,
        "driverBId": driver_b,
        "driverAScore": score_a,
        "driverBScore": score_b,
        "winnerId": driver_a if score_a >= score_b else driver_b,
        "metrics": [
            {"label": "Qualifying H2H", "driverA": quali_wins_a or 1, "driverB": quali_wins_b or 1, "unit": "wins", "weight": 0.4},
            {"label": "Race Pace Index", "driverA": pace_a, "driverB": pace_b, "unit": "", "weight": 0.4},
            {"label": "Strategy Score", "driverA": 50, "driverB": 50, "unit": "", "weight": 0.2},
        ],
        "breakdown": {
            "qualifying": {"driverA": quali_wins_a or 1, "driverB": quali_wins_b or 1},
            "racePace": {"driverA": pace_a, "driverB": pace_b},
            "strategy": {"driverA": 50, "driverB": 50},
        },
    }
