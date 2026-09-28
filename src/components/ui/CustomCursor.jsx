import React, { useEffect, useRef } from "react";
import { usePrefersReducedMotion, useIsDesktopPointer } from "@/lib/useReducedMotion";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, .cursor-target';

/**
 * Desktop-only decorative cursor: a small dot plus a ring that expands over
 * interactive elements. Purely visual — the native cursor and keyboard
 * navigation are untouched.
 */
const CustomCursor = () => {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktopPointer();
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!isDesktop || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let frame;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      const target = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      ring.classList.toggle("is-active", Boolean(target));
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [isDesktop, reduced]);

  if (!isDesktop || reduced) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
