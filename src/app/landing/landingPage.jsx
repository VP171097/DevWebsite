import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import DataPipelineFlow from "@/components/ui/DataPipelineFlow";
import { AuroraText } from "@/components/magicui/aurora-text";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { Particles } from "@/components/magicui/particles";
import { Scrollui } from "@/components/ui/scrollui";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import SocialLinks from "@/components/layouts/socialLink";
import { useConfig } from "@/context/ConfigContext";
import { Download, Sparkles, BookOpen, Terminal, Database } from "lucide-react";

const LandingPage = () => {
  const { config, loading } = useConfig();
  const landingConfig = config.landing;

  const roles = landingConfig?.roles || [
    "Senior Data Engineer",
    "Databricks Data Engineer",
    "Real-Time Streaming Engineer",
    "Cloud ETL & Pipeline Automation Expert"
  ];

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [roles.length]);

  if (loading || !landingConfig) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        Loading Showcase...
      </div>
    );
  }

  const notesUrl = `${import.meta.env.BASE_URL}?page=notes`;

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 sm:px-8 overflow-hidden pt-8 pb-16">
      {/* Background Particles */}
      <Particles
        className="fixed inset-0 w-full h-full -z-10"
        quantity={180}
        ease={40}
        refresh
      />

      {/* Top Engineering Badge */}
      <div className="z-10 mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-500/30 text-amber-500 dark:text-amber-300 text-xs sm:text-sm font-semibold tracking-wide shadow-lg backdrop-blur-md animate-pulse">
        <Database size={15} className="text-amber-500 dark:text-amber-400" />
        <span>Enterprise Data Engineering &amp; Cloud Lakehouse</span>
      </div>

      {/* Hero Name Header */}
      <div className="z-10 mb-3 max-w-5xl">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">
          {landingConfig.firstName}{" "}
          <AuroraText>{landingConfig.lastName}</AuroraText>
        </h1>

        {/* Dynamic Role Tagline */}
        <div className="h-10 sm:h-12 flex items-center justify-center mt-3 mb-2">
          <div className="hero-role-text inline-flex items-center gap-2 text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-amber-600 to-amber-700 dark:from-gray-200 dark:via-amber-200 dark:to-amber-400 bg-clip-text text-transparent transition-all duration-500">
            <Terminal size={22} className="text-amber-500 dark:text-amber-400 inline shrink-0" />
            <span>{roles[currentRoleIndex]}</span>
          </div>
        </div>

        {/* Subtitle / Focus technologies */}
        <TypingAnimation className="text-xs sm:text-sm md:text-base text-neutral-700 dark:text-gray-300 font-mono max-w-2xl mx-auto px-4 leading-relaxed font-semibold">
          {landingConfig.title}
        </TypingAnimation>

        {/* Professional Credential Badges */}
        {Array.isArray(landingConfig.badges) && landingConfig.badges.length > 0 && (
          <div className="z-10 mt-3 flex items-center justify-center gap-3">
            {landingConfig.badges.map((badge, idx) => (
              <a
                key={idx}
                href={badge.link || "#"}
                target={badge.link ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center transition-all duration-300 hover:scale-115 cursor-pointer drop-shadow-md hover:drop-shadow-lg"
                title={badge.name}
              >
                <img
                  src={badge.image}
                  alt={badge.name}
                  className="h-10 sm:h-12 w-auto object-contain"
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Executive Quick Stats Banner */}
      {Array.isArray(landingConfig.stats) && landingConfig.stats.length > 0 && (
        <div className="z-10 my-6 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-4xl w-full px-2">
          {landingConfig.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-xl bg-white/90 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md shadow-md flex flex-col items-center justify-center hover:border-amber-400/50 transition-colors"
            >
              <span className="text-lg sm:text-2xl font-black text-amber-500 dark:text-amber-400">
                {stat.value}
              </span>
              <span className="text-[11px] sm:text-xs text-neutral-700 dark:text-neutral-300 font-medium mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
        <ShimmerButton
          onClick={() => {
            // Force the saved filename regardless of the served path.
            const a = document.createElement("a");
            a.href = landingConfig.resumeLink;
            a.download = "Vivek_Pandey_Senior_Data_Engineer.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
          }}
          className="resume-cta flex items-center gap-2 font-bold px-6 py-3"
        >
          <Download size={16} />
          <span>Download Resume (PDF)</span>
        </ShimmerButton>

        <ScrollLink
          to="projects"
          smooth={true}
          duration={500}
          offset={-80}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900/90 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 hover:border-amber-400 text-neutral-900 dark:text-white text-sm font-semibold cursor-pointer transition-all shadow-md hover:scale-105"
        >
          <Sparkles size={16} className="text-amber-500 dark:text-amber-400" />
          <span>Explore Projects</span>
        </ScrollLink>

        {/* Dedicated DE Notes button opening in a new tab */}
        <a
          href={notesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-700 dark:text-amber-300 text-sm font-semibold transition-all shadow-md hover:scale-105"
        >
          <BookOpen size={16} className="text-amber-500 dark:text-amber-400" />
          <span>Data Engineering Cheat Sheets</span>
        </a>
      </div>

      {/* Social Icons (Mobile) */}
      <div className="z-10 mt-2 flex gap-6 xl:hidden">
        <SocialLinks />
      </div>

      {/* Social Icons (Desktop Floating Dock) */}
      <div className="hidden xl:flex flex-col gap-2 absolute top-1/2 right-4 2xl:right-8 -translate-y-1/2 z-20 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md p-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl">
        <SocialLinks />
      </div>

      {/* Scroll Down UI */}
      <div className="absolute bottom-4 z-20">
        <Scrollui />
      </div>

      {/* Animated data pipeline: Sources -> Ingestion -> Data Lake ->
          Databricks -> Delta Lake -> Analytics */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 opacity-90">
        <DataPipelineFlow />
      </div>
    </div>
  );
};

export default LandingPage;
