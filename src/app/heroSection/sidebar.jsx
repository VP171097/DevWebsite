import React, { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaGithub,
} from "react-icons/fa";
import { Clock, BookOpen, Users, GitCommit, ExternalLink } from "lucide-react";

import ContactItem from "@/components/layouts/ContactItem";
import { BorderBeam } from "@/components/magicui/border-beam";
import { useConfig } from "@/context/ConfigContext";
import { fetchGitHubUser, fetchGitHubContributions } from "@/lib/github";

const iconMap = {
  email: FaEnvelope,
  phone: FaPhoneAlt,
  location: FaMapMarkerAlt,
};

const computeRemainingNoticeDays = (noticeConfig) => {
  if (!noticeConfig || !noticeConfig.active) return 0;

  const startDateStr = noticeConfig.startDate;
  const totalDays = Number(noticeConfig.totalDays) || 90;

  if (!startDateStr) return totalDays;

  const startDate = new Date(startDateStr);
  const today = new Date();

  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - startDate.getTime();
  const elapsedDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const remainingDays = totalDays - Math.max(0, elapsedDays);
  return remainingDays;
};

const Sidebar = () => {
  const { config, loading } = useConfig();
  const sidebarConfig = config.sidebar;
  const githubUsername = sidebarConfig?.githubUsername;

  const [githubStats, setGithubStats] = useState({
    publicRepos: null,
    followers: null,
    contributions: null,
  });

  useEffect(() => {
    if (!githubUsername) return;
    let isMounted = true;

    Promise.all([
      fetchGitHubUser(githubUsername),
      fetchGitHubContributions(githubUsername),
    ]).then(([user, contributions]) => {
      if (!isMounted) return;
      setGithubStats((prev) => ({
        publicRepos: user?.publicRepos ?? prev.publicRepos,
        followers: user?.followers ?? prev.followers,
        contributions: contributions ?? prev.contributions,
      }));
    });

    return () => {
      isMounted = false;
    };
  }, [githubUsername]);

  if (loading || !sidebarConfig)
    return <div className="text-white p-4">Loading Sidebar...</div>;

  const remainingNoticeDays = computeRemainingNoticeDays(sidebarConfig.noticePeriod);
  const showNoticePeriod =
    sidebarConfig.noticePeriod?.active && remainingNoticeDays > 0;

  return (
    <aside className="relative container md:w-80 glass text-white py-4 px-4 rounded-2xl shadow-xl flex flex-col justify-between lg:sticky lg:top-[90px] h-min mb-6 mt-6 md:mb-10 md:mt-10">
      <BorderBeam
        size={500}
        borderWidth={2}
        duration={4}
        className="hidden sm:block absolute xl:via-sky-500"
      />

      <div className="flex flex-col items-center py-1 md:py-2 px-1">
        {/* Avatar with Glowing Pulse */}
        <div className="relative mb-2">
          <img
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-neutral-900 object-cover shadow-md shadow-sky-500/10 border border-neutral-700"
            src={sidebarConfig.avatar}
            alt="Avatar"
            loading="lazy"
          />
          <span className="absolute bottom-1 right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-black"></span>
          </span>
        </div>

        <h2 className="text-lg md:text-xl font-black text-center text-white">
          {sidebarConfig.name}
        </h2>

        <h3 className="text-[11px] text-gray-300 bg-neutral-900/90 border border-neutral-800 px-3 py-1 rounded-lg mt-1.5 text-center max-w-xs font-medium">
          {sidebarConfig.role}
        </h3>

        {/* Live Availability Status Pill */}
        {sidebarConfig.status && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold tracking-wide shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{sidebarConfig.status}</span>
          </div>
        )}

        {/* Dynamic Serving Notice Period Countdown Pill */}
        {showNoticePeriod && (
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/40 text-sky-300 text-[11px] font-bold tracking-wide shadow-sm animate-pulse">
            <Clock size={12} className="text-sky-400" />
            <span>Serving Notice: {remainingNoticeDays} Days Left</span>
          </div>
        )}

        <div className="border-t border-neutral-800 w-full my-3"></div>

        {/* Contact Info (Email, Phone, Location) */}
        <div className="space-y-1.5 w-full px-1 mb-1">
          {sidebarConfig.contacts?.map((contact, idx) => {
            const Icon = iconMap[contact.type];
            if (!Icon) return null;
            return (
              <ContactItem
                key={idx}
                Icon={Icon}
                title={contact.title}
                value={contact.value}
                link={contact.link}
              />
            );
          })}
        </div>

        {/* GitHub Username + Stats */}
        {githubUsername && (
          <>
            <div className="border-t border-neutral-800 w-full my-3"></div>

            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-3 w-full px-1 py-0.5 mb-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="bg-[#141414] border border-neutral-800 p-2 rounded-xl shadow-md shrink-0 group-hover:border-sky-400/40 transition">
                  <FaGithub className="text-sky-400 w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">
                    GitHub
                  </p>
                  <p className="text-xs md:text-sm font-medium text-white group-hover:text-sky-300 transition truncate">
                    @{githubUsername}
                  </p>
                </div>
              </div>
              <ExternalLink
                size={13}
                className="text-neutral-500 group-hover:text-sky-300 transition shrink-0"
              />
            </a>

            <div className="grid grid-cols-3 gap-1.5 w-full px-1 text-center">
              <div className="p-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex items-center justify-center gap-1 text-sky-400 font-black text-sm">
                  <BookOpen size={12} />
                  <span>{githubStats.publicRepos ?? "—"}</span>
                </div>
                <span className="text-[9px] text-neutral-400">Repos</span>
              </div>

              <div className="p-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex items-center justify-center gap-1 text-cyan-400 font-black text-sm">
                  <Users size={12} />
                  <span>{githubStats.followers ?? "—"}</span>
                </div>
                <span className="text-[9px] text-neutral-400">Followers</span>
              </div>

              <div className="p-1.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-black text-sm">
                  <GitCommit size={12} />
                  <span>{githubStats.contributions ?? "—"}</span>
                </div>
                <span className="text-[9px] text-neutral-400">
                  {String(new Date().getFullYear())} Contrib.
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
