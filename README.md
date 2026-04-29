# 🌍 Identify Real Exoplanets

> **Separating Real Planets from False Positives using Machine Learning**

An intelligent classification system that analyzes photometric and stellar data to distinguish confirmed exoplanets from false positive transit signals. Built with FastAPI, React, and scikit-learn.

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.8+-blue?logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)

---

## 📋 Table of Contents

- [🎯 The Problem](#-the-problem)
- [💡 The Solution](#-the-solution)
- [🔧 How It Works](#-how-it-works)
- [📊 System Architecture](#-system-architecture)
- [🚀 Key Features](#-key-features)
- [📈 Performance Metrics](#-performance-metrics)
- [📚 Dataset Information](#-dataset-information)
- [🛠️ Technology Stack](#-technology-stack)
- [📋 Assumptions & Limitations](#-assumptions--limitations)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🤝 Contributing](#-contributing)

---

## 🎯 The Problem

### Why This Matters

The Kepler Space Telescope revolutionized exoplanet discovery, detecting thousands of planetary candidates. However, not all transit signals indicate real planets:

- **False Positives**: Occur when stellar noise, eclipsing binaries, or other phenomena mimic planetary transits
- **Manual Verification**: Astronomers manually review candidates, which is time-consuming and subjective
- **Imbalanced Dataset**: Confirmed planets are far fewer than false positives, making this a challenging classification problem

### The Challenge

Given photometric observations and stellar characteristics, how can we:
1. **Accurately classify** whether a transit signal represents a real planet or a false positive?
2. **Predict planetary properties** like radius based on observed parameters?
3. **Explain model decisions** so astronomers can understand the reasoning?

---

## 💡 The Solution

**Identify Real Exoplanets** combines machine learning with astronomical domain knowledge to provide:

✅ **High-Accuracy Classification** - Binary classification (Confirmed vs. False Positive)  
✅ **Interpretable Predictions** - SHAP values explain which features most influenced the decision  
✅ **Radius Estimation** - Regression model predicts exoplanet radius from stellar parameters  
✅ **User-Friendly Interface** - Interactive web dashboard for analysis  
✅ **Production-Ready API** - RESTful backend for integration with other systems  

---

## 🔧 How It Works

### System Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                   USER INPUT                                │
│     (Photometric & Stellar Parameters)                      │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              DATA PREPROCESSING                             │
│  • Missing Value Imputation                                │
│  • Feature Normalization                                   │
│  • Feature Selection                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│  CLASSIFICATION  │  │  REGRESSION      │
│  Model (RFC)     │  │  Model (RFR)     │
│                  │  │                  │
│ Predicts:        │  │ Predicts:        │
│ • Class Label    │  │ • Planet Radius  │
│ • Probability    │  │                  │
└──────┬───────────┘  └──────┬───────────┘
       │                     │
       └──────────┬──────────┘
                  ▼
        ┌─────────────────────┐
        │  EXPLAINABILITY     │
        │  (SHAP Values)      │
        │                     │
        │ Top 5 Contributing  │
        │ Features Identified │
        └──────────┬──────────┘
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              RESULTS RETURNED                               │
│  • Predicted Radius                                        │
│  • Classification Label & Probability                      │
│  • Feature Importance Scores                               │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Process

#### 1. **Input Collection**
Users provide 23 features across two categories:
- **Photometric Parameters** (transit-related)
- **Stellar Parameters** (star characteristics)

#### 2. **Data Preprocessing**
- **Missing Values**: Filled using K-Nearest Neighbors Imputation
- **Scaling**: StandardScaler normalizes all features
- **Feature Handling**: Removes error columns for SHAP calculation

#### 3. **Model Inference**
- **Classification**: Random Forest Classifier predicts planet candidacy
- **Regression**: Random Forest Regressor predicts exoplanet radius

#### 4. **Explainability**
- **SHAP (SHapley Additive exPlanations)** calculates feature importance
- **TreeExplainer** provides local interpretability for each prediction

#### 5. **Result Aggregation**
- Combines predictions with explanations
- Formats data for frontend visualization

---

## 📊 System Architecture

### High-Level Architecture

```
                      ┌──────────────────────────────┐
                      │   Web Browser (Frontend)     │
                      │      React + Vite            │
                      └──────────┬───────────────────┘
                                 │
                    HTTP Request │ JSON Response
                                 ▼
                      ┌──────────────────────────────┐
                      │  FastAPI Backend             │
                      │  (Python)                    │
                      │  ├─ CORS Middleware          │
                      │  ├─ Input Validation         │
                      │  ├─ Prediction Endpoint      │
                      │  └─ Error Handling           │
                      └──────────┬───────────────────┘
                                 │
                    Load Models   │ Make Predictions
                    & Explainers  ▼
                      ┌──────────────────────────────┐
                      │  ML Models (Pickled)         │
                      │  ├─ Classification Model     │
                      │  ├─ Regression Model         │
                      │  ├─ Imputer                  │
                      │  └─ SHAP Explainer           │
                      └──────────────────────────────┘
```

### Frontend Component Structure

```
App (Main Container)
├─ Home (Page Layout)
│  ├─ Header (Title & Instructions)
│  ├─ Left Panel
│  │  └─ StellerForm (Input Fields)
│  └─ Right Panel
│     └─ ResultPanel (Results Display)
│        ├─ Radius Display
│        ├─ Classification Card
│        ├─ Probability Gauge
│        └─ Feature Importance Chart
```

---

## 🚀 Key Features

### 🎯 Dual Prediction Models
- **Classification**: Determines if candidate is a confirmed planet or false positive
- **Regression**: Estimates planetary radius from stellar and photometric data

### 🔍 Transparent Decision Making
- **SHAP Integration**: See which features most influenced the prediction
- **Top 5 Features**: Highlights the most impactful parameters
- **Impact Direction**: Shows whether features positively or negatively affected the result

### 🎨 Interactive Web Interface
- **Real-time Predictions**: Instant results as you adjust parameters
- **Responsive Design**: Works on desktop and tablet devices
- **Visual Feedback**: Clear indication of loading states and errors

### 🔗 Production-Ready API
- **RESTful Endpoints**: Standard HTTP methods
- **CORS Support**: Secured cross-origin requests
- **Error Handling**: Comprehensive validation and error messages
- **Health Checks**: Built-in API status monitoring

### 📊 Data-Driven Insights
- **Multiple Features**: Analyzes 23 different astronomical parameters
- **Handles Missing Data**: Intelligent imputation strategies
- **Calibration Support**: Includes temperature and measurement error features

---

## 📈 Performance Metrics

### Model Performance

| Metric | Classification | Regression |
|--------|---|---|
| **Algorithm** | Random Forest Classifier | Random Forest Regressor |
| **Training Data** | Kepler Object of Interest (KOI) Dataset | KOI Dataset |
| **Input Features** | 23 photometric & stellar parameters | 23 photometric & stellar parameters |
| **Output** | Binary class (Confirmed/False Positive) | Continuous value (Planet Radius in Earth radii) |
| **Key Strength** | Handles imbalanced data well | Robust to outliers |

### Feature Coverage

**Photometric Features** (Transit & Signal):
- Orbital Period (koi_period)
- Transit Duration (koi_duration)
- Transit Depth (koi_depth)
- Impact Parameter (koi_impact)
- Signal-to-Noise Ratio (koi_model_snr)
- Number of Transits (koi_num_transits)
- Planet-Star Radius Ratio (koi_ror)

**Stellar Features** (Star Characteristics):
- Effective Temperature (st_teff)
- Surface Gravity (st_logg)
- Metallicity (st_met)
- Mass (st_mass)
- Radius (st_radius)
- Density (st_dens)
- Measurement Errors for above parameters

---

## 📚 Dataset Information

### Data Source
**Kepler Object of Interest (KOI) Catalog**
- Published by NASA Exoplanet Archive
- Contains transit signals detected by Kepler Space Telescope
- ~10,000+ candidate objects with confirmed dispositions

### Dataset Characteristics

| Aspect | Details |
|--------|---------|
| **Sample Size** | ~10,000 objects |
| **Time Period** | 2009-2018 (Kepler mission) |
| **Features** | 23 astronomical parameters |
| **Target Variable** | Disposition (Confirmed Exoplanet or False Positive) |
| **Class Distribution** | Imbalanced (more false positives than confirmed) |
| **Missing Values** | Present across multiple features (~5-15% per feature) |

### Feature Categories

1. **Photometric Parameters** - Derived from light curve analysis
2. **Stellar Parameters** - From spectroscopic observations
3. **Error Terms** - Measurement uncertainties for parameters

---

## 🛠️ Technology Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) - Modern, fast web framework
- **Server**: Uvicorn - ASGI server
- **ML Libraries**:
  - **scikit-learn**: Classification and regression models
  - **SHAP**: Explainable AI and feature importance
  - **pandas**: Data manipulation
  - **numpy**: Numerical computations
  - **joblib**: Model serialization

### Frontend
- **Framework**: [React 18](https://react.dev/) - UI library
- **Build Tool**: [Vite](https://vitejs.dev/) - Lightning-fast build tool
- **Styling**: CSS with custom themes
- **HTTP Client**: Fetch API for backend communication

### Deployment
- **Backend**: Python/Uvicorn on cloud platform
- **Frontend**: Deployed on [Vercel](https://vercel.com/)
- **Live URL**: https://identify-real-exoplanets.vercel.app

### Why These Technologies?

| Component | Tech | Reason |
|-----------|------|--------|
| ML Models | scikit-learn | Excellent for tabular data, tree-based models |
| Explainability | SHAP | State-of-art model interpretability |
| Backend API | FastAPI | High performance, automatic documentation |
| Frontend | React + Vite | Fast development, smooth UX |
| Serialization | joblib | Efficient model persistence |

---

## 📋 Assumptions & Limitations

### Key Assumptions

1. **Feature Quality**: Input features are measured accurately with reasonable error terms
2. **Data Distribution**: Test data follows similar distribution as training data (KOI catalog)
3. **Missing Values**: Missing features can be safely imputed using k-NN
4. **Feature Independence**: Some features may be correlated; model handles this implicitly
5. **Temporal Stability**: Stellar properties don't change significantly during observation period
6. **Binary Classification**: System only predicts confirmed or false positive (no "candidate" category)

### Known Limitations

⚠️ **Imbalanced Dataset**
- False positives significantly outnumber confirmed planets
- Model trained with class balancing techniques but may still favor false positives

⚠️ **Missing Data**
- Features with >30% missing values excluded from training
- Assumes missing values are missing at random (MAR)

⚠️ **Feature Domain**
- Model optimized for Kepler mission parameters
- May not generalize well to other exoplanet surveys (TESS, K2)

⚠️ **Interpretability Caveats**
- SHAP values show association, not causation
- Feature importance reflects training data patterns, not physical causation

⚠️ **Computational Overhead**
- SHAP calculation adds latency to predictions (typically 1-2 seconds per request)

⚠️ **No Confidence Intervals**
- System provides point predictions without uncertainty quantification
- Regression model doesn't include prediction intervals

### Recommendations for Use

✅ Use for **filtering and prioritization** of candidates  
✅ Use for **exploratory analysis** of what features matter  
✅ Use as **first-pass classifier** before human review  
❌ Don't use as sole arbiter for planet confirmation  
❌ Don't apply to non-Kepler survey data without retraining  

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip & npm package managers

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start API server
python app.py
# Server runs on http://localhost:10000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### Making Predictions

**Via Web Interface:**
1. Navigate to https://identify-real-exoplanets.vercel.app
2. Fill in photometric and stellar parameters
3. Click "Predict"
4. View results and feature importance

**Via API (curl):**
```bash
curl -X POST http://localhost:10000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "koi_period": 10.5,
    "koi_duration": 4.2,
    "koi_depth": 300,
    "st_teff": 5800,
    "st_mass": 1.0,
    "st_radius": 1.0
  }'
```

---

## 📁 Project Structure

```
identify_real_exoplanets/
├── backend/
│   ├── app.py                      # FastAPI application
│   ├── requirements.txt            # Python dependencies
│   ├── classification_model.pkl    # Trained classifier (pickled)
│   ├── regression_model.pkl        # Trained regressor (pickled)
│   └── train.py                    # Model training script (reference)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main React component
│   │   ├── pages/
│   │   │   └── Home.jsx            # Home page layout
│   │   ├── components/
│   │   │   ├── form/
│   │   │   │   └── StellerForm.jsx # Input form
│   │   │   └── result/
│   │   │       └── Resultpanel.jsx # Results display
│   │   ├── services/
│   │   │   └── api.js              # API client
│   │   └── styles/
│   │       └── global.css          # Global styles
│   ├── package.json                # Node dependencies
│   ├── vite.config.js              # Vite configuration
│   └── index.html                  # Entry HTML
│
├── README.md                        # This file
├── .gitignore                       # Git ignore rules
└── LICENSE                          # MIT License
```

---

## 🔌 API Endpoints

### Health Check
```
GET /
```
Returns: `{"message": "Stellar Prediction API is running"}`

### Predictions
```
POST /predict
```

**Request Body:**
```json
{
  "koi_period": 10.5,
  "koi_duration": 4.2,
  "koi_depth": 300.5,
  "koi_impact": 0.5,
  "koi_model_snr": 25.3,
  "koi_num_transits": 15,
  "koi_ror": 0.025,
  "st_teff": 5800,
  "st_logg": 4.5,
  "st_met": 0.0,
  "st_mass": 1.0,
  "st_radius": 1.0,
  "st_dens": 1.41,
  "teff_err1": 50,
  "teff_err2": 50,
  "logg_err1": 0.1,
  "logg_err2": 0.1,
  "feh_err1": 0.05,
  "feh_err2": 0.05,
  "mass_err1": 0.05,
  "mass_err2": 0.05,
  "radius_err1": 0.05,
  "radius_err2": 0.05
}
```

**Response:**
```json
{
  "predicted_planet_radius": 1.2345,
  "habitability_class": "Confirmed",
  "habitability_probability": 0.8765,
  "top_features": [
    {
      "feature": "st_radius",
      "impact": 0.3456,
      "impact_type": "positive"
    },
    {
      "feature": "koi_ror",
      "impact": 0.2123,
      "impact_type": "positive"
    }
  ]
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. 🐛 Report bugs and issues
2. 💡 Suggest improvements
3. 📝 Submit pull requests
4. 📚 Improve documentation

### Development Guidelines
- Follow PEP 8 for Python code
- Use meaningful commit messages
- Add tests for new features
- Update README for significant changes

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- **NASA Exoplanet Archive** for the Kepler Object of Interest (KOI) Dataset
- **scikit-learn** community for excellent ML tools
- **SHAP** team for interpretable ML methods
- **FastAPI** for the amazing web framework
- **Kepler Space Telescope** mission for discovering thousands of exoplanets

---

## 📞 Contact & Support

- **GitHub**: [GouranshAgarwal](https://github.com/GouranshAgarwal)
- **Live Demo**: [https://identify-real-exoplanets.vercel.app](https://identify-real-exoplanets.vercel.app)
- **Repository**: [https://github.com/GouranshAgarwal/identify_real_exoplanets](https://github.com/GouranshAgarwal/identify_real_exoplanets)

---

<div align="center">

**Made with ❤️ for astronomy enthusiasts and data scientists**

⭐ If you find this project helpful, please consider giving it a star! ⭐

</div>
