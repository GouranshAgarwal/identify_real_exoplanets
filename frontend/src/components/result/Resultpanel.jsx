import "../../styles/ResultPanel.css";
import { PredictionCard } from "./PredictionCard";

const IdleIllustration = () => (
  <svg className="rp-idle-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="100" rx="80" ry="30" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="rp-orbit rp-orbit--1"/>
    <ellipse cx="100" cy="100" rx="55" ry="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 5" className="rp-orbit rp-orbit--2"/>
    <circle cx="100" cy="100" r="14" fill="currentColor" className="rp-star"/>
    <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.12" className="rp-star-glow"/>
    <circle cx="100" cy="100" r="26" fill="currentColor" opacity="0.06" className="rp-star-glow"/>
    <circle cx="180" cy="100" r="7"   fill="currentColor" className="rp-planet rp-planet--1"/>
    <circle cx="100" cy="80"  r="4.5" fill="currentColor" opacity="0.6" className="rp-planet rp-planet--2"/>
    <line x1="100" y1="36"  x2="100" y2="44"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    <line x1="164" y1="68"  x2="160" y2="75"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    <line x1="164" y1="132" x2="160" y2="125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    <line x1="100" y1="164" x2="100" y2="156" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    <line x1="36"  y1="132" x2="40"  y2="125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
    <line x1="36"  y1="68"  x2="40"  y2="75"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3"/>
  </svg>
);

export const ResultPanel = ({ result, loading, error }) => {
  return (
    <div className="rp-root">
      {loading && (
        <div className="rp-state rp-loading">
          <div className="rp-loading-rings"><span /><span /><span /></div>
          <p className="rp-state-label">Running classifier…</p>
          <p className="rp-state-sub">Evaluating transit parameters against trained model</p>
        </div>
      )}

      {error && !loading && (
        <div className="rp-state rp-error">
          <span className="rp-error-icon">!</span>
          <p className="rp-state-label">Prediction Failed</p>
          <p className="rp-state-sub">{error}</p>
        </div>
      )}

      {!loading && !error && !result && (
        <div className="rp-state rp-idle">
          <IdleIllustration />
          <p className="rp-state-label">Awaiting Parameters</p>
          <p className="rp-state-sub">
            Fill in the transit and stellar parameters on the left, then run the classifier to see results here.
          </p>
          <ul className="rp-idle-hints">
            <li><span>①</span> Enter photometric measurements</li>
            <li><span>②</span> Add stellar properties</li>
            <li><span>③</span> Run classifier for analysis</li>
          </ul>
        </div>
      )}

      {!loading && !error && result && (
        <div className="rp-result">
          <PredictionCard data={result} />
        </div>
      )}
    </div>
  );
};