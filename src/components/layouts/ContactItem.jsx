import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

const ContactItem = ({ Icon, title, value, link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    if (link) return; // if it's a direct web link, let default action proceed or copy
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyToClipboard = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative flex items-center justify-between gap-3 p-0.5 rounded-xl hover:bg-white/5 transition duration-200">
      <div className="flex items-center gap-3 min-w-0">
        <div className="bg-[#141414] border border-neutral-800 p-2 rounded-xl shadow-md shrink-0 group-hover:border-amber-400/40 transition">
          <Icon className="text-amber-400 w-3.5 h-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
            {title}
          </p>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm font-medium text-white hover:text-amber-300 transition truncate block"
              title={value}
            >
              {value}
            </a>
          ) : (
            <p
              onClick={handleCopy}
              className="text-xs md:text-sm font-medium text-white truncate cursor-pointer hover:text-amber-300 transition"
              title="Click to copy"
            >
              {value}
            </p>
          )}
        </div>
      </div>

      {/* Quick Copy Button */}
      <button
        onClick={copyToClipboard}
        type="button"
        title="Copy to clipboard"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-neutral-800/80 hover:bg-amber-400 hover:text-black text-neutral-300 shrink-0 cursor-pointer"
      >
        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
      </button>

      {/* Copied Toast Tooltip */}
      {copied && (
        <span className="absolute right-2 -top-3 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce">
          Copied! ✓
        </span>
      )}
    </div>
  );
};

export default ContactItem;
