from pathlib import Path

import joblib
import pandas as pd
from flask import Flask, jsonify, request

MODEL_PATH = Path(__file__).with_name("model.pkl")


def load_model():
    if not MODEL_PATH.exists():
        return None
    try:
        model = joblib.load(MODEL_PATH)
    except Exception:
        return None
    if not hasattr(model, "predict"):
        return None
    return model


def _as_float(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def predict_risk(lines_of_code, commits):
    loc = _as_float(lines_of_code)
    commit_count = _as_float(commits)
    data = pd.DataFrame([[loc, commit_count]], columns=["loc", "commits"])
    model = load_model()

    if model is None:
        return loc * 0.001 + commit_count * 0.1

    prediction = model.predict(data)
    return float(prediction[0])


app = Flask(__name__)


@app.route("/predict", methods=["POST"])
def predict():
    payload = request.get_json(silent=True) or {}
    result = predict_risk(payload.get("loc", 0), payload.get("commits", 0))
    return jsonify({"risk_score": result, "model_loaded": load_model() is not None})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
