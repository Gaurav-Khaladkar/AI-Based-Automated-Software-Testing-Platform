import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


def train_model(output_path: str = "model.pkl") -> None:
    # Training dataset: [lines_of_code, commits_count, churn_rate, cyclomatic_complexity]
    # Target: risk score (0 - 100)
    X = np.array([
        [50, 2, 5, 2],       # Trivial utility
        [150, 8, 12, 5],     # Simple controller
        [400, 18, 25, 12],   # Medium service
        [800, 35, 45, 20],   # Complex business logic
        [1500, 60, 65, 35],  # High churn authentication engine
        [2500, 95, 80, 50],  # Critical payment orchestrator
        [3500, 140, 92, 70], # Monolithic legacy module
    ], dtype=float)

    y = np.array([8.0, 22.0, 41.5, 62.0, 81.0, 91.5, 98.0])

    model = make_pipeline(
        StandardScaler(),
        GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
    )
    model.fit(X, y)

    dir_path = os.path.dirname(os.path.abspath(__file__))
    target_file = os.path.join(dir_path, output_path)
    joblib.dump(model, target_file)
    print(f"Enterprise ML Bug Prediction model trained and saved to {target_file}")


if __name__ == "__main__":
    train_model()
