import React, { useState, useMemo } from "react";
import { MagicCard } from "@/components/magicui/magic-card";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { useConfig } from "@/context/ConfigContext";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Cpu, Search, Sparkles, Star, Zap, CheckCircle2, Layers } from "lucide-react";

const INITIAL_VISIBLE = 12;

const SkillItemCard = ({ skill }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Gradient by category
  const getProgressColor = (proficiency) => {
    if (proficiency >= 90) return "from-amber-400 to-amber-300";
    if (proficiency >= 80) return "from-amber-500 to-amber-400";
    return "from-amber-600 to-amber-500";
  };

  return (
    <div
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="card-cine relative group bg-white/[0.03] border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col justify-between"
    >
      {/* Top row: Icon, Name, Level Badge */}
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="card-icon w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/[0.04] border border-white/10 p-1.5 flex items-center justify-center shrink-0">
            {skill.icon ? (
              <img
                src={skill.icon}
                alt={skill.name}
                className="w-full h-full object-contain"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <Cpu size={20} className="text-amber-400" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition leading-tight truncate">
              {skill.name}
            </h4>
            <span className="hidden sm:block text-[11px] text-neutral-500 font-medium">
              {skill.category}
            </span>
          </div>
        </div>

        {/* Level Badge */}
        <span
          className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
            skill.level === "Expert"
              ? "bg-amber-500/20 text-amber-200 border-amber-400/50"
              : skill.level === "Advanced"
              ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
              : "bg-white/5 text-neutral-300 border-white/15"
          }`}
        >
          {skill.level || "Proficient"}
        </span>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="mt-1.5 sm:mt-2">
        <div className="hidden sm:flex justify-between items-center text-xs mb-1">
          <span className="text-neutral-400 text-[11px]">
            {skill.experience || "Enterprise Delivery"}
          </span>
          <span className="text-amber-400 font-bold text-xs">
            {skill.proficiency || 88}%
          </span>
        </div>

        <div className="w-full h-1 sm:h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(
              skill.proficiency || 88
            )} transition-all duration-700 ease-out`}
            style={{ width: `${skill.proficiency || 88}%` }}
          />
        </div>
      </div>

      {/* Floating Detailed Hover Tooltip */}
      {showTooltip && skill.useCase && (
        <div className="absolute left-1/2 -bottom-2 translate-y-full -translate-x-1/2 w-56 max-w-[80vw] p-3 bg-neutral-950/98 backdrop-blur-xl border border-amber-400/50 rounded-xl shadow-2xl z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1 border-b border-neutral-800 pb-1">
            <Zap size={13} className="text-amber-400" />
            <span>{skill.name} • {skill.experience || "Production"}</span>
          </div>
          <p className="text-[11px] text-neutral-300 leading-snug">
            {skill.useCase}
          </p>
        </div>
      )}
    </div>
  );
};

const SkillsSection = () => {
  const { config, loading } = useConfig();
  const skillsConfig = config.skills;

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const categories = useMemo(() => {
    if (!skillsConfig?.categories) return ["All"];
    return ["All", ...skillsConfig.categories.map((c) => c.category)];
  }, [skillsConfig]);

  const allSkills = useMemo(() => {
    if (!skillsConfig?.technicalSkills) return [];
    return skillsConfig.technicalSkills;
  }, [skillsConfig]);

  const filteredSkills = useMemo(() => {
    return allSkills.filter((skill) => {
      const matchesCategory =
        activeTab === "All" || skill.category === activeTab;

      const matchesSearch =
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.useCase?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allSkills, activeTab, searchQuery]);

  const isCollapsible = filteredSkills.length > INITIAL_VISIBLE;

  if (loading || !skillsConfig) {
    return <div className="text-white text-center py-6">Loading Skills...</div>;
  }

  return (
    <div className="text-white">
      <MagicCard
        gradientSize={400}
        gradientFrom="#d97706"
        gradientTo="#fbbf24"
        className="rounded-2xl glass xl:p-8 py-6 px-4"
      >
        {/* Section Header */}
        <Reveal className="px-1">
          <p className="eyebrow">{skillsConfig.sectionTitle || "My Expertise"}</p>
          <div className="flex items-center gap-3 mt-3 mb-2">
            <div className="bg-amber-400 p-2 rounded-md shadow-md shadow-amber-500/20">
              <Layers size={20} className="text-slate-950" />
            </div>
            <h2 className="text-2xl font-bold">
              {skillsConfig.headline || "Technical & Data Engineering"}
            </h2>
          </div>

          <p className="text-neutral-400 text-xs md:text-sm mt-2 mb-6 leading-relaxed max-w-2xl">
            {skillsConfig.description}
          </p>
        </Reveal>

        {/* Filter Controls: Category Tabs + Search Input */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-1">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const isSelected = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                      : "bg-white/[0.04] text-neutral-300 border border-white/10 hover:border-amber-400/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-56">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search skill / tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-900/90 border border-neutral-700 focus:border-amber-400 rounded-lg text-white placeholder-neutral-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Skills Grid with Animated Cards */}
        {filteredSkills.length > 0 ? (
          <>
            <RevealGroup className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
              {(isCollapsible && !showAll
                ? filteredSkills.slice(0, INITIAL_VISIBLE)
                : filteredSkills
              ).map((skill, idx) => (
                <RevealItem key={idx}>
                  <SkillItemCard skill={skill} />
                </RevealItem>
              ))}
            </RevealGroup>

            {isCollapsible && (
              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="btn-cine px-4 py-1.5 rounded-lg text-xs font-semibold glass text-neutral-300 hover:text-amber-300 cursor-pointer"
                >
                  {showAll ? "Show less" : `Show all ${filteredSkills.length} skills`}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-neutral-400 text-sm">
            No matching skills found for "{searchQuery}".
          </div>
        )}
      </MagicCard>
    </div>
  );
};

export default SkillsSection;
