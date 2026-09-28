import React, { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { useConfig } from "@/context/ConfigContext";
import { useTheme } from "@/context/ThemeContext";
import { Menu, X, Sun, Moon, Download, Github } from "lucide-react";

const Header = () => {
  const { config, loading } = useConfig();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading || !config.navigation) return null;

  const navItems = config.navigation.navItems;
  const resumeLink = config.landing?.resumeLink || "/resume.pdf";

  const shell = scrolled
    ? "glass-strong border-b border-white/10 shadow-[0_8px_30px_-16px_rgba(0,0,0,0.9)]"
    : "bg-transparent border-b border-transparent";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${shell}`}
    >
      {/* ===== Mobile / Tablet ===== */}
      <div className="xl:hidden px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link
          to="landing"
          smooth
          duration={600}
          className="text-white font-bold text-sm sm:text-base tracking-[0.18em] uppercase cursor-pointer flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>{config.sidebar?.name || "Vivek Pandey"}</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn-cine p-2 rounded-lg glass text-sky-300"
            title={`Current theme: ${theme}`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            className="btn-cine text-white p-2 rounded-lg glass"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          aria-label="Mobile"
          className="xl:hidden px-5 py-4 flex flex-col gap-1.5 border-t border-white/10 glass-strong"
        >
          {navItems.map((item, index) =>
            item.isNewTab ? (
              <a
                key={index}
                href={`${import.meta.env.BASE_URL}${item.path || "?page=notes"}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="text-sm px-4 py-2.5 rounded-lg transition font-medium text-neutral-300 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={index}
                to={item.to}
                smooth
                duration={600}
                offset={-70}
                spy
                activeClass="active"
                onClick={() => setIsOpen(false)}
                className="text-sm px-4 py-2.5 rounded-lg cursor-pointer transition font-medium text-neutral-300 hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            )
          )}

          <div className="pt-3 mt-2 border-t border-white/10">
            <a
              href={resumeLink}
              download="Vivek_Pandey_Senior_Data_Engineer.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cine w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-sky-500 text-slate-950 font-bold text-xs"
            >
              <Download size={14} />
              <span>Resume (PDF)</span>
            </a>
          </div>
        </nav>
      )}

      {/* ===== Desktop ===== */}
      <div className="hidden xl:flex max-w-7xl mx-auto justify-between items-center px-6 py-3">
        <Link
          to="landing"
          smooth
          duration={600}
          className="btn-cine text-white font-bold text-sm tracking-[0.2em] uppercase cursor-pointer flex items-center gap-2 shrink-0"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400" />
          <span>{config.sidebar?.name || "Vivek Pandey"}</span>
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-0.5">
          {navItems.map((item, index) =>
            item.isNewTab ? (
              <a
                key={index}
                href={`${import.meta.env.BASE_URL}${item.path || "?page=notes"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm rounded-lg font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors duration-200 whitespace-nowrap"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={index}
                to={item.to}
                smooth
                duration={600}
                offset={-80}
                spy
                activeClass="active"
                className="px-3 py-1.5 text-sm rounded-lg font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer whitespace-nowrap"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="btn-cine p-2 rounded-lg glass text-sky-300"
            title={`Toggle theme (current: ${theme})`}
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>

          <a
            href="https://github.com/VP171097"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cine p-2 rounded-lg glass text-neutral-300 hover:text-white"
            aria-label="GitHub profile"
          >
            <Github size={15} />
          </a>

          <a
            href={resumeLink}
            download="Vivek_Pandey_Senior_Data_Engineer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cine inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-md shadow-sky-500/20"
          >
            <Download size={13} />
            <span>Resume</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
