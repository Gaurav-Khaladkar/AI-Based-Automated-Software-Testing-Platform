import joblib
import pandas as pd

model = joblib.load("model.pkl")


def predict_risk(lines_of_code, commits):
    data = pd.DataFrame([[lines_of_code, commits]], columns=["loc", "commits"])
    prediction = model.predict(data)
    return prediction[0]


if __name__ == "__main__":
    from flask import Flask, jsonify, request

    app = Flask(__name__)

    @app.route("/predict", methods=["POST"])
    def predict():
        payload = request.json
        result = predict_risk(payload["loc"], payload["commits"])
        return jsonify({"risk_score": result})

    app.run(port=5000)
