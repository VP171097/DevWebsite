import React, { useState, useMemo } from "react";
import {
  Award,
  BadgeCheck,
  Trophy,
  ExternalLink,
  Eye,
  Download,
  Sparkles,
  Search,
  LayoutGrid,
  GitCommit,
  Maximize2,
  Minimize2,
  Calendar,
  Building2,
  CheckCircle2,
  Layers,
  X,
} from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import { useConfig } from "@/context/ConfigContext";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const MOBILE_VISIBLE_ITEMS = 3;

const getAssetHref = (path) => {
  if (!path) return "#";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:"))
    return path;
  if (path.startsWith(import.meta.env.BASE_URL)) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${clean}`;
};

const Achievements = () => {
  const { config, loading } = useConfig();
  const achievementsConfig = config.achievements || config.certifications;

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'timeline'
  const [showAllItems, setShowAllItems] = useState(false);
  const [activeEmbedModal, setActiveEmbedModal] = useState(null); // For fullscreen Accredible embed modal
  const [expandedEmbeds, setExpandedEmbeds] = useState({}); // { [id]: boolean }

  const toggleEmbed = (id) => {
    setExpandedEmbeds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = achievementsConfig?.categories || [
    { id: "all", label: "All Achievements" },
    { id: "databricks", label: "Databricks Accredited" },
    { id: "courses", label: "Certifications & Courses" },
    { id: "awards", label: "Awards & Honors" },
  ];

  const items = useMemo(() => {
    if (!achievementsConfig?.items) return [];
    return achievementsConfig.items;
  }, [achievementsConfig]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchSearch =
        searchQuery === "" ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.issuer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [items, activeCategory, searchQuery]);

  if (loading || !achievementsConfig) {
    return (
      <div className="text-white text-center py-12">
        <Sparkles className="animate-spin inline mr-2 text-sky-400" />
        <span>Loading Achievements &amp; Credentials...</span>
      </div>
    );
  }

  return (
    <div id="achievements" className="text-white scroll-mt-24">
      <MagicCard
        gradientSize={450}
        gradientFrom="#0ea5e9"
        gradientTo="#22d3ee"
        className="rounded-2xl glass xl:p-8 py-6 px-4"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 px-1">
          <div className="flex items-center">
            <div className="bg-sky-400 p-2.5 rounded-xl mr-4 shadow-lg shadow-sky-500/20 text-black shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {achievementsConfig.title || "Achievements & Credentials"}
              </h2>
              <div className="bg-sky-400 w-20 h-1 rounded-full mt-1.5"></div>
            </div>
          </div>

          {/* View Mode Switcher (Grid vs Timeline) */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-neutral-900/90 border border-neutral-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === "grid"
                ? "bg-sky-400 text-black shadow-md"
                : "text-neutral-400 hover:text-white"
                }`}
              title="Grid View"
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === "timeline"
                ? "bg-sky-400 text-black shadow-md"
                : "text-neutral-400 hover:text-white"
                }`}
              title="Timeline View"
            >
              <GitCommit size={14} />
              <span>Timeline</span>
            </button>
          </div>
        </div>

        {achievementsConfig.subtitle && (
          <p className="text-gray-300 dark:text-gray-400 text-xs sm:text-sm mb-6 px-1 leading-relaxed max-w-3xl">
            {achievementsConfig.subtitle}
          </p>
        )}

        {/* Filter Controls & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-8 px-1">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const count =
                cat.id === "all"
                  ? items.length
                  : items.filter((i) => i.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeCategory === cat.id
                    ? "bg-sky-400 text-black shadow-md shadow-sky-500/20 scale-105"
                    : "bg-neutral-900/90 text-neutral-300 hover:text-white hover:bg-neutral-800 border border-neutral-800"
                    }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeCategory === cat.id
                      ? "bg-black/20 text-black font-extrabold"
                      : "bg-neutral-800 text-neutral-400"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-sky-400 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Content Container */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-neutral-950/60 rounded-2xl border border-neutral-800/80 p-8">
            <BadgeCheck size={36} className="mx-auto text-neutral-600 mb-2" />
            <p className="text-neutral-400 text-sm font-semibold">
              No credentials found matching "{searchQuery}"
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <>
          /* ============================================================ */
          /* GRID VIEW */
          /* ============================================================ */
          <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            {filteredItems.map((item, idx) => {
              const pdfUrl = getAssetHref(item.pdfFile || item.imageFile);
              const badgeUrl = getAssetHref(item.badge);
              const isDatabricks = item.category === "databricks" || item.type === "accredible";
              const isAward = item.category === "awards" || item.type === "award";

              return (
                <RevealItem
                  key={item.id}
                  /* Same phone-only truncation as the projects grid. */
                  className={`h-full ${
                    !showAllItems && idx >= MOBILE_VISIBLE_ITEMS
                      ? "hidden sm:block"
                      : ""
                  }`}
                >
                <article
                  className="card-cine h-full rounded-2xl bg-white/[0.03] border border-white/10 p-3.5 sm:p-6 shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Tag & Date Header */}
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 sm:mb-3 sm:pb-3 border-b border-neutral-800/80">
                      <div className="flex items-center gap-2">
                        {isDatabricks ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-sky-400/10 border border-sky-400/30 text-sky-400 text-[11px] font-bold tracking-wide flex items-center gap-1">
                            <BadgeCheck size={13} />
                            <span>Accredible Verified</span>
                          </span>
                        ) : isAward ? (
                          <span className="px-2.5 py-0.5 rounded-md bg-sky-400/10 border border-sky-400/30 text-sky-400 text-[11px] font-bold tracking-wide flex items-center gap-1">
                            <Trophy size={13} />
                            <span>Enterprise Honor</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-md bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-[11px] font-bold tracking-wide flex items-center gap-1">
                            <CheckCircle2 size={13} />
                            <span>{item.platform || "Certified Course"}</span>
                          </span>
                        )}
                      </div>

                      {item.date && (
                        <div className="flex items-center gap-1 text-xs text-neutral-400 font-mono font-medium">
                          <Calendar size={12} className="text-sky-400" />
                          <span>{item.date}</span>
                        </div>
                      )}
                    </div>

                    {/* Title & Issuer */}
                    <div className="flex items-start gap-3 sm:gap-4 mb-2 sm:mb-3">
                      {/* Badge / Icon Thumbnail */}
                      <div className="shrink-0">
                        {item.badge ? (
                          <img
                            src={badgeUrl}
                            alt={`${item.title} Badge`}
                            className="h-9 w-9 sm:h-12 sm:w-12 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform"
                            loading="lazy"
                          />
                        ) : isAward ? (
                          <div className="p-3 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400">
                            <Trophy size={24} />
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-400">
                            <BadgeCheck size={24} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-lg font-bold text-white leading-snug group-hover:text-sky-300 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-sky-400 font-semibold mt-0.5 flex items-center gap-1">
                          <Building2 size={12} />
                          <span>{item.issuer || item.organization}</span>
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {item.description && (
                      <p className="text-xs text-neutral-300 leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                        {item.description}
                      </p>
                    )}

                    {/* Accredible Embedded Widget (if Databricks credential) */}
                    {isDatabricks && item.embedUrl && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                            <Layers size={12} className="text-sky-400" />
                            <span>Official Accredible Embed</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleEmbed(item.id)}
                              className="text-[11px] font-bold text-sky-400 hover:text-sky-300 underline cursor-pointer"
                            >
                              {expandedEmbeds[item.id] ? "Hide Embed" : "Show Full Embed"}
                            </button>
                            <button
                              onClick={() => setActiveEmbedModal(item)}
                              className="text-[11px] text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
                              title="Expand to Fullscreen Modal"
                            >
                              <Maximize2 size={13} />
                            </button>
                          </div>
                        </div>

                        {expandedEmbeds[item.id] && (
                          <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-neutral-800 bg-black/60 shadow-inner">
                            <iframe
                              src={item.embedUrl}
                              title={`${item.title} Accredible Embed`}
                              className="w-full h-full border-0"
                              allowFullScreen
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Action Buttons Matrix */}
                  <div className="pt-3 border-t border-neutral-800/80 mt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* 1. Verify Credential Button */}
                      {item.verifyUrl && (
                        <a
                          href={item.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-400 hover:bg-sky-300 text-black text-xs font-extrabold shadow-sm transition hover:scale-105 shrink-0"
                          title="Verify credential authenticity on official portal"
                        >
                          <ExternalLink size={13} />
                          <span>Verify Credential</span>
                        </a>
                      )}

                      {/* 2. View Badge Button (For Accredible / Badged items) */}
                      {item.badge && (
                        <a
                          href={badgeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-sky-400 text-xs font-bold text-neutral-200 transition hover:scale-105 shrink-0"
                          title="View badge in a new tab"
                        >
                          <Download size={13} className="text-sky-400" />
                          <span>View Badge</span>
                        </a>
                      )}

                      {/* 3. View Certificate in New Tab */}
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-sky-400 text-xs font-bold text-neutral-200 transition hover:scale-105 shrink-0"
                        title="Open certificate in a new browser tab"
                      >
                        <Eye size={13} className="text-cyan-400" />
                        <span>View Certificate</span>
                      </a>
                    </div>
                  </div>
                </article>
                </RevealItem>
              );
            })}
          </RevealGroup>

          {filteredItems.length > MOBILE_VISIBLE_ITEMS && !showAllItems && (
            <button
              type="button"
              onClick={() => setShowAllItems(true)}
              className="sm:hidden btn-cine mt-4 w-full py-2.5 rounded-xl border border-sky-400/40 bg-sky-400/10 text-sky-300 text-sm font-semibold cursor-pointer"
            >
              Show all {filteredItems.length}
            </button>
          )}
          </>
        ) : (
          /* ============================================================ */
          /* CHRONOLOGICAL TIMELINE VIEW */
          /* ============================================================ */
          <div className="relative border-l-2 border-sky-400/40 ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8 py-2">
            {filteredItems.map((item) => {
              const pdfUrl = getAssetHref(item.pdfFile || item.imageFile);

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-sky-400 border-4 border-black group-hover:scale-125 transition-transform shadow-md shadow-sky-500/50"></div>

                  <div className="rounded-2xl bg-neutral-950/90 border border-neutral-800 hover:border-sky-400/50 p-5 shadow-lg transition">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-300">
                        {item.title}
                      </h3>
                      <span className="text-xs text-sky-400 font-mono font-semibold">
                        {item.date}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 font-semibold mb-2">
                      {item.issuer || item.organization}
                    </p>

                    {item.description && (
                      <p className="text-xs text-neutral-300 mb-4 leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {item.verifyUrl && (
                        <a
                          href={item.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-400 hover:bg-sky-300 text-black text-xs font-bold transition"
                        >
                          <ExternalLink size={12} />
                          <span>Verify</span>
                        </a>
                      )}
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-bold text-neutral-200 hover:border-sky-400 transition"
                      >
                        <Eye size={12} className="text-cyan-400" />
                        <span>View</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Fullscreen Accredible Embed Modal */}
        {activeEmbedModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <BadgeCheck size={20} className="text-sky-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                    {activeEmbedModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveEmbedModal(null)}
                  className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Embed Frame */}
              <div className="flex-1 p-2 bg-neutral-900/50 overflow-auto">
                <iframe
                  src={activeEmbedModal.embedUrl}
                  title={`${activeEmbedModal.title} Accredible Full Embed`}
                  className="w-full h-[65vh] border-0 rounded-xl"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer */}
              <div className="p-3 border-t border-neutral-800 flex justify-end gap-2">
                <a
                  href={activeEmbedModal.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-sky-400 hover:bg-sky-300 text-black text-xs font-bold flex items-center gap-1.5"
                >
                  <ExternalLink size={13} />
                  <span>Verify on Accredible</span>
                </a>
                <button
                  onClick={() => setActiveEmbedModal(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold border border-neutral-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </MagicCard>
    </div>
  );
};

export default Achievements;
