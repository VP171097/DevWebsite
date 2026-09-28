import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Briefcase, Download, CheckCircle2 } from "lucide-react";
import { useConfig } from "@/context/ConfigContext";
import { Reveal } from "@/components/ui/Reveal";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const HIGHLIGHT_KEYWORDS = [
  "Databricks Lakehouse",
  "Medallion Architecture",
  "PySpark",
  "Amazon Connect",
  "Unity Catalog",
  "Delta Lake",
  "Change Data Feed",
  "Kafka",
  "Azure Data Lake",
  "Azure SQL Server",
  "Azure Function Apps",
  "ETL",
  "AWS S3",
  "Databricks",
  "Python",
];

const renderHighlightedText = (text) => {
  let parts = [text];
  HIGHLIGHT_KEYWORDS.forEach((keyword) => {
    const next = [];
    parts.forEach((part) => {
      if (typeof part !== "string") {
        next.push(part);
        return;
      }
      part.split(new RegExp(`(${keyword})`, "gi")).forEach((sub, i) => {
        if (sub.toLowerCase() === keyword.toLowerCase()) {
          next.push(
            <span
              key={`${keyword}-${i}-${next.length}`}
              className="font-semibold text-sky-300"
            >
              {sub}
            </span>
          );
        } else if (sub) {
          next.push(sub);
        }
      });
    });
    parts = next;
  });
  return parts;
};

const Experience = () => {
  const { config, loading } = useConfig();
  const experienceConfig = config.experience;
  const reduced = usePrefersReducedMotion();
  const timelineRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 75%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (loading || !experienceConfig) {
    return <div className="text-white text-center py-6">Loading Experience…</div>;
  }

  const resumeLink = config.landing?.resumeLink || "/resume.pdf";

  return (
    <section
      id="experience"
      className="text-white scroll-mt-24"
      aria-labelledby="experience-heading"
    >
      <div className="glass rounded-2xl px-4 py-7 xl:px-8 xl:py-9">
        {/* Header */}
        <Reveal className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="eyebrow">Career</p>
            <div className="flex items-center gap-3 mt-3">
              <div className="bg-sky-400 p-2 rounded-md shadow-md shadow-sky-500/20">
                <Briefcase size={20} className="text-slate-950" />
              </div>
              <h2 id="experience-heading" className="text-2xl font-bold">
                {experienceConfig.title || "Experience"}
              </h2>
            </div>
          </div>

          <a
            href={resumeLink}
            download="Vivek_Pandey_Senior_Data_Engineer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cine hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg glass text-sky-300 text-xs font-semibold"
          >
            <Download size={14} />
            <span>Download Resume</span>
          </a>
        </Reveal>

        {/* Timeline */}
        <div ref={timelineRef} className="relative ml-2 sm:ml-4 pl-6 sm:pl-9 space-y-10">
          {/* Track + progressively drawn accent line */}
          <div className="absolute left-0 top-1 bottom-1 w-px bg-white/10" aria-hidden="true" />
          <motion.div
            aria-hidden="true"
            className="absolute left-0 top-1 bottom-1 w-px origin-top bg-gradient-to-b from-sky-400 via-sky-500 to-transparent"
            style={reduced ? { scaleY: 1 } : { scaleY: lineScale }}
          />

          {experienceConfig.experienceData.map((item, index) => (
            <Reveal key={index} delay={index * 0.05} className="relative group">
              {/* Node */}
              <span
                aria-hidden="true"
                className="absolute -left-[30px] sm:-left-[42px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-950 border border-sky-400/60 ring-4 ring-sky-500/10 transition-transform duration-300 group-hover:scale-125"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              </span>

              <div className="card-cine rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-sky-200 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[11px] font-semibold text-sky-300 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/25">
                    {item.duration}
                  </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3.5 mt-3 items-center">
                  {item.img && (
                    <img
                      src={item.img}
                      className="w-24 sm:w-28 h-9 sm:h-10 object-contain bg-white/5 border border-white/10 rounded-lg p-1.5"
                      alt={`${item.company} logo`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <p className="text-xs sm:text-sm font-medium text-neutral-300 border-l border-white/10 pl-3">
                    {item.company}
                  </p>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {item.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs md:text-sm text-neutral-400 leading-relaxed"
                    >
                      <CheckCircle2 size={14} className="text-sky-400/80 shrink-0 mt-0.5" />
                      <span>{renderHighlightedText(point)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
