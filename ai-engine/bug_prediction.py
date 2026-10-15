import os
from pathlib import Path
from flask import Flask, jsonify, request

try:
    import joblib
    import pandas as pd
    import numpy as np
except ImportError:
    joblib = None
    pd = None
    np = None

from nlp_test_generator import generate_tests_from_requirement
from flaky_detector import analyze_test_flakiness
from self_healing_engine import compute_healed_locators
from smart_regression import select_impacted_tests

MODEL_PATH = Path(__file__).with_name("model.pkl")


def load_model():
    if joblib is None or not MODEL_PATH.exists():
        return None
    try:
        model = joblib.load(MODEL_PATH)
        if hasattr(model, "predict"):
            return model
    except Exception:
        return None
    return None


def _as_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def predict_risk(loc=0, commits=0, churn=0, complexity=0):
    loc_val = _as_float(loc)
    commits_val = _as_float(commits)
    churn_val = _as_float(churn)
    complexity_val = _as_float(complexity)

    model = load_model()
    if model is not None and pd is not None:
        try:
            data = pd.DataFrame([[loc_val, commits_val, churn_val, complexity_val]],
                                columns=["loc", "commits", "churn", "complexity"])
            prediction = model.predict(data)
            return round(float(prediction[0]), 2)
        except Exception:
            pass

    # Intelligent Weighted Risk Heuristic
    # Baseline normalizer: 0-100 score
    base = (loc_val * 0.012) + (commits_val * 0.45) + (churn_val * 0.35) + (complexity_val * 1.5)
    score = min(max(base, 5.0), 98.5)
    return round(score, 2)


app = Flask(__name__)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "UP",
        "service": "AI Testing Intelligence Engine",
        "model_loaded": load_model() is not None,
        "capabilities": [
            "Bug Risk Prediction",
            "NLP Test Case Generation",
            "Flaky Test Detection",
            "Self-Healing Locators",
            "Smart Regression Selection"
        ]
    })


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    loc = payload.get("loc", 120)
    commits = payload.get("commits", 15)
    churn = payload.get("churn", 25)
    complexity = payload.get("complexity", 10)

    risk_score = predict_risk(loc, commits, churn, complexity)
    
    if risk_score >= 75:
        risk_level = "CRITICAL"
        rec = "Immediate QA focus required. High commit churn and complexity indicate potential defect cluster."
    elif risk_score >= 50:
        risk_level = "HIGH"
        rec = "Automated regression suite expansion strongly recommended before merging."
    elif risk_score >= 25:
        risk_level = "MEDIUM"
        rec = "Standard unit and integration test coverage sufficient."
    else:
        risk_level = "LOW"
        rec = "Low risk profile. Stable module with minimal historical defect propensity."

    confidence = round(min(80.0 + (commits * 0.5), 96.5), 1)

    return jsonify({
        "module": payload.get("module", "Core Service"),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "confidence": confidence,
        "recommendation": rec,
        "model_loaded": load_model() is not None
    })


@app.route("/generate-tests", methods=["POST"])
def generate_tests():
    payload = request.get_json(silent=True) or {}
    requirement = payload.get("requirement") or payload.get("prompt") or "User login with MFA and email verification"
    project_name = payload.get("project_name", "Application")
    test_cases = generate_tests_from_requirement(requirement, project_name)
    return jsonify({
        "status": "SUCCESS",
        "requirement": requirement,
        "total_generated": len(test_cases),
        "test_cases": test_cases
    })


@app.route("/detect-flakiness", methods=["POST"])
def detect_flakiness():
    payload = request.get_json(silent=True) or {}
    runs = payload.get("runs", [
        {"status": "PASS", "duration_ms": 1100},
        {"status": "FAIL", "duration_ms": 2900},
        {"status": "PASS", "duration_ms": 1250},
        {"status": "PASS", "duration_ms": 1180},
        {"status": "FAIL", "duration_ms": 3100}
    ])
    result = analyze_test_flakiness(runs)
    return jsonify(result)


@app.route("/self-heal", methods=["POST"])
def self_heal():
    payload = request.get_json(silent=True) or {}
    failed_selector = payload.get("selector", "#submit-order-button")
    attributes = payload.get("attributes", {
        "tag": "button",
        "data-testid": "submit-order-btn",
        "aria-label": "Complete Purchase",
        "text": "Place Order Now"
    })
    result = compute_healed_locators(failed_selector, attributes)
    return jsonify(result)


@app.route("/smart-select", methods=["POST"])
def smart_select():
    payload = request.get_json(silent=True) or {}
    changed_files = payload.get("changed_files", ["backend/src/main/java/com/aitest/service/PaymentService.java"])
    all_tests = payload.get("all_tests")
    result = select_impacted_tests(changed_files, all_tests)
    return jsonify(result)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
