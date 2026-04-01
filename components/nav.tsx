"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const SECTIONS = [
  { id: "browse-targets", label: "Browse Targets" },
  { id: "create-experiment", label: "Create Experiment" },
  { id: "get-a-quote", label: "Get a Quote" },
  { id: "track-progress", label: "Track Progress" },
  { id: "view-results", label: "View Results" },
  { id: "ai-assistant", label: "AI Assistant" },
];

export function Nav() {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 h-16 nav-frosted border-b border-border">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <a href="#" className="text-foreground font-semibold text-lg tracking-tight">
          Adaptyv
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`text-sm font-medium transition-colors duration-150 pb-0.5 border-b-2 ${
                activeSection === id
                  ? "text-foreground border-[#0070F3]"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://docs.adaptyvbio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex h-9 px-4 items-center rounded-lg bg-[#0070F3] text-white text-sm font-medium hover:bg-[#005CC8] transition-colors duration-150"
          >
            Explore API Docs
          </a>

          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-card border-b border-border shadow-lg">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="block w-full text-left px-6 py-3 text-base text-foreground hover:bg-muted transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="px-6 py-3 border-t border-border">
            <a
              href="https://docs.adaptyvbio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 px-4 items-center rounded-lg bg-[#0070F3] text-white text-sm font-medium"
            >
              Explore API Docs
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
