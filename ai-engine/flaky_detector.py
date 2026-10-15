"""
Flaky Test Detector
Analyzes test run execution history, variance in duration, and intermittent pass/fail ratios
to compute a flakiness probability index.
"""
from typing import Dict, List, Any
import statistics


def analyze_test_flakiness(runs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Given a list of test run results for a specific test:
    [{ "status": "PASS"|"FAIL", "duration_ms": 1200 }, ...]
    """
    if not runs:
        return {
            "flakiness_score": 0.0,
            "is_flaky": False,
            "verdict": "INSUFFICIENT_DATA",
            "recommendation": "Execute at least 5 runs to compute statistical flakiness."
        }

    statuses = [r.get("status", "").upper() for r in runs]
    durations = [float(r.get("duration_ms", 0)) for r in runs if r.get("duration_ms")]

    total_runs = len(statuses)
    passes = statuses.count("PASS")
    fails = statuses.count("FAIL")

    pass_ratio = passes / total_runs if total_runs else 0

    # Status flip count (how often does status change between consecutive runs)
    status_flips = 0
    for i in range(1, len(statuses)):
        if statuses[i] != statuses[i - 1]:
            status_flips += 1

    flip_rate = status_flips / (total_runs - 1) if total_runs > 1 else 0

    # Duration coefficient of variation
    duration_cv = 0.0
    if len(durations) >= 2:
        mean_dur = statistics.mean(durations)
        if mean_dur > 0:
            std_dur = statistics.stdev(durations)
            duration_cv = std_dur / mean_dur

    # Flakiness heuristic calculation: (flip_rate * 60) + (duration_cv * 20) + (intermittent penalty)
    flakiness_raw = (flip_rate * 65.0) + (min(duration_cv, 1.0) * 20.0)
    if 0 < pass_ratio < 1.0:
        flakiness_raw += 15.0

    score = round(min(max(flakiness_raw, 0.0), 100.0), 2)
    is_flaky = score >= 35.0

    recommendations = []
    if flip_rate > 0.2:
        recommendations.append("High status flip frequency. Check for race conditions, unmocked network calls, or asynchronous timing issues.")
    if duration_cv > 0.4:
        recommendations.append("High execution time variance. Check database connection pool exhaustion or heavy background GC.")
    if not recommendations:
        recommendations.append("Test demonstrates deterministic stability across historical runs.")

    return {
        "flakiness_score": score,
        "is_flaky": is_flaky,
        "total_analyzed_runs": total_runs,
        "pass_rate": round(pass_ratio * 100, 1),
        "status_flips": status_flips,
        "recommendations": recommendations
    }
