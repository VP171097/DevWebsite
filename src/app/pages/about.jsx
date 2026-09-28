import React from "react";
import { motion } from "motion/react";
import { useConfig } from "@/context/ConfigContext";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";
import { Zap, Server, Sparkles, CheckCircle, MapPin, BadgeCheck } from "lucide-react";

const statIcons = [Zap, Server, Sparkles, CheckCircle];

const About = () => {
  const { config, loading } = useConfig();
  const aboutConfig = config.about;
  const sidebarConfig = config.sidebar;
  const skillsConfig = config.skills;
  const reduced = usePrefersReducedMotion();

  if (loading || !aboutConfig) {
    return <section className="text-white px-6 py-8">Loading About…</section>;
  }

  // Top skill signals, taken straight from the real skills config.
  const topSkills = (skillsConfig?.technicalSkills || [])
    .slice()
    .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
    .slice(0, 6);

  const location = sidebarConfig?.contacts?.find((c) => c.type === "location")?.value;

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
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 items-start">
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
              <div className="bg-sky-400 w-14 h-[3px] rounded-sm mt-3" />
            </Reveal>

            <Reveal delay={0.08} className="mt-5">
              <p className="text-neutral-300 text-sm leading-relaxed">
                {aboutConfig.description1}
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
                          <span className="text-sm sm:text-base font-bold text-sky-300 leading-tight">
                            <CountUp value={stat.value} />
                          </span>
                          <span className="card-icon p-1.5 rounded-lg bg-sky-400/10 text-sky-400">
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

          {/* ---- Right: data engineer profile card ---- */}
          <motion.aside
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-2xl p-5 relative overflow-hidden"
            aria-label="Data engineer profile"
          >
            <div className="ambient-glow bg-sky-500/25 w-56 h-56 -top-24 -right-16" />

            <div className="relative flex items-center gap-4">
              {sidebarConfig?.avatar && (
                <div className="relative shrink-0">
                  <img
                    src={sidebarConfig.avatar}
                    alt={`${sidebarConfig.name} portrait`}
                    loading="lazy"
                    className="w-16 h-16 rounded-2xl object-cover border border-white/15 shadow-lg shadow-sky-500/10 transition-transform duration-300 hover:scale-105"
                  />
                  <span className="absolute -inset-1 rounded-2xl ring-1 ring-sky-400/25 pointer-events-none" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-base font-bold text-white truncate">
                  {sidebarConfig?.name}
                </p>
                <p className="text-[11px] text-neutral-400 leading-snug mt-0.5">
                  {sidebarConfig?.role}
                </p>
              </div>
            </div>

            <div className="relative mt-4 space-y-2">
              {sidebarConfig?.status && (
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-emerald-300">
                  <BadgeCheck size={13} />
                  {sidebarConfig.status}
                </p>
              )}
              {location && (
                <p className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <MapPin size={13} className="text-sky-400" />
                  {location}
                </p>
              )}
            </div>

            {/* Skill signal bars, from real proficiency data */}
            {topSkills.length > 0 && (
              <RevealGroup className="relative mt-5 pt-4 border-t border-white/10 space-y-2.5">
                {topSkills.map((skill) => (
                  <RevealItem key={skill.name} y={12}>
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-neutral-200 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-sky-400 font-mono">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-300"
                          initial={reduced ? false : { width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true, amount: 0.6 }}
                          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          style={reduced ? { width: `${skill.proficiency}%` } : undefined}
                        />
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            )}
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default About;
