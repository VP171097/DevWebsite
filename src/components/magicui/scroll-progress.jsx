"use client";

import React from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/** Hairline top progress bar reflecting scroll 0% → 100%. */
export const ScrollProgress = React.forwardRef(({ className, ...props }, ref) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-sky-500 via-sky-400 to-cyan-300",
        className
      )}
      style={{ scaleX }}
      {...props}
    />
  );
});

ScrollProgress.displayName = "ScrollProgress";
