import React from "react";
import { FaLinkedin, FaWhatsapp, FaEnvelope, FaGithub } from "react-icons/fa";
import { useConfig } from "@/context/ConfigContext";

const iconMap = {
  FaLinkedin: FaLinkedin,
  FaWhatsapp: FaWhatsapp,
  FaEnvelope: FaEnvelope,
  FaGithub: FaGithub,
};

const SocialLinks = () => {
  const { config, loading } = useConfig();
  if (loading || !config.socialLinks) return null;

  return (
    <>
      {config.socialLinks.links.map((item, index) => {
        const IconComponent = iconMap[item.icon];
        if (!IconComponent) return null;

        return (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl text-gray-400 hover:text-amber-400 hover:bg-neutral-800/80 transition-all duration-200 hover:scale-110 flex items-center justify-center"
            aria-label={item.label}
          >
            <IconComponent size={22} />
          </a>
        );
      })}
    </>
  );
};

export default SocialLinks;
