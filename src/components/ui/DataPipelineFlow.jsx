import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Ambient data-pipeline visual for the hero.
 *
 * A single packet travels the whole path; as it arrives at a stage, that
 * stage's official product logo fades in and its node lights up, then it
 * settles back once the packet moves on. The stages reflect the real stack:
 * Sources -> Ingestion -> Data Lake -> Databricks -> Delta Lake -> Analytics
 */

const BASE = import.meta.env.BASE_URL.replace(/^\.\//, "/");
const logo = (file) => `${BASE}assets/skills/${file}`;

const NODES = [
  { id: "src", label: "Sources", x: 60, y: 120, logo: logo("kafka.svg"), alt: "Kafka" },
  { id: "ing", label: "Ingestion", x: 240, y: 60, logo: logo("pyspark.png"), alt: "PySpark" },
  { id: "lake", label: "Data Lake", x: 420, y: 140, logo: logo("dataLake.png"), alt: "Azure Data Lake" },
  { id: "dbx", label: "Databricks", x: 600, y: 70, logo: logo("databricks.png"), alt: "Databricks" },
  { id: "delta", label: "Delta Lake", x: 780, y: 150, logo: logo("databricks_lakehouse.png"), alt: "Delta Lake" },
  { id: "bi", label: "Analytics", x: 950, y: 90, logo: logo("sql.svg"), alt: "SQL analytics" },
];

/** One continuous curve through every node, so the packet never jumps. */
const PATH_D = NODES.reduce((d, node, i) => {
  if (i === 0) return `M ${node.x} ${node.y}`;
  const prev = NODES[i - 1];
  const midX = (prev.x + node.x) / 2;
  return `${d} C ${midX} ${prev.y}, ${midX} ${node.y}, ${node.x} ${node.y}`;
}, "");

const LOOP_MS = 14000;       // one full traverse
const ARRIVAL_RADIUS = 46;   // how close the packet must be to "arrive"

const DataPipelineFlow = ({ className = "" }) => {
  const reduced = usePrefersReducedMotion();
  const pathRef = useRef(null);
  const packetRef = useRef(null);
  const frameRef = useRef(0);
  const [activeId, setActiveId] = useState(null);

  // Distance along the path at which each node sits, so arrival can be
  // detected by path position rather than by straight-line distance.
  const [nodeAt, setNodeAt] = useState([]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const SAMPLES = 400;
    const positions = NODES.map((n) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i <= SAMPLES; i += 1) {
        const len = (i / SAMPLES) * total;
        const pt = path.getPointAtLength(len);
        const dist = (pt.x - n.x) ** 2 + (pt.y - n.y) ** 2;
        if (dist < bestDist) {
          bestDist = dist;
          best = len;
        }
      }
      return best;
    });
    setNodeAt(positions);
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const packet = packetRef.current;
    if (!path || !packet || reduced || nodeAt.length === 0) return;

    const total = path.getTotalLength();
    let start = null;

    const step = (ts) => {
      if (start === null) start = ts;
      const progress = ((ts - start) % LOOP_MS) / LOOP_MS;
      const len = progress * total;
      const pt = path.getPointAtLength(len);
      packet.setAttribute("transform", `translate(${pt.x} ${pt.y})`);

      let arrived = null;
      for (let i = 0; i < nodeAt.length; i += 1) {
        if (Math.abs(len - nodeAt[i]) < ARRIVAL_RADIUS) {
          arrived = NODES[i].id;
          break;
        }
      }
      setActiveId((prev) => (prev === arrived ? prev : arrived));

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [reduced, nodeAt]);

  // With reduced motion the packet is parked and every logo is simply shown.
  const showAll = reduced;

  const edges = useMemo(
    () =>
      NODES.slice(1).map((node, i) => {
        const prev = NODES[i];
        const midX = (prev.x + node.x) / 2;
        return `M ${prev.x} ${prev.y} C ${midX} ${prev.y}, ${midX} ${node.y}, ${node.x} ${node.y}`;
      }),
    []
  );

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
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
          <radialGradient id="packetGlow">
            <stop offset="0%" stopColor="rgba(125,211,252,0.9)" />
            <stop offset="100%" stopColor="rgba(125,211,252,0)" />
          </radialGradient>
        </defs>

        {/* The measured path drives the packet; it is not drawn. */}
        <path ref={pathRef} d={PATH_D} stroke="none" fill="none" />

        {edges.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="url(#pipeLine)"
            strokeWidth="1.6"
            strokeDasharray="5 7"
            fill="none"
          />
        ))}

        {NODES.map((n) => {
          const active = showAll || activeId === n.id;
          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r="26"
                fill="url(#nodeGlow)"
                style={{
                  opacity: active ? 1 : 0.35,
                  transition: "opacity 400ms ease",
                }}
              />

              {/* Official product logo, revealed as the packet arrives */}
              <image
                href={n.logo}
                x={n.x - 13}
                y={n.y - 13}
                width="26"
                height="26"
                preserveAspectRatio="xMidYMid meet"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "scale(1)" : "scale(0.7)",
                  transformOrigin: `${n.x}px ${n.y}px`,
                  transition: "opacity 320ms ease, transform 320ms cubic-bezier(0.22,1,0.36,1)",
                }}
              />

              {/* Dot shown while the stage is idle, hidden behind the logo */}
              <circle
                cx={n.x}
                cy={n.y}
                r="4.5"
                fill="#38bdf8"
                style={{
                  opacity: active ? 0 : 0.85,
                  transition: "opacity 320ms ease",
                }}
              />

              <circle
                cx={n.x}
                cy={n.y}
                r="17"
                fill="none"
                stroke="rgba(56,189,248,0.55)"
                strokeWidth="1"
                style={{
                  opacity: active ? 1 : 0,
                  transition: "opacity 400ms ease",
                }}
              />

              <text
                x={n.x}
                y={n.y + 42}
                textAnchor="middle"
                fontSize="11"
                letterSpacing="1.6"
                fill={active ? "rgba(186,230,253,0.95)" : "rgba(148,163,184,0.65)"}
                style={{ transition: "fill 400ms ease" }}
              >
                {n.label.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* The travelling packet */}
        {!reduced && (
          <g ref={packetRef}>
            <circle r="13" fill="url(#packetGlow)" />
            <circle r="5.5" fill="#f8fafc" />
            <circle r="9" fill="none" stroke="rgba(248,250,252,0.7)" strokeWidth="1.2" />
          </g>
        )}
      </svg>
    </div>
  );
};

export default DataPipelineFlow;
