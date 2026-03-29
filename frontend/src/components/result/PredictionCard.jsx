import "../../styles/predictionCard.css";

const FEATURE_LABELS = {
  koi_period:       "Orbital Period",
  koi_duration:     "Transit Duration",
  koi_depth:        "Transit Depth",
  koi_impact:       "Impact Parameter",
  koi_model_snr:    "Signal-to-Noise Ratio",
  koi_num_transits: "Number of Transits",
  koi_ror:          "Planet/Star Radius Ratio",
  st_teff:          "Effective Temperature",
  st_logg:          "Surface Gravity",
  st_met:           "Metallicity",
  st_mass:          "Stellar Mass",
  st_radius:        "Stellar Radius",
  st_dens:          "Stellar Density",
};

const MAX_IMPACT = 0.1; // normalise bar widths against this ceiling

export const PredictionCard = ({ data }) => {
  const {
    predicted_planet_radius,
    habitability_class,
    habitability_probability,
    top_features,
  } = data;

  const isConfirmed   = habitability_class === "Confirmed";
  const pct           = Math.round(habitability_probability * 100);
  const radiusDisplay = predicted_planet_radius.toFixed(3);

  // Classify planet type by radius (Earth radii)
  const planetType =
    predicted_planet_radius < 1.25 ? "Rocky / Earth-like" :
    predicted_planet_radius < 2.0  ? "Super-Earth" :
    predicted_planet_radius < 4.0  ? "Sub-Neptune" :
    predicted_planet_radius < 10   ? "Gas Giant" :
                                     "Hot Jupiter";

  return (
    <div className={`pc-card ${isConfirmed ? "pc-card--confirmed" : "pc-card--false"}`}>

      {/* ── Stamp / verdict ── */}
      <div className="pc-verdict-row">
        <div className="pc-verdict-badge">
          <span className="pc-verdict-dot" />
          {isConfirmed ? "Exo-Planet" : "Other Steller Object"}
        </div>
        <span className="pc-divider" />
        <span className="pc-report-id">KOI Analysis Report</span>
      </div>

      {/* ── Hero stats ── */}
      <div className="pc-hero">
        <div className="pc-stat pc-stat--radius">
          <span className="pc-stat-value">{radiusDisplay}</span>
          <span className="pc-stat-unit">R⊕</span>
          <span className="pc-stat-label">Predicted Radius</span>
          <span className="pc-stat-sub">{planetType}</span>
        </div>

        <div className="pc-stat pc-stat--confidence">
          <span className="pc-stat-value">{pct}<span className="pc-stat-pct">%</span></span>
          <span className="pc-stat-label">Model Confidence</span>
          {/* Radial arc */}
          <svg className="pc-arc-svg" viewBox="0 0 100 54" fill="none">
            <path
              d="M 5 52 A 45 45 0 0 1 95 52"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="pc-arc-track"
            />
            <path
              d="M 5 52 A 45 45 0 0 1 95 52"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className="pc-arc-fill"
              strokeDasharray={`${141.4 * habitability_probability} 141.4`}
            />
          </svg>
        </div>
      </div>

      {/* ── Feature importance ── */}
      <div className="pc-section">
        <h3 className="pc-section-title">
          <span className="pc-section-num">—</span>
          Top Driving Features
        </h3>

        <div className="pc-features">
          {top_features.map((f, i) => {
            const label     = FEATURE_LABELS[f.feature] ?? f.feature;
            const barWidth  = Math.min((f.impact / MAX_IMPACT) * 100, 100);
            const isPos     = f.impact_type === "positive";

            return (
              <div key={f.feature} className="pc-feature-row">
                <div className="pc-feature-meta">
                  <span className="pc-feature-rank">#{i + 1}</span>
                  <span className="pc-feature-name">{label}</span>
                  <span className={`pc-feature-badge ${isPos ? "pc-badge--pos" : "pc-badge--neg"}`}>
                    {isPos ? "+" : "−"}
                  </span>
                </div>
                <div className="pc-feature-bar-track">
                  <div
                    className={`pc-feature-bar ${isPos ? "pc-bar--pos" : "pc-bar--neg"}`}
                    style={{ "--bar-w": `${barWidth}%`, animationDelay: `${i * 80}ms` }}
                  />
                  <span className="pc-feature-impact">{f.impact.toFixed(4)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer note ── */}
      <p className="pc-footnote">
        Feature impacts are SHAP values — the marginal contribution of each parameter to the final classification probability.
      </p>
    </div>
  );
};