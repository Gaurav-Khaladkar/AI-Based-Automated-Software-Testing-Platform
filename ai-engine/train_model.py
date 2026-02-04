import joblib
import numpy as np
from sklearn.dummy import DummyRegressor
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler


def train_model(output_path: str = "model.pkl") -> None:
    X = np.array([
        [0, 0],
        [100, 5],
        [500, 10],
        [1000, 20],
        [2000, 40],
    ], dtype=float)
    y = np.array([0.1, 0.3, 0.6, 0.8, 0.95])

    model = make_pipeline(StandardScaler(), DummyRegressor(strategy="mean"))
    model.fit(X, y)
    joblib.dump(model, output_path)
    print(f"Model saved to {output_path}")


if __name__ == "__main__":
    train_model()
