import React from "react";
import { GraduationCap, Award } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import { useConfig } from "@/context/ConfigContext";

const Education = () => {
  const { config, loading } = useConfig();
  const educationConfig = config.education;

  if (loading || !educationConfig)
    return <div className="text-white text-center py-6">Loading Education...</div>;

  return (
    <div id="education" className="text-white scroll-mt-24">
      <MagicCard
        gradientSize={400}
        gradientFrom="#d97706"
        gradientTo="#fbbf24"
        className="rounded-2xl glass xl:p-8 py-6 px-4"
      >
        {/* Header */}
        <div className="flex items-center mb-6 px-1">
          <div className="bg-amber-400 p-2 rounded-md mr-4 shadow-md shadow-amber-500/20">
            <GraduationCap size={22} className="text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {educationConfig.title || "Education & Academic Background"}
            </h2>
            <div className="bg-amber-400 w-16 h-1 rounded-sm mt-1"></div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative ml-3 sm:ml-5 border-l-2 border-amber-500/40 pl-6 sm:pl-8 space-y-8">
          {educationConfig.educationData?.map((item, index) => (
            <div key={index} className="relative group">
              {/* Timeline Bullet Node */}
              <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 flex h-4 w-4">
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400 border-2 border-black shadow"></span>
              </span>

              {/* Degree Title */}
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-amber-300 transition">
                  {item.degree || item.school}
                </h3>
                <span className="text-xs text-amber-300 font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                  {item.year}
                </span>
              </div>

              {/* School and Info */}
              <div className="flex flex-wrap sm:flex-nowrap gap-3.5 mt-2 items-center">
                {item.img && (
                  <img
                    src={item.img}
                    className="w-24 sm:w-28 h-9 sm:h-10 object-contain bg-white/5 border border-white/10 rounded-lg p-1.5"
                    alt={`${item.school} logo`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                <div className="border-l border-neutral-700 pl-3">
                  <p className="text-xs sm:text-sm font-semibold text-neutral-200">
                    {item.school}
                  </p>
                  {item.grade && (
                    <p className="text-xs text-amber-400/90 font-medium mt-0.5">
                      Grade: {item.grade}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed mt-3">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </MagicCard>
    </div>
  );
};

export default Education;
