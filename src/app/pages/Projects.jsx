import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  FolderGit2,
  Github,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Star,
  GitFork,
  Clock,
  X,
  Database,
  Layers,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import { useConfig } from "@/context/ConfigContext";
import { fetchGitHubRepo } from "@/lib/github";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { useIsDesktopPointer } from "@/lib/useReducedMotion";

const MOBILE_VISIBLE_PROJECTS = 3;

const ProjectModal = ({ project, gitStats, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-y-auto p-5 sm:p-8 text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-gray-400 hover:text-white border border-neutral-700 transition"
          aria-label="Close Project Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-sky-400/15 border border-sky-400/40 text-sky-300 text-xs font-bold px-2.5 py-0.5 rounded-md">
              {project.category}
            </span>
            {project.featured && (
              <span className="inline-flex items-center gap-1 bg-sky-400 text-black text-xs font-bold px-2.5 py-0.5 rounded-md">
                <Sparkles size={12} />
                Featured
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {project.title}
          </h2>
        </div>

        {/* Project Image Banner */}
        {project.image && (
          <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-6 bg-neutral-900 border border-neutral-800">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
          </div>
        )}

        {/* Live GitHub Stats Row */}
        {gitStats && (
          <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 text-center">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-sky-400 font-bold text-sm sm:text-base">
                <Star size={14} />
                {gitStats.stars}
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-400">Stars</span>
            </div>
            <div className="flex flex-col items-center border-x border-neutral-800">
              <span className="flex items-center gap-1 text-cyan-400 font-bold text-sm sm:text-base">
                <GitFork size={14} />
                {gitStats.forks}
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-400">Forks</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs sm:text-sm">
                <Clock size={13} />
                {gitStats.pushedAt || "Active"}
              </span>
              <span className="text-[10px] sm:text-xs text-neutral-400">Updated</span>
            </div>
          </div>
        )}

        {/* Architectural Overview */}
        {project.architecture && (
          <div className="mb-6 p-4 rounded-xl bg-sky-500/5 border border-sky-500/20">
            <h4 className="text-xs sm:text-sm font-bold text-sky-400 mb-2 flex items-center gap-2">
              <Database size={15} />
              <span>Data Architecture & Workflow Pipeline</span>
            </h4>
            <p className="text-xs sm:text-sm text-neutral-200 font-mono leading-relaxed">
              {project.architecture}
            </p>
          </div>
        )}

        {/* Detailed Description */}
        <div className="mb-6">
          <h4 className="text-xs sm:text-sm font-bold text-neutral-300 uppercase tracking-wider mb-2">
            Overview & Problem Solution
          </h4>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {project.description || project.summary}
          </p>
        </div>

        {/* Key Metrics Grid */}
        {Array.isArray(project.metrics) && project.metrics.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs sm:text-sm font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
              Key Engineering Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {project.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-neutral-900/60 border border-neutral-800 rounded-lg text-xs text-neutral-200"
                >
                  <CheckCircle2 size={14} className="text-sky-400 shrink-0" />
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {Array.isArray(project.highlights) && project.highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs sm:text-sm font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
              Technical Contributions
            </h4>
            <ul className="space-y-2">
              {project.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300 leading-normal"
                >
                  <CheckCircle2
                    size={15}
                    className="text-sky-400 shrink-0 mt-0.5"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack Badges */}
        {Array.isArray(project.techStack) && project.techStack.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs sm:text-sm font-bold text-neutral-300 uppercase tracking-wider mb-2.5">
              Technologies Utilized
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-neutral-900 text-sky-300/90 border border-neutral-700 text-xs px-2.5 py-1 rounded-md font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-800">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 hover:border-neutral-500 text-white text-xs sm:text-sm font-bold rounded-xl transition shadow"
            >
              <Github size={16} />
              <span>View Source Code</span>
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target={project.liveUrl.startsWith("#") ? "_self" : "_blank"}
              rel="noopener noreferrer"
              onClick={() => {
                if (project.liveUrl.startsWith("#")) {
                  onClose();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-black text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition"
            >
              <ExternalLink size={16} />
              <span>{project.liveDemoLabel || "Live Demo"}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onOpenModal }) => {
  const cardRef = useRef(null);
  const isDesktop = useIsDesktopPointer();
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [gitStats, setGitStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (project.githubRepo) {
      fetchGitHubRepo(project.githubRepo).then((stats) => {
        if (isMounted && stats) setGitStats(stats);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [project.githubRepo]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !isDesktop) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenModal(project, gitStats)}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="group cursor-target relative flex flex-col justify-between h-full bg-white/[0.03] border border-white/10 hover:border-sky-400/50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-sky-500/10 cursor-pointer will-change-transform"
    >
      {/* Specular Glare Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 rounded-xl"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(56, 189, 248, ${glare.opacity}), transparent 70%)`,
        }}
      />

      <div>
        {/* Project Image */}
        {project.image && (
          <div className="relative w-full h-32 sm:h-52 overflow-hidden bg-neutral-900 border-b border-neutral-800">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />

            {/* Category Badge */}
            <span className="absolute top-3 left-3 bg-black/85 backdrop-blur-md border border-neutral-700 text-sky-400 text-xs font-semibold px-2.5 py-1 rounded-md shadow">
              {project.category}
            </span>

            {/* Featured Badge */}
            {project.featured && (
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-sky-400 text-black text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                <Sparkles size={12} />
                Featured
              </span>
            )}
          </div>
        )}

        {/* Project Content */}
        <div className="p-4 sm:p-5">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition mb-1.5 sm:mb-2">
            {project.title}
          </h3>

          <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
            {project.summary || project.description}
          </p>

          {/* Dynamic GitHub stats badge */}
          {gitStats && (
            <div className="flex items-center gap-3 mb-3 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1 text-sky-300 font-semibold">
                <Star size={13} className="text-sky-400" />
                {gitStats.stars}
              </span>
              <span className="inline-flex items-center gap-1 text-cyan-300 font-semibold">
                <GitFork size={13} className="text-cyan-400" />
                {gitStats.forks}
              </span>
              {gitStats.pushedAt && (
                <span className="text-[11px] text-neutral-500">
                  {gitStats.pushedAt}
                </span>
              )}
            </div>
          )}

          {/* Tech Stack Badges */}
          {Array.isArray(project.techStack) && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-800">
              {project.techStack.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="bg-neutral-900 text-neutral-300 border border-neutral-700/80 text-[11px] px-2 py-0.5 rounded-md font-medium"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="text-[10px] text-sky-400 font-semibold self-center">
                  +{project.techStack.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer / Modal Trigger */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 flex items-center justify-between relative z-30 border-t border-neutral-900">
        <span className="inline-flex items-center gap-1 text-xs text-sky-400 font-semibold group-hover:underline">
          <span>View Architecture & Details</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(project, gitStats);
          }}
          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-gray-400 hover:text-white border border-neutral-800 transition"
          aria-label="Expand project details"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
};

const Projects = () => {
  const { config, loading } = useConfig();
  const projectsConfig = config.projects;
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [activeModalGitStats, setActiveModalGitStats] = useState(null);

  const categories = useMemo(() => {
    if (!projectsConfig?.categories) return ["All"];
    return projectsConfig.categories;
  }, [projectsConfig]);

  const filteredProjects = useMemo(() => {
    if (!projectsConfig?.projects) return [];
    if (selectedCategory === "All") return projectsConfig.projects;
    return projectsConfig.projects.filter(
      (project) => project.category === selectedCategory
    );
  }, [projectsConfig, selectedCategory]);

  if (loading || !projectsConfig) {
    return <div className="text-white text-center py-6">Loading Projects...</div>;
  }

  const handleOpenModal = (project, gitStats) => {
    setActiveModalProject(project);
    setActiveModalGitStats(gitStats);
  };

  const handleCloseModal = () => {
    setActiveModalProject(null);
    setActiveModalGitStats(null);
  };

  return (
    <div className="text-white">
      <MagicCard
        gradientSize={400}
        gradientFrom="#0ea5e9"
        gradientTo="#22d3ee"
        className="rounded-2xl glass xl:p-8 py-6 px-4"
      >
        {/* Section Header */}
        <Reveal className="px-1">
          <p className="eyebrow">Selected Work</p>
          <div className="flex items-center gap-3 mt-3 mb-2">
            <div className="bg-sky-400 p-2 rounded-md shadow-md shadow-sky-500/20">
              <FolderGit2 size={20} className="text-slate-950" />
            </div>
            <h2 className="text-2xl font-bold">
              {projectsConfig.title || "Featured Projects & Architectures"}
            </h2>
          </div>
        </Reveal>

        {projectsConfig.subtitle && (
          <p className="text-gray-400 text-xs md:text-sm mt-2 mb-6 px-1 leading-relaxed">
            {projectsConfig.subtitle}
          </p>
        )}

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8 px-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-sky-500 text-slate-950 font-semibold shadow-lg shadow-sky-500/20"
                      : "bg-white/[0.04] text-neutral-300 border border-white/10 hover:border-sky-400/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6">
          {filteredProjects.map((project, idx) => (
            <RevealItem
              key={project.id}
              /* Phones show the first few and reveal the rest on demand;
                 every project is always rendered from sm upwards. */
              className={`h-full ${
                !showAllProjects && idx >= MOBILE_VISIBLE_PROJECTS
                  ? "hidden sm:block"
                  : ""
              }`}
            >
              <ProjectCard project={project} onOpenModal={handleOpenModal} />
            </RevealItem>
          ))}
        </RevealGroup>

        {filteredProjects.length > MOBILE_VISIBLE_PROJECTS && !showAllProjects && (
          <button
            type="button"
            onClick={() => setShowAllProjects(true)}
            className="sm:hidden btn-cine mt-4 w-full py-2.5 rounded-xl border border-sky-400/40 bg-sky-400/10 text-sky-300 text-sm font-semibold cursor-pointer"
          >
            Show all {filteredProjects.length} projects
          </button>
        )}
      </MagicCard>

      {/* Deep-Dive Project Modal */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          gitStats={activeModalGitStats}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Projects;
