import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Animates only the numeric part of a real stat string (e.g. "6+ Years" -> 0..6).
 * Non-numeric values ("Multi-Cloud", "End-to-End") are rendered verbatim —
 * nothing is invented or padded.
 */
const CountUp = ({ value, duration = 1200, className = "" }) => {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const match = typeof value === "string" ? value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/s) : null;
  const target = match ? parseFloat(match[2]) : null;
  const [display, setDisplay] = useState(target === null || reduced ? target : 0);
  const started = useRef(false);

  useEffect(() => {
    if (target === null || reduced) {
      setDisplay(target);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDisplay(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const decimals = String(target).includes(".") ? 1 : 0;
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Number((target * eased).toFixed(decimals)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, reduced]);

  if (target === null) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {match[1]}
      {display}
      {match[3]}
    </span>
  );
};

export default CountUp;
