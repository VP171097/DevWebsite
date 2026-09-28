import React from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Subtle, ambient data-pipeline visual for the hero.
 * Nodes reflect the real stack used across Vivek's pipelines:
 * Sources -> Ingestion -> Data Lake -> Databricks -> Delta Lake -> Analytics
 */
const NODES = [
  { id: "src", label: "Sources", x: 60, y: 120 },
  { id: "ing", label: "Ingestion", x: 240, y: 60 },
  { id: "lake", label: "Data Lake", x: 420, y: 140 },
  { id: "dbx", label: "Databricks", x: 600, y: 70 },
  { id: "delta", label: "Delta Lake", x: 780, y: 150 },
  { id: "bi", label: "Analytics", x: 950, y: 90 },
];

const EDGES = [
  ["src", "ing"],
  ["ing", "lake"],
  ["lake", "dbx"],
  ["dbx", "delta"],
  ["delta", "bi"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

const DataPipelineFlow = ({ className = "" }) => {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1020 210"
        className="w-full h-auto"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="pipeLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(56,189,248,0.05)" />
            <stop offset="50%" stopColor="rgba(56,189,248,0.45)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.05)" />
          </linearGradient>
          <radialGradient id="nodeGlow">
            <stop offset="0%" stopColor="rgba(56,189,248,0.35)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0)" />
          </radialGradient>
        </defs>

        {EDGES.map(([a, b], i) => {
          const from = byId[a];
          const to = byId[b];
          const midX = (from.x + to.x) / 2;
          const d = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
          return (
            <g key={`${a}-${b}`}>
              <path d={d} stroke="url(#pipeLine)" strokeWidth="1.2" />
              {!reduced && (
                <path
                  d={d}
                  stroke="rgba(56,189,248,0.85)"
                  strokeWidth="1.6"
                  className="flow-line"
                  style={{ animationDelay: `${i * -2.4}s` }}
                />
              )}
            </g>
          );
        })}

        {NODES.map((n, i) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="26" fill="url(#nodeGlow)" />
            {reduced ? (
              <circle
                cx={n.x}
                cy={n.y}
                r="5"
                fill="#38bdf8"
                stroke="rgba(56,189,248,0.4)"
                strokeWidth="6"
              />
            ) : (
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="5"
                fill="#38bdf8"
                stroke="rgba(56,189,248,0.35)"
                strokeWidth="6"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0.55, 1, 0.55], scale: 1 }}
                transition={{
                  opacity: {
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  },
                  scale: { duration: 0.6, delay: 0.9 + i * 0.08, ease: [0.22, 1, 0.36, 1] },
                }}
              />
            )}
            <text
              x={n.x}
              y={n.y + 30}
              textAnchor="middle"
              className="fill-neutral-500"
              style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default DataPipelineFlow;
