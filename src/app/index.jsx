import React, { useState, useEffect } from "react";
import Sidebar from "./heroSection/sidebar";
import HeroSection from "./heroSection/heroSection";
import { Particles } from "@/components/magicui/particles";
import LandingPage from "./landing/landingPage";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import Preloader from "@/components/ui/preloader";
import ContactSection from "./pages/contact";
import Footer from "@/components/layouts/footer";
import { useConfig } from "@/context/ConfigContext";
import Header from "@/components/layouts/header";
import ScrollToTop from "@/components/ui/ScrollToTop";
import NotesPage from "./pages/NotesPage";
import CinematicBackground from "@/components/ui/CinematicBackground";
import CustomCursor from "@/components/ui/CustomCursor";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

const App = () => {
  const [showDelayFinished, setShowDelayFinished] = useState(false);
  const { loading: configLoading } = useConfig();
  const reducedMotion = usePrefersReducedMotion();

  // Check if current route is the standalone DE Notes page
  const isNotesRoute = () => {
    if (typeof window === "undefined") return false;
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
    const hash = window.location.hash;
    const pathname = window.location.pathname;

    return (
      pageParam === "notes" ||
      hash === "#/notes" ||
      hash === "#notes-page" ||
      pathname.endsWith("/notes") ||
      pathname.endsWith("/notes.html")
    );
  };

  const isNotes = isNotesRoute();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDelayFinished(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const stillLoading = configLoading || !showDelayFinished;

  if (stillLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
        <Preloader />
      </div>
    );
  }

  // Standalone DE Notes page when opened in new tab
  if (isNotes) {
    return <NotesPage />;
  }

  return (
    <div className="relative">
      {/* Cinematic ambient backdrop (CSS only) */}
      <CinematicBackground />

      {/* Sparse data particles — skipped for reduced-motion visitors */}
      {!reducedMotion && (
        <Particles
          className="fixed inset-0 -z-10"
          quantity={60}
          ease={60}
          color="#38bdf8"
          refresh
        />
      )}

      <ScrollProgress />
      <CustomCursor />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-sky-500 focus:text-slate-950 focus:font-bold"
      >
        Skip to content
      </a>

      <Header />

      <main id="main-content">

      <LandingPage />

      <section className="flex mt-8 flex-col md:flex-row xl:container w-full justify-center xl:gap-24 z-10">
        <div>
          <Sidebar />
        </div>
        <div>
          <HeroSection />
        </div>
      </section>

        <section id="contact" className="flex justify-between flex-col mb-5 scroll-mt-24">
          <ContactSection />
        </section>
      </main>

      <footer>
        <Footer />
      </footer>

      {/* Floating Back to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default App;
