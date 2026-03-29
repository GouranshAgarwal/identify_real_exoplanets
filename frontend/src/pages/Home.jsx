import React, { useState } from "react";
import { StellerForm } from "../components/form/StellerForm";
import { ResultPanel } from "../components/result/Resultpanel";
import { predictPlanet } from "../services/api";
import "../styles/global.css"

export const Home = () => {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Coerce empty strings → null, everything else → number
      const cleanedData = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [k, v === "" ? null : Number(v)])
      );

      const res = await predictPlanet(cleanedData);
      setResult(res);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Something went wrong while running the classifier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">

      {/* ── Page-level header ── */}
      <header className="page-header">
        <div className="page-eyebrow">
          <span className="page-eyebrow-line" />
          Kepler Object of Interest · Classifier
          <span className="page-eyebrow-line" />
        </div>
        <h1 className="page-title">
          Exoplanet <em>Candidate Analysis</em>
        </h1>
        <p className="page-subtitle">
          Input photometric and stellar parameters to evaluate whether a transit
          signal is a confirmed planet, false positive, or candidate.
        </p>
      </header>

      {/* ── Two-panel body ── */}
      <div className="main-grid">

        {/* Left — form */}
        <div className="left-panel">
          <div className="panel-section-head">
            <span className="panel-tag">01</span>
            <div>
              <h2 className="panel-section-title">Input Parameters</h2>
              <p className="panel-section-desc">Photometric and stellar measurements</p>
            </div>
          </div>
          <StellerForm onSubmit={handleSubmit} />
        </div>

        {/* Right — result (sticky, scrolls independently) */}
        <div className="right-panel">
          <div className="panel-section-head">
            <span className="panel-tag">02</span>
            <div>
              <h2 className="panel-section-title">Analysis Result</h2>
              <p className="panel-section-desc">Classification output and feature attribution</p>
            </div>
          </div>
          <ResultPanel result={result} loading={loading} error={error} />
        </div>

      </div>
    </div>
  );
};