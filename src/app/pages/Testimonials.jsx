import React, { useState, useEffect } from "react";
import { MessageSquareQuote, Star, ChevronLeft, ChevronRight, Quote, Linkedin, Calendar, UserCheck } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import { useConfig } from "@/context/ConfigContext";

const Testimonials = () => {
  const { config, loading } = useConfig();
  const testimonialsConfig = config.testimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Long recommendations are clamped on small screens; collapse again when
  // moving to another one so each starts in the same compact state.
  useEffect(() => setExpanded(false), [currentIndex]);
  const itemCount = testimonialsConfig?.testimonials?.length || 0;

  useEffect(() => {
    if (itemCount <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % itemCount);
    }, 10000);
    return () => clearInterval(timer);
  }, [itemCount, currentIndex]);

  if (loading || !testimonialsConfig || !itemCount) {
    return null;
  }

  const items = testimonialsConfig.testimonials;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const current = items[currentIndex];

  return (
    <div id="testimonials" className="text-white scroll-mt-24">
      <MagicCard
        gradientSize={400}
        gradientFrom="#0ea5e9"
        gradientTo="#22d3ee"
        className="rounded-2xl glass xl:p-8 py-6 px-4"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 px-1">
          <div className="flex items-center">
            <div className="bg-sky-400 p-2 rounded-md mr-4 shadow-md shadow-sky-500/20">
              <MessageSquareQuote size={22} className="text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {testimonialsConfig.title || "LinkedIn Endorsements"}
                </h2>
                <span className="inline-flex items-center gap-1 bg-[#0A66C2]/20 border border-[#0A66C2]/40 text-[#70b5f9] text-[11px] font-bold px-2 py-0.5 rounded-full">
                  <Linkedin size={12} />
                  <span>Verified</span>
                </span>
              </div>
              <div className="bg-sky-400 w-16 h-1 rounded-sm mt-1"></div>
            </div>
          </div>

          {/* Slider Arrows & Counter */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-neutral-400 font-mono mr-1">
              {currentIndex + 1} / {items.length}
            </span>
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
              aria-label="Previous Endorsement"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition cursor-pointer"
              aria-label="Next Endorsement"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {testimonialsConfig.subtitle && (
          <p className="text-gray-400 text-xs md:text-sm mt-1 mb-6 px-1 leading-relaxed">
            {testimonialsConfig.subtitle}
          </p>
        )}

        {/* Featured Recommendation Card */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-neutral-950/90 border border-neutral-800 shadow-2xl overflow-hidden min-h-[300px] flex flex-col justify-between">
          <Quote
            size={72}
            className="absolute -top-2 -left-2 text-sky-500/10 pointer-events-none"
          />

          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Top metadata row */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                <UserCheck size={14} />
                <span>{current.context}</span>
              </div>

              {current.date && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                  <Calendar size={13} className="text-neutral-500" />
                  <span>{current.date}</span>
                </div>
              )}
            </div>

            {/* Recommendation Quote Content */}
            <div className="mb-4 sm:mb-6">
              <div
                className={`text-sm sm:text-base text-neutral-200 leading-relaxed font-normal space-y-3 whitespace-pre-line ${
                  expanded ? "" : "line-clamp-[10] sm:line-clamp-none"
                }`}
              >
                "{current.quote}"
              </div>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="sm:hidden mt-2 text-xs font-semibold text-sky-400 hover:text-sky-300 cursor-pointer"
              >
                {expanded ? "Show less" : "Read full recommendation"}
              </button>
            </div>

            {/* Author Profile Footer */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-neutral-800/80">
              <div className="flex items-center gap-3.5">
                <img
                  src={current.avatar}
                  alt={current.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-900 border border-sky-400/40 p-0.5 object-cover shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {current.name}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono">1st</span>
                  </div>
                  <p className="text-xs text-sky-300 font-medium">
                    {current.role}
                  </p>
                  {current.headline && (
                    <p className="text-[11px] text-neutral-400 line-clamp-1 max-w-lg mt-0.5">
                      {current.headline}
                    </p>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[#0A66C2] p-2 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/30">
                <Linkedin size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Dots / Chips */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 mt-5">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`px-3 py-1 text-xs rounded-lg transition-all cursor-pointer ${
                idx === currentIndex
                  ? "bg-sky-400 text-black font-bold shadow-md shadow-sky-400/20 scale-105"
                  : "bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700"
              }`}
              aria-label={`View endorsement by ${item.name}`}
            >
              {item.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </MagicCard>
    </div>
  );
};

export default Testimonials;
