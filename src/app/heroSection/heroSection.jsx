import React from "react";
import About from "../pages/about";
import SkillsSection from "../pages/skills";
import Projects from "../pages/Projects";
import Experience from "../pages/Experience";
import Education from "../pages/Education";
import Achievements from "../pages/Achievements";
import Testimonials from "../pages/Testimonials";
import Architecture from "../pages/Architecture";

const HeroSection = () => {
  return (
    <div className="rounded-2xl max-w-4xl relative flex justify-between h-full w-full flex-col pb-8 space-y-8">
      {/* 1. About & Executive Metrics */}
      <div id="about" className="xl:px-4 scroll-mt-24">
        <About />
      </div>

      {/* 2. Career Experience Timeline */}
      <div id="experience" className="xl:px-4 scroll-mt-24">
        <Experience />
      </div>

      {/* 3. How I Build Data — reference architecture */}
      <div className="xl:px-4">
        <Architecture />
      </div>

      {/* 4. Education Background */}
      <div id="education" className="xl:px-4 scroll-mt-24">
        <Education />
      </div>

      {/* 4. Skills & Competencies */}
      <div id="skills" className="xl:px-4 scroll-mt-24">
        <SkillsSection />
      </div>

      {/* 5. Featured Projects & Architectures */}
      <div id="projects" className="xl:px-4 scroll-mt-24">
        <Projects />
      </div>

      {/* 6. Professional Achievements & Accredited Credentials */}
      <div id="achievements" className="xl:px-4 scroll-mt-24">
        <Achievements />
      </div>

      {/* 7. LinkedIn Endorsements & Recommendations */}
      <div id="testimonials" className="xl:px-4 scroll-mt-24">
        <Testimonials />
      </div>
    </div>
  );
};

export default HeroSection;
