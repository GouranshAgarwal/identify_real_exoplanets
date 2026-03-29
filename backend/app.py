from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import numpy as np
import joblib
import shap
import uvicorn


# ----------------------------
# Load Models
# ----------------------------

reg_model = joblib.load("regression_model.pkl")
clf_model = joblib.load("classification_model.pkl")

print(clf_model.named_steps)


model = clf_model.named_steps["model"]
imputer = clf_model.named_steps["imputer"]

# SHAP explainer (use model only)
explainer = shap.TreeExplainer(model)



# ----------------------------
# FastAPI App
# ----------------------------

app = FastAPI(title="Stellar Prediction API")


# ----------------------------
# CORS Middleware
# ----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------
# Root Endpoint (Health Check)
# ----------------------------

@app.get("/")
def home():
    return {"message": "Stellar Prediction API is running"}


# ----------------------------
# Input Schema
# ----------------------------

class StellarInput(BaseModel):

    koi_period: Optional[float] = None
    koi_duration: Optional[float] = None
    koi_depth: Optional[float] = None
    koi_impact: Optional[float] = None
    koi_model_snr: Optional[float] = None
    koi_num_transits: Optional[float] = None
    koi_ror: Optional[float] = None
    st_teff: Optional[float] = None
    st_logg: Optional[float] = None
    st_met: Optional[float] = None
    st_mass: Optional[float] = None
    st_radius: Optional[float] = None
    st_dens: Optional[float] = None
    teff_err1: Optional[float] = None
    teff_err2: Optional[float] = None
    logg_err1: Optional[float] = None
    logg_err2: Optional[float] = None
    feh_err1: Optional[float] = None
    feh_err2: Optional[float] = None
    mass_err1: Optional[float] = None
    mass_err2: Optional[float] = None
    radius_err1: Optional[float] = None
    radius_err2: Optional[float] = None


# ----------------------------
# Prediction Endpoint
# ----------------------------

@app.post("/predict")
def predict(data: StellarInput):

    input_dict = data.model_dump()

    # Safety Check
    if all(v is None for v in input_dict.values()):
        raise HTTPException(
            status_code=400,
            detail="At least one feature must be provided for prediction."
        )

    try:

        # Convert input to DataFrame
        input_df = pd.DataFrame([input_dict])

        # Ensure correct feature order
        input_df = input_df[reg_model.feature_names_in_]

        # Fill missing values (IMPORTANT for SHAP + RF)
        input_df = input_df.fillna(0)

        # -----------------------
        # Regression Prediction
        # -----------------------

        pred_log = reg_model.predict(input_df)
        predicted_radius = float(np.expm1(pred_log)[0])

        # -----------------------
        # Classification
        # -----------------------

        class_pred = int(clf_model.predict(input_df)[0])
        probability = float(clf_model.predict_proba(input_df)[0][1])

        label = "Confirmed" if class_pred == 1 else "False Positive"

        # -----------------------
        # SHAP Explanation (SAFE VERSION)
        # -----------------------

        # Transform input
        processed_input = imputer.transform(input_df)

        # Compute SHAP values
        shap_values = explainer.shap_values(processed_input)

        # Handle different SHAP output formats
        if isinstance(shap_values, list):
            shap_values = shap_values[1]  # class 1

        # Ensure 2D → take first sample
        shap_values = np.array(shap_values)

        if shap_values.ndim == 3:
            shap_values = shap_values[0]  # (features, classes)

        # If still 2D (features x classes), take class 1
        if shap_values.ndim == 2:
            shap_values = shap_values[:, 1]

        # Now guaranteed: (n_features,)
        shap_values = shap_values.flatten()

        # Map features
        feature_importance = dict(zip(input_df.columns, shap_values))

        # Sort
        sorted_features = sorted(
            feature_importance.items(),
            key=lambda x: abs(x[1]),
            reverse=True
        )

        # Remove error features (optional)
        EXCLUDED_FEATURES = [
            "teff_err1", "teff_err2",
            "logg_err1", "logg_err2",
            "feh_err1", "feh_err2",
            "mass_err1", "mass_err2",
            "radius_err1", "radius_err2"
        ]

        filtered_features = [
            (f, v) for f, v in sorted_features
            if f not in EXCLUDED_FEATURES
        ]

        top_features = filtered_features[:5]

        # Final safe formatting
        explanations = []

        for feature, value in top_features:
            val = float(value)  # now guaranteed scalar

            explanations.append({
                "feature": feature,
                "impact": round(val, 5),
                "impact_type": "positive" if val > 0 else "negative"
            })
        # -----------------------
        # Final Response
        # -----------------------

        return {
            "predicted_planet_radius": round(predicted_radius, 4),
            "habitability_class": label,
            "habitability_probability": round(probability, 4),
            "top_features": explanations
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=10000)