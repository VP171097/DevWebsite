import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, CornerDownLeft } from "lucide-react";
import { useConfig } from "@/context/ConfigContext";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Profile assistant.
 *
 * The site is static (GitHub Pages), so there is no model behind this. Every
 * answer is composed from the same JSON config the rest of the page renders,
 * which keeps it truthful: it can only say things the profile already states.
 * Unrecognised questions say so plainly rather than guessing.
 */

const EASE = [0.22, 1, 0.36, 1];

const TOPICS = [
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" },
];

/** Keyword routing for free-text questions. Stems, not whole words, so
 *  "certifications" and "projects" match as readily as "cert" and "project". */
const MATCHERS = [
  { id: "certifications", re: /(cert|credential|accredit|award|badge|recognition|achievement)/i },
  { id: "education", re: /(education|degree|college|universit|study|studied|school|grade|b\.?tech)/i },
  { id: "experience", re: /(experience|work|job|role|career|company|employer|years?\b|infosys)/i },
  { id: "projects", re: /(project|built|build|pipeline|case stud|lakehouse|portfolio)/i },
  { id: "contact", re: /(contact|email|reach|hire|hiring|linkedin|github|phone|resume|cv|availab|notice)/i },
  { id: "skills", re: /(skill|tech|stack|tool|pyspark|spark|databricks|sql|python|kafka|delta|azure|aws|cloud)/i },
];

