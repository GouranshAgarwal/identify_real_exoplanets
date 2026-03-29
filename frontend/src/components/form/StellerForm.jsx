import { useForm } from "react-hook-form";
import { FeatureInput } from "./FeatureInput";
import "../../styles/stellerForm.css";

const FEATURE_GROUPS = [
  {
    id: "transit",
    label: "Transit Parameters",
    tag: "01",
    description: "Photometric measurements from Kepler's light curves",
    features: [
      { name: "koi_period",       label: "Orbital Period",           unit: "days",  tooltip: "Time for one complete orbit around the host star. Derived from the spacing between transit events in the light curve." },
      { name: "koi_duration",     label: "Transit Duration",         unit: "hrs",   tooltip: "Total time the planet spends crossing the stellar disk, from first to last contact." },
      { name: "koi_depth",        label: "Transit Depth",            unit: "ppm",   tooltip: "Fractional decrease in stellar flux during transit, in parts per million. Scales with (Rp/Rs)²." },
      { name: "koi_impact",       label: "Impact Parameter",         unit: "b",     tooltip: "Projected sky-plane distance between planet and stellar center at mid-transit, in units of stellar radius. 0 = central transit." },
      { name: "koi_model_snr",    label: "Signal-to-Noise Ratio",   unit: "SNR",   tooltip: "Ratio of the transit signal strength to the photometric noise level. Higher values indicate a more confident detection." },
      { name: "koi_num_transits", label: "Number of Transits",       unit: "N",     tooltip: "Count of observed transit events used in the model fit. More transits improve period precision." },
      { name: "koi_ror",          label: "Planet/Star Radius Ratio", unit: "Rp/Rs", tooltip: "Ratio of the planet's radius to the stellar radius. Directly related to transit depth: depth ≈ (Rp/Rs)²." },
    ],
  },
  {
    id: "stellar",
    label: "Stellar Properties",
    tag: "02",
    description: "Physical characteristics of the host star",
    features: [
      { name: "st_teff",   label: "Effective Temperature", unit: "K",      tooltip: "The blackbody temperature of the stellar surface. The Sun's Teff ≈ 5778 K. Determines stellar spectral type." },
      { name: "st_logg",   label: "Surface Gravity",       unit: "log g",  tooltip: "Logarithm (base 10) of surface gravitational acceleration in cm/s². The Sun's log g ≈ 4.44. Lower values indicate giant stars." },
      { name: "st_met",    label: "Metallicity",           unit: "[Fe/H]", tooltip: "Iron abundance relative to the Sun on a log scale. [Fe/H] = 0 means solar metallicity; negative values indicate metal-poor stars." },
      { name: "st_mass",   label: "Stellar Mass",          unit: "M☉",    tooltip: "Mass of the host star in solar masses. Critical for deriving the planet's orbital semi-major axis via Kepler's third law." },
      { name: "st_radius", label: "Stellar Radius",        unit: "R☉",    tooltip: "Radius of the host star in solar radii. Combined with Rp/Rs, this gives the absolute planet radius." },
      { name: "st_dens",   label: "Stellar Density",       unit: "g/cm³", tooltip: "Mean density of the host star. Can be estimated independently from transit shape, providing a consistency check on the stellar model." },
    ],
  },
  {
    id: "errors",
    label: "Measurement Uncertainties",
    tag: "03",
    description: "1σ upper and lower error bounds on stellar parameters",
    features: [
      { name: "teff_err1",   label: "Temp Error",        unit: "+σ K",  tooltip: "Upper 1σ uncertainty on the effective temperature measurement." },
      { name: "teff_err2",   label: "Temp Error",        unit: "−σ K",  tooltip: "Lower 1σ uncertainty on the effective temperature measurement. Typically a negative value." },
      { name: "logg_err1",   label: "Gravity Error",     unit: "+σ",    tooltip: "Upper 1σ uncertainty on surface gravity (log g)." },
      { name: "logg_err2",   label: "Gravity Error",     unit: "−σ",    tooltip: "Lower 1σ uncertainty on surface gravity. Typically a negative value." },
      { name: "feh_err1",    label: "Metallicity Error", unit: "+σ",    tooltip: "Upper 1σ uncertainty on [Fe/H] metallicity." },
      { name: "feh_err2",    label: "Metallicity Error", unit: "−σ",    tooltip: "Lower 1σ uncertainty on [Fe/H] metallicity. Typically a negative value." },
      { name: "mass_err1",   label: "Mass Error",        unit: "+σ M☉", tooltip: "Upper 1σ uncertainty on stellar mass." },
      { name: "mass_err2",   label: "Mass Error",        unit: "−σ M☉", tooltip: "Lower 1σ uncertainty on stellar mass. Typically a negative value." },
      { name: "radius_err1", label: "Radius Error",      unit: "+σ R☉", tooltip: "Upper 1σ uncertainty on stellar radius." },
      { name: "radius_err2", label: "Radius Error",      unit: "−σ R☉", tooltip: "Lower 1σ uncertainty on stellar radius. Typically a negative value." },
    ],
  },
];

export const StellerForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  return (
    <form className="sf-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {FEATURE_GROUPS.map((group, gi) => (
        <section key={group.id} className="sf-group" style={{ "--gi": gi }}>
          <div className="sf-group-head">
            <span className="sf-group-tag">{group.tag}</span>
            <div className="sf-group-meta">
              <h2 className="sf-group-title">{group.label}</h2>
              <p className="sf-group-desc">{group.description}</p>
            </div>
          </div>
          <div className="sf-fields">
            {group.features.map((f) => (
              <FeatureInput
                key={f.name}
                register={register}
                label={f.label}
                name={f.name}
                unit={f.unit}
                tooltip={f.tooltip}
              />
            ))}
          </div>
        </section>
      ))}

      <footer className="sf-footer">
        <button type="button" className="sf-btn-ghost" onClick={() => reset()} disabled={isSubmitting}>
          Clear all
        </button>
        <button type="submit" className="sf-btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <><span className="sf-spinner" /> Analyzing…</> : <>Run Classifier</>}
        </button>
      </footer>
    </form>
  );
};