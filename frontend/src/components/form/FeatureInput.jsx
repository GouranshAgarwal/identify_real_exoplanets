import React, { useState, useRef, useEffect } from 'react';

export const FeatureInput = ({ label, name, register, unit, tooltip }) => {
  const [open, setOpen] = useState(false);
  const tipRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        tipRef.current && !tipRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="fi-root">
      <div className="fi-label-row">
        <label className="fi-label" htmlFor={name}>{label}</label>
        <div className="fi-meta">
          {unit && <span className="fi-unit">{unit}</span>}
          {tooltip && (
            <div className="fi-tip-anchor">
              <button
                ref={btnRef}
                type="button"
                className={`fi-tip-btn ${open ? 'fi-tip-btn--active' : ''}`}
                onClick={() => setOpen(v => !v)}
                aria-label={`Info about ${label}`}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="5.25" stroke="currentColor" strokeWidth="1.25"/>
                  <path d="M6 5.5v3M6 3.5v.75" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
              {open && (
                <div ref={tipRef} className="fi-tooltip" role="tooltip">
                  <div className="fi-tooltip-arrow" />
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <input
        id={name}
        className="fi-input"
        type="number"
        step="any"
        placeholder="—"
        {...register(name)}
      />
    </div>
  );
};