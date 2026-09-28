import React from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Scroll-triggered reveal wrapper.
 * Uses Framer Motion's whileInView (IntersectionObserver under the hood),
 * and degrades to a plain container when the user prefers reduced motion.
 */
export const Reveal = ({
  children,
  as: Tag = "div",
  delay = 0,
  y = 40,
  duration = 0.6,
  className = "",
  once = true,
  ...rest
}) => {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[Tag] || motion.div;

  if (reduced) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: "0px 0px -80px 0px" }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

/** Parent that staggers its RevealItem children as one group. */
export const RevealGroup = ({
  children,
  className = "",
  stagger = 0.08,
  delay = 0,
  once = true,
  ...rest
}) => {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.1, margin: "0px 0px -60px 0px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export const RevealItem = ({ children, className = "", y = 24, ...rest }) => {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;
