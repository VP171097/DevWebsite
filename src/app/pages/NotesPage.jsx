import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Zap,
  Database,
  ShieldCheck,
  Code2,
  Search,
  FileText,
  Tag,
  ArrowLeft,
  Sun,
  Moon,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import { useConfig } from "@/context/ConfigContext";
import { useTheme } from "@/context/ThemeContext";
import { Particles } from "@/components/magicui/particles";

const iconMap = {
  Zap: Zap,
  Database: Database,
  ShieldCheck: ShieldCheck,
  Code2: Code2,
  Layers: Layers,
};

const getPdfUrl = (path) => {
  if (!path) return "#";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  )
    return path;
  if (path.startsWith(import.meta.env.BASE_URL)) return path;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

const NoteCard = ({ note, categoryTitle }) => {
  const pdfUrl = getPdfUrl(note.pdfFile);

  return (
    <article className="rounded-2xl bg-neutral-950/90 border border-neutral-800 hover:border-sky-400/50 transition-all duration-300 p-6 sm:p-7 shadow-2xl flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-800/80">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${note.difficulty === "Expert"
                ? "bg-red-500/15 text-red-300 border-red-500/40"
                : note.difficulty === "Advanced"
                  ? "bg-sky-500/15 text-sky-300 border-sky-500/40"
                  : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                }`}
            >
              {note.difficulty || "Intermediate"}
            </span>
            <span className="text-xs text-neutral-400 font-medium">
              {categoryTitle}
            </span>
          </div>

          {note.fileSize && (
            <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              PDF • {note.fileSize}
            </span>
          )}
        </div>

        {/* Note Topic Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug group-hover:text-sky-300 transition-colors">
          {note.topic || note.title}
        </h3>

        {/* Tags */}
        {Array.isArray(note.tags) && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800"
              >
                <Tag size={10} className="text-sky-400/70" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5">
          {note.description || note.summary}
        </p>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium">
          <FileText size={14} />
          <span>PDF Notes Document</span>
        </div>

        {/* Open PDF in New Tab */}
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black text-xs font-bold shadow-md shadow-sky-500/20 transition-all hover:scale-105 cursor-pointer"
        >
          <FileText size={14} />
          <span>Open PDF</span>
        </a>
      </div>
    </article>
  );
};

const NotesPage = () => {
  const { config, loading } = useConfig();
  const { theme, toggleTheme } = useTheme();
  const notesConfig = config.cheatsheets;

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => notesConfig?.categories || [], [notesConfig]);

  // Flatten all topics with category title attached
  const allNotes = useMemo(() => {
    const list = [];
    categories.forEach((cat) => {
      if (Array.isArray(cat.topics)) {
        cat.topics.forEach((t) => {
          list.push({ ...t, categoryId: cat.id, categoryTitle: cat.title });
        });
      }
    });
    return list;
  }, [categories]);

  // Filtered topics
  const filteredNotes = useMemo(() => {
    return allNotes.filter((t) => {
      const matchesCategory = activeCategory === "all" || t.categoryId === activeCategory;
      const topicName = t.topic || t.title || "";
      const desc = t.description || t.summary || "";
      const matchesSearch =
        !searchQuery.trim() ||
        topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(t.tags) && t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [allNotes, activeCategory, searchQuery]);

  if (loading || !notesConfig) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading Data Engineering Notes...
      </div>
    );
  }

  const homeUrl = import.meta.env.BASE_URL;

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white selection:bg-sky-400 selection:text-black">
      {/* Background Particles */}
      <Particles
        className="fixed inset-0 w-full h-full -z-10"
        quantity={120}
        ease={50}
        refresh
      />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-neutral-950/85 backdrop-blur-xl border-b border-neutral-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href={homeUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-300 hover:text-white transition"
            >
              <ArrowLeft size={15} />
              <span>Back to Portfolio</span>
            </a>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-800">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
              <span className="text-sky-400 font-extrabold text-sm tracking-wider">
                DATA ENGINEERING KNOWLEDGE HUB
              </span>
            </div>
          </div>

          {/* Right Actions: Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sky-400 hover:bg-neutral-800 transition cursor-pointer"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-400/10 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-3">
            <BookOpen size={14} />
            <span>PDF Notes &amp; Production Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight">
            Data Engineering <span className="bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">Notes</span>
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            {notesConfig.subtitle || "Downloadable comprehensive PDF guides and production best practices for Data Engineers."}
          </p>

          {/* Search Input */}
          <div className="relative max-w-xl mx-auto mt-6">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search notes by topic or keyword (e.g. PySpark, Delta, SQL, Kafka)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 focus:border-sky-400 text-white text-xs sm:text-sm placeholder-neutral-500 focus:outline-none shadow-xl transition"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${activeCategory === "all"
              ? "bg-sky-400 text-black shadow-lg shadow-sky-400/20 scale-105"
              : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-600 hover:text-white"
              }`}
          >
            <Layers size={14} />
            <span>All Notes ({allNotes.length})</span>
          </button>

          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || BookOpen;
            const count = cat.topics?.length || 0;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${isSelected
                  ? "bg-sky-400 text-black shadow-lg shadow-sky-400/20 scale-105"
                  : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-600 hover:text-white"
                  }`}
              >
                <Icon size={14} />
                <span>{cat.title} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredNotes.map((note, idx) => (
            <NoteCard
              key={idx}
              note={note}
              categoryTitle={note.categoryTitle}
            />
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-20 text-neutral-400">
            <p className="text-base font-semibold">No PDF notes found matching "{searchQuery}"</p>
            <p className="text-xs text-neutral-500 mt-1">Try searching for PySpark, Delta, Unity, or Kafka.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-neutral-800 text-center text-xs text-neutral-500">
        <p>Vivek Pandey • Senior Data Engineer &amp; Databricks Specialist</p>
      </footer>
    </div>
  );
};

export default NotesPage;
