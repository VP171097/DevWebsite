import React, { useState, useEffect } from "react";
import { Github, Star, GitFork, Users, BookOpen, ExternalLink } from "lucide-react";
import { fetchGitHubUser } from "@/lib/github";

const GithubStatsWidget = ({ username = "VP171097" }) => {
  const [userStats, setUserStats] = useState({
    publicRepos: 18,
    followers: 12,
    following: 15,
    publicGists: 4,
    avatarUrl: "https://github.com/VP171097.png",
    bio: "Senior Data Engineer | Databricks | PySpark | Delta Lake",
    createdAt: 2020,
  });

  useEffect(() => {
    let isMounted = true;
    fetchGitHubUser(username).then((stats) => {
      if (isMounted && stats) setUserStats((prev) => ({ ...prev, ...stats }));
    });
    return () => {
      isMounted = false;
    };
  }, [username]);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/90 border border-neutral-800 hover:border-sky-400/40 transition-all shadow-xl text-white">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-sky-400">
            <Github size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>GitHub Activity &amp; Repositories</span>
            </h4>
            <p className="text-[11px] text-neutral-400">@{username}</p>
          </div>
        </div>

        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-sky-400 hover:underline font-semibold"
        >
          <span>Profile</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-center gap-1 text-sky-400 font-black text-base sm:text-lg">
            <BookOpen size={14} />
            <span>{userStats.publicRepos}</span>
          </div>
          <span className="text-[10px] text-neutral-400">Public Repos</span>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-center gap-1 text-cyan-400 font-black text-base sm:text-lg">
            <Users size={14} />
            <span>{userStats.followers}</span>
          </div>
          <span className="text-[10px] text-neutral-400">Followers</span>
        </div>

        <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-center gap-1 text-emerald-400 font-black text-base sm:text-lg">
            <Star size={14} />
            <span>Active</span>
          </div>
          <span className="text-[10px] text-neutral-400">Since {userStats.createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default GithubStatsWidget;
