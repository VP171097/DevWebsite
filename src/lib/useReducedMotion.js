import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** True when the visitor has asked the OS to reduce motion. */
export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(QUERY);
    const onChange = (e) => setReduced(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return reduced;
};

/** True on desktop-class pointers only (used to gate cursor / 3D effects). */
export const useIsDesktopPointer = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const onChange = (e) => setIsDesktop(e.matches);
    setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
};
