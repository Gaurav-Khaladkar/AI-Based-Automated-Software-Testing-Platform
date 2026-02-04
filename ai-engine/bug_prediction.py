from pathlib import Path

import joblib
import pandas as pd

MODEL_PATH = Path(__file__).with_name("model.pkl")


def load_model():
    if MODEL_PATH.exists():
        return joblib.load(MODEL_PATH)
    return None


def predict_risk(lines_of_code, commits):
    data = pd.DataFrame([[lines_of_code, commits]], columns=["loc", "commits"])
    model = load_model()
    if model is None:
        return float(lines_of_code) * 0.001 + float(commits) * 0.1
    prediction = model.predict(data)
    return prediction[0]


if __name__ == "__main__":
    from flask import Flask, jsonify, request

    app = Flask(__name__)

    @app.route("/predict", methods=["POST"])
    def predict():
        payload = request.json or {}
        result = predict_risk(payload.get("loc", 0), payload.get("commits", 0))
        return jsonify({"risk_score": result, "model_loaded": load_model() is not None})

    app.run(port=5000)
