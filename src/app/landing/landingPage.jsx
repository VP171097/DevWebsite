import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { motion } from "motion/react";
import SocialLinks from "@/components/layouts/socialLink";
import DataPipelineFlow from "@/components/ui/DataPipelineFlow";
import CountUp from "@/components/ui/CountUp";
import { useConfig } from "@/context/ConfigContext";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { Download, ArrowRight, BookOpen, ChevronDown } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const LandingPage = () => {
  const { config, loading } = useConfig();
  const landingConfig = config.landing;
  const reduced = usePrefersReducedMotion();

  if (loading || !landingConfig) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        Loading…
      </div>
    );
  }

  const notesUrl = `${import.meta.env.BASE_URL}?page=notes`;

  // Entrance sequence — deliberately fast; the page never feels like a wait.
  const seq = (delay) =>
    reduced
      ? { initial: false, animate: { opacity: 1, y: 0, scale: 1 } }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: EASE },
        };

  const headlineWords = ["Building", "Data", "Systems", "That", "Scale."];

  return (
    <section
      id="landing"
      className="relative min-h-[92vh] flex flex-col justify-center items-center px-5 sm:px-8 pt-16 pb-20 overflow-hidden section-fade"
      aria-label="Introduction"
    >
      {/* Ambient lighting */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
      >
        <div className="ambient-glow bg-sky-500/25 w-[520px] h-[520px] -top-40 -left-32" />
        <div className="ambient-glow bg-indigo-500/15 w-[420px] h-[420px] top-10 right-0" />
      </motion.div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
        {/* Eyebrow */}
        <motion.p
          {...seq(0.05)}
          className="eyebrow inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass whitespace-nowrap !text-[0.6rem] sm:!text-[0.7rem] !tracking-[0.18em] sm:!tracking-[0.28em]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          Data Engineer • Cloud • Big Data
        </motion.p>

        {/* Name */}
        <motion.p
          {...seq(0.12)}
          className="mt-7 text-sm sm:text-base font-semibold tracking-[0.32em] uppercase text-neutral-400"
        >
          {landingConfig.firstName} {landingConfig.lastName}
        </motion.p>

        {/* Headline — staggered word reveal */}
        <h1 className="mt-3 text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white">
          {headlineWords.map((word, i) => (
            <motion.span
              key={word}
              className="inline-block mr-[0.28em]"
              initial={reduced ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.08, ease: EASE }}
            >
              {i >= 3 ? (
                <span className="bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        {/* Supporting statement — real specializations from the resume */}
        <motion.p
          {...seq(0.55)}
          className="mt-6 mx-auto max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-400"
        >
          {landingConfig.summary}
        </motion.p>

        {/* Primary CTAs */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.68, ease: EASE }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <ScrollLink
            to="projects"
            smooth
            duration={600}
            offset={-88}
            tabIndex={0}
            className="btn-cine inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-sm font-bold shadow-lg shadow-sky-500/25 cursor-pointer"
          >
            <span>View My Work</span>
            <ArrowRight size={16} className="btn-arrow" />
          </ScrollLink>

          <a
            href={landingConfig.resumeLink}
            download="Vivek_Pandey_Senior_Data_Engineer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cine inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white text-sm font-semibold hover:border-sky-400/50"
          >
            <Download size={16} />
            <span>Download Resume</span>
          </a>

          <a
            href={notesUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cine inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sky-300 text-sm font-semibold hover:text-sky-200"
          >
            <BookOpen size={16} />
            <span>DE Cheat Sheets</span>
          </a>
        </motion.div>

        {/* Secondary links */}
        <motion.div
          {...seq(0.78)}
          className="mt-5 flex items-center justify-center gap-1"
        >
          <SocialLinks />
        </motion.div>

        {/* Focus technologies + accreditation badges */}
        <motion.div
          {...seq(0.86)}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <p className="font-mono text-[11px] sm:text-xs tracking-wide text-neutral-500">
            {landingConfig.title}
          </p>

          {Array.isArray(landingConfig.badges) && landingConfig.badges.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              {landingConfig.badges.map((badge, idx) => (
                <motion.img
                  key={idx}
                  src={badge.image}
                  alt={badge.name}
                  title={badge.name}
                  loading="lazy"
                  className="h-11 sm:h-12 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                  initial={reduced ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 0.9, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.9 + idx * 0.07, ease: EASE }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Real headline stats */}
        {Array.isArray(landingConfig.stats) && landingConfig.stats.length > 0 && (
          <motion.dl
            {...seq(1.0)}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto"
          >
            {landingConfig.stats.map((stat, idx) => (
              <div
                key={idx}
                className="card-cine glass rounded-xl px-3 py-4 flex flex-col items-center"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-base sm:text-xl font-bold text-sky-300">
                  <CountUp value={stat.value} />
                </dd>
                <span className="mt-1 text-[11px] text-neutral-400 text-center leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.dl>
        )}
      </div>

      {/* Data pipeline visualisation */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.15, ease: EASE }}
        className="relative z-0 w-full max-w-5xl mx-auto mt-12 hidden sm:block"
      >
        <DataPipelineFlow />
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-neutral-600"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1, y: reduced ? 0 : [0, 7, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.3 },
          y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
};

export default LandingPage;