const ChatWidget = () => {
  const { config } = useConfig();
  const reduced = usePrefersReducedMotion();

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const launcherRef = useRef(null);

  const name = config?.sidebar?.name || "Vivek Pandey";
  const firstName = name.split(" ")[0];

  // ---- answer builders, all reading the live config -----------------------

  const answers = useMemo(() => {
    const skills = config?.skills;
    const exp = config?.experience?.experienceData || [];
    const projects = config?.projects?.projects || [];
    const edu = config?.education?.educationData || [];
    const achievements = config?.achievements?.items || [];
    const contacts = config?.sidebar?.contacts || [];
    const socials = config?.socialLinks?.links || [];
    const resume = config?.landing?.resumeLink;

    const build = {};

    build.skills = () => {
      const cats = skills?.categories || [];
      const lines = cats.map(
        (c) => `**${c.category}** — ${(c.skills || []).join(", ")}`
      );
      const top = (skills?.technicalSkills || [])
        .slice()
        .sort((a, b) => (b.proficiency || 0) - (a.proficiency || 0))
        .slice(0, 5)
        .map((s) => `${s.name} (${s.proficiency}%)`)
        .join(" · ");
      return {
        text:
          lines.length > 0
            ? `${firstName} works across these areas:\n\n${lines.join(
                "\n"
              )}\n\nStrongest: ${top}`
            : "Skill details are not available right now.",
        links: [{ label: "See the full skills section", href: "#skills" }],
      };
    };

    build.experience = () => {
      if (exp.length === 0) return { text: "Experience details are not available right now." };
      const lines = exp.map(
        (e) => `**${e.title}** — ${e.company}\n${e.duration}`
      );
      return {
        text: `${exp.length} role${exp.length > 1 ? "s" : ""} so far:\n\n${lines.join("\n\n")}`,
        links: [
          { label: "Open the full timeline", href: "#experience" },
          resume ? { label: "Download résumé", href: resume, download: true } : null,
        ].filter(Boolean),
      };
    };

    build.projects = () => {
      if (projects.length === 0) return { text: "Project details are not available right now." };
      const lines = projects
        .slice(0, 4)
        .map((p) => `**${p.title}**\n${p.summary || p.description || ""}`);
      const more = projects.length > 4 ? `\n\n…and ${projects.length - 4} more.` : "";
      return {
        text: `${projects.length} projects are listed:\n\n${lines.join("\n\n")}${more}`,
        links: [{ label: "Browse all projects", href: "#projects" }],
      };
    };

    build.education = () => {
      if (edu.length === 0) return { text: "Education details are not available right now." };
      const lines = edu.map((e) =>
        [`**${e.degree}**`, e.school, [e.year, e.grade].filter(Boolean).join(" · ")]
          .filter(Boolean)
          .join("\n")
      );
      return { text: lines.join("\n\n"), links: [{ label: "See education", href: "#education" }] };
    };

    build.certifications = () => {
      if (achievements.length === 0)
        return { text: "Credential details are not available right now." };
      const lines = achievements
        .slice(0, 6)
        .map((a) =>
          [`**${a.title}**`, [a.issuer, a.date].filter(Boolean).join(" · ")]
            .filter(Boolean)
            .join("\n")
        );
      const more =
        achievements.length > 6 ? `\n\n…and ${achievements.length - 6} more.` : "";
      return {
        text: `${achievements.length} credentials and awards:\n\n${lines.join("\n\n")}${more}`,
        links: [{ label: "View credentials", href: "#achievements" }],
      };
    };

    build.contact = () => {
      const lines = contacts
        .map((c) => `**${c.title}** — ${c.value}`)
        .join("\n");
      const links = [
        ...socials.map((s) => ({ label: s.label, href: s.url, external: true })),
        resume ? { label: "Download résumé", href: resume, download: true } : null,
        { label: "Contact form", href: "#contact" },
      ].filter(Boolean);
      const status = config?.sidebar?.status;
      return {
        text: [status ? `Status: ${status}` : null, lines].filter(Boolean).join("\n\n") ||
          "Contact details are not available right now.",
        links,
      };
    };

    return build;
  }, [config, firstName]);

  const greet = () => [
    {
      from: "bot",
      text: `Hi! I'm ${firstName}'s profile assistant. Ask me about his background, or pick a topic below.`,
    },
    { from: "bot", topics: true },
  ];

  // ---- interaction --------------------------------------------------------

  const answerTopic = (id) => {
    const make = answers[id];
    if (!make) return;
    const a = make();
    setMessages((m) => [...m, { from: "bot", ...a }]);
  };

  const ask = (raw) => {
    const q = raw.trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");

    const hit = MATCHERS.find((m) => m.re.test(q));
    window.setTimeout(() => {
      if (hit) {
        answerTopic(hit.id);
      } else {
        setMessages((m) => [
          ...m,
          {
            from: "bot",
            text:
              "I answer from the details published on this site, so I can't take that one. Try one of these, or use the contact form to reach Vivek directly.",
          },
          { from: "bot", topics: true },
        ]);
      }
    }, 260);
  };

  // greet once per opening
  useEffect(() => {
    if (open && messages.length === 0) setMessages(greet());
    if (open) window.setTimeout(() => inputRef.current?.focus(), 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // close on Escape, returning focus to the launcher
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: reduced ? "auto" : "smooth" });
  }, [messages, reduced]);

  // very small formatter: **bold** and newlines
  const render = (text) =>
    text.split("\n").map((line, i) => (
      <span key={i} className="block">
        {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={j} className="text-white font-semibold">
              {part.slice(2, -2)}
            </strong>
          ) : (
            <React.Fragment key={j}>{part}</React.Fragment>
          )
        )}
      </span>
    ));

  const go = (href) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      setOpen(false);
    }
  };

  return (
    <>
      {/* Launcher — sits above the scroll-to-top button */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Close profile assistant" : "Open profile assistant"}
        className="btn-cine fixed bottom-24 right-6 z-50 h-12 w-12 rounded-full bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center cursor-pointer"
      >
        {open ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Profile assistant"
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="fixed z-50 bottom-40 right-4 sm:right-6 w-[min(22rem,calc(100vw-2rem))] max-h-[min(30rem,calc(100vh-12rem))] flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950/97 backdrop-blur-xl shadow-2xl overflow-hidden"
          >
            <header className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              <p className="text-sm font-bold text-white">Ask about {firstName}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="ml-auto text-neutral-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </header>

            <div
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
              aria-live="polite"
            >
              {messages.map((m, i) =>
                m.topics ? (
                  <div key={i} className="flex flex-wrap gap-1.5">
                    {TOPICS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setMessages((x) => [...x, { from: "user", text: t.label }]);
                          window.setTimeout(() => answerTopic(t.id), 220);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition cursor-pointer"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    key={i}
                    className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                        m.from === "user"
                          ? "bg-amber-400 text-slate-950 font-semibold"
                          : "bg-white/[0.04] border border-white/10 text-neutral-300"
                      }`}
                    >
                      {m.text && render(m.text)}
                      {m.links && m.links.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {m.links.map((l, j) =>
                            l.href.startsWith("#") ? (
                              <button
                                key={j}
                                type="button"
                                onClick={() => go(l.href)}
                                className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-300 border border-amber-400/30 hover:bg-amber-400/10 transition cursor-pointer"
                              >
                                {l.label}
                              </button>
                            ) : (
                              <a
                                key={j}
                                href={l.href}
                                target={l.download ? undefined : "_blank"}
                                rel="noopener noreferrer"
                                download={
                                  l.download ? "Vivek_Pandey_Senior_Data_Engineer.pdf" : undefined
                                }
                                className="px-2 py-0.5 rounded-md text-[11px] font-semibold text-amber-300 border border-amber-400/30 hover:bg-amber-400/10 transition"
                              >
                                {l.label}
                              </a>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 px-3 py-2.5 border-t border-neutral-800 shrink-0"
            >
              <label htmlFor="assistant-input" className="sr-only">
                Ask a question about {name}
              </label>
              <input
                id="assistant-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about skills, projects…"
                className="flex-1 bg-neutral-900/90 border border-neutral-700 focus:border-amber-400 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim()}
                className="h-8 w-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center disabled:opacity-40 disabled:cursor-default cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>

            <p className="px-4 pb-2 text-[10px] text-neutral-500 flex items-center gap-1">
              <CornerDownLeft size={10} />
              Answers come from this site&apos;s published profile details.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
