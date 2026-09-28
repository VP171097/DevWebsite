import React from "react";
import { useConfig } from "@/context/ConfigContext";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import CountUp from "@/components/ui/CountUp";
import { Zap, Server, Sparkles, CheckCircle } from "lucide-react";

const statIcons = [Zap, Server, Sparkles, CheckCircle];

const About = () => {
  const { config, loading } = useConfig();
  const aboutConfig = config.about;

  if (loading || !aboutConfig) {
    return <section className="text-white px-6 py-8">Loading About…</section>;
  }

  // Split the first paragraph around the configured phrase so it can carry the
  // pointer highlight; falls back to the plain paragraph when it is absent.
  const [beforeHighlight, afterHighlight] =
    aboutConfig.highlight && aboutConfig.description1?.includes(aboutConfig.highlight)
      ? aboutConfig.description1.split(aboutConfig.highlight)
      : [aboutConfig.description1 || "", ""];

  return (
    <section
      id="about"
      className="scroll-mt-24 relative"
      aria-labelledby="about-heading"
    >
      {/* Subtle animated grid backdrop, scoped to this section */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-2xl opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, #000, transparent)",
        }}
      />

      <div className="glass rounded-2xl px-4 py-7 xl:px-8 xl:py-9">
        <div className="grid grid-cols-1 gap-8 items-start">
          {/* ---- Left: professional intro ---- */}
          <div>
            <Reveal>
              <p className="eyebrow">Profile</p>
              <h2
                id="about-heading"
                className="text-2xl md:text-3xl font-bold text-white mt-3"
              >
                {aboutConfig.title}
              </h2>
              <div className="bg-amber-400 w-14 h-[3px] rounded-sm mt-3" />
            </Reveal>

            <Reveal delay={0.08} className="mt-5">
              <p className="text-neutral-300 text-sm leading-relaxed">
                {beforeHighlight}
                {afterHighlight !== "" && (
                  <span className="inline-flex mx-1">
                    <PointerHighlight
                      rectangleClassName="bg-muted rounded-lg dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                      pointerClassName="text-amber-500"
                    >
                      <span className="relative z-10 text-amber-300 text-sm md:text-base font-bold px-2 py-1">
                        {aboutConfig.highlight}
                      </span>
                    </PointerHighlight>
                  </span>
                )}
                {afterHighlight}
              </p>
            </Reveal>

            <Reveal delay={0.14} className="mt-4">
              <p className="text-neutral-400 text-sm leading-relaxed">
                {aboutConfig.description2}
              </p>
            </Reveal>

            {/* Real metrics */}
            {Array.isArray(aboutConfig.stats) && aboutConfig.stats.length > 0 && (
              <RevealGroup className="grid grid-cols-2 gap-3 mt-7 pt-6 border-t border-white/10">
                {aboutConfig.stats.map((stat, idx) => {
                  const Icon = statIcons[idx % statIcons.length];
                  return (
                    <RevealItem key={idx}>
                      <div className="card-cine h-full rounded-xl border border-white/10 bg-white/[0.03] p-3.5 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm sm:text-base font-bold text-amber-300 leading-tight">
                            <CountUp value={stat.value} />
                          </span>
                          <span className="card-icon p-1.5 rounded-lg bg-amber-400/10 text-amber-400">
                            <Icon size={13} />
                          </span>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold text-white leading-tight">
                            {stat.label}
                          </p>
                          {stat.sub && (
                            <p className="text-[10px] text-neutral-500 mt-0.5 leading-tight">
                              {stat.sub}
                            </p>
                          )}
                        </div>
                      </div>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
