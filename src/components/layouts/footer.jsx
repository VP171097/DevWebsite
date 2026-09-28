import React from "react";
import dayjs from "dayjs";
import { Heart, Sparkles, Terminal } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full glass-strong border-t border-white/10 py-8 px-4 text-center text-white backdrop-blur-xl">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-sm tracking-wide">
          <Terminal size={16} />
          <span>VIVEK PANDEY</span>
          <span className="text-neutral-500 font-normal">| Data Engineering</span>
        </div>

        <p className="text-xs text-neutral-400 flex items-center justify-center gap-1.5">
          <span>Engineered with React 19, Tailwind CSS &amp; Passion</span>
          <Sparkles size={13} className="text-sky-400" />
        </p>

        <p className="text-xs text-neutral-500 font-mono">
          &copy; {dayjs().year()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
