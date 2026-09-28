import React, { useState } from "react";
import { Workflow } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * "How I Build Data" — an interactive reference architecture assembled ONLY
 * from technologies that appear in the resume/config (Kafka, Amazon Connect
 * JSON on S3, Azure Data Lake, Auto Loader, Databricks, PySpark, Delta Lake
 * Medallion tiers, Unity Catalog, Azure SQL / Cosmos DB, reporting).
 */
const STAGES = [
  {
    id: "sources",
    title: "Sources",
    caption: "Where the data originates",
    nodes: ["Kafka Sensor Streams", "Amazon Connect JSON", "Files & APIs", "Azure SQL Server"],
    detail:
      "Real-time sensor events over Kafka, ~200K Amazon Connect call-transcript JSON files per day, plus relational and file-based enterprise sources.",
  },
  {
    id: "ingest",
    title: "Ingestion",
    caption: "Landing raw data reliably",
    nodes: ["Databricks Auto Loader", "PySpark Structured Streaming", "Azure Function Apps"],
    detail:
      "Auto Loader for incremental file discovery, PySpark Structured Streaming for continuous ingestion, and Azure Function Apps for scheduled batch pulls.",
  },
  {
    id: "storage",
    title: "Data Lake",
    caption: "Cloud storage layer",
    nodes: ["Azure Data Lake (ADLS Gen2)", "AWS S3", "Azure Key Vault"],
    detail:
      "Hierarchical-namespace ADLS Gen2 and multi-region S3 buckets as the raw landing zone, with credentials held in Azure Key Vault / Databricks secret scopes.",
  },
  {
    id: "process",
    title: "Processing",
    caption: "Databricks compute",
    nodes: ["Databricks", "PySpark", "Change Data Feed", "Python"],
    detail:
      "Databricks clusters running PySpark transformations, with Delta Change Data Feed and version watermarking driving incremental, idempotent downstream sync.",
  },
  {
    id: "medallion",
    title: "Medallion Lakehouse",
    caption: "Bronze → Silver → Gold",
    nodes: ["Bronze — raw ingest", "Silver — cleaned & conformed", "Gold — business aggregates"],
    detail:
      "Three-tier Delta Lake Medallion architecture: Bronze raw capture, Silver cleansing and schema-drift handling, Gold business aggregations ready for analysis.",
  },
  {
    id: "serve",
    title: "Governance & Serving",
    caption: "Trusted, queryable output",
    nodes: ["Unity Catalog", "Azure SQL Server", "Azure Cosmos DB", "Reporting & Analytics"],
    detail:
      "Unity Catalog for centralised access control and lineage, with curated Gold data served to Azure SQL, Cosmos DB, and downstream reporting and analytics.",
  },
];

const Architecture = () => {
  const [active, setActive] = useState(null);
  const reduced = usePrefersReducedMotion();

  const isDimmed = (id) => active !== null && active !== id;

  return (
    <section
      id="architecture"
      className="scroll-mt-24 text-white"
      aria-labelledby="architecture-heading"
    >
      <div className="glass rounded-2xl px-4 py-5 sm:py-7 xl:px-8 xl:py-9">
        <Reveal>
          <p className="eyebrow">Reference Architecture</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-sky-400 p-2 rounded-md shadow-md shadow-sky-500/20">
              <Workflow size={20} className="text-slate-950" />
            </div>
            <h2 id="architecture-heading" className="text-2xl font-bold">
              How I Build Data
            </h2>
          </div>
          <p className="text-neutral-400 text-xs md:text-sm mt-3 max-w-2xl leading-relaxed">
            The end-to-end shape of the pipelines I build in production — from raw
            enterprise sources through a Databricks Medallion lakehouse to governed,
            queryable analytics. Hover a stage to focus it.
          </p>
        </Reveal>

        <RevealGroup className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-3.5">
          {STAGES.map((stage, idx) => (
            <RevealItem key={stage.id}>
              <div
                role="group"
                tabIndex={0}
                aria-label={`${stage.title}: ${stage.detail}`}
                onMouseEnter={() => !reduced && setActive(stage.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(stage.id)}
                onBlur={() => setActive(null)}
                className={`card-cine cursor-target relative h-full rounded-xl border p-4 flex flex-col ${
                  active === stage.id
                    ? "border-sky-400/60 bg-sky-500/[0.07]"
                    : "border-white/10 bg-white/[0.03]"
                } ${isDimmed(stage.id) ? "opacity-45" : "opacity-100"} transition-opacity duration-300`}
              >
                {/* Stage index + connector */}
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-[10px] font-mono font-bold text-sky-400/80">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-sky-400/40 to-transparent" />
                </div>

                <h3 className="text-sm font-bold text-white">{stage.title}</h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">{stage.caption}</p>

                <ul className="mt-3 space-y-1.5">
                  {stage.nodes.map((node) => (
                    <li
                      key={node}
                      className="flex items-start gap-2 text-[11px] text-neutral-300"
                    >
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-sky-400 shrink-0" />
                      <span>{node}</span>
                    </li>
                  ))}
                </ul>

                {/* Tooltip-style detail on focus/hover */}
                <p
                  className={`mt-3 pt-3 border-t border-white/10 text-[11px] leading-snug text-neutral-400 transition-all duration-300 ${
                    active === stage.id
                      ? "opacity-100 max-h-40"
                      : "opacity-0 max-h-0 overflow-hidden border-transparent pt-0 mt-0"
                  }`}
                >
                  {stage.detail}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
};

export default Architecture;
