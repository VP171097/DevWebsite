import React from "react";

/**
 * Pure-CSS ambient backdrop: near-black base, soft radial gradients and a faint
 * masked grid. No canvas, no per-frame JS — content always dominates.
 */
const CinematicBackground = () => (
  <>
    <div className="cinematic-bg" aria-hidden="true" />
    <div className="cinematic-grid" aria-hidden="true" />
  </>
);

export default CinematicBackground;
