"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const SECTIONS = [
  { id: "experiment-types", label: "Experiment Types" },
  { id: "create-experiment", label: "Create Experiment" },
  { id: "browse-targets", label: "Browse Targets" },
  { id: "track-progress", label: "Track Progress" },
  { id: "view-results", label: "View Results" },
];

export function Nav() {
  const [activeSection, setActiveSection] = useState("");

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
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border hidden lg:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <a href="#" className="flex items-center gap-2 text-foreground font-semibold text-lg tracking-tight">
          <Image src="/logos/phylo-icon.svg" alt="Adaptyv Logo" width={24} height={24} className="opacity-90" />
          Adaptyv Foundry
        </a>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={cn(
              "text-left px-6 py-2 text-sm font-medium transition-colors border-l-4",
              activeSection === id
                ? "text-primary border-primary bg-primary/5"
                : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50"
            )}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-border">
        <a
          href="https://docs.adaptyvbio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-full items-center justify-center rounded-sm bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors duration-150"
        >
          API Docs
        </a>
      </div>
    </aside>
  );
}

export function MobileNav() {
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
    <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-border">
      <div className="h-16 px-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 text-foreground font-semibold text-lg tracking-tight">
          <Image src="/logos/phylo-icon.svg" alt="Adaptyv Logo" width={24} height={24} className="opacity-90" />
          Adaptyv Foundry
        </a>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="bg-card border-b border-border shadow-sm">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                "block w-full text-left px-6 py-3 text-base transition-colors border-l-4",
                activeSection === id
                  ? "text-primary border-primary bg-primary/5"
                  : "text-foreground border-transparent hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
          <div className="px-6 py-4 border-t border-border">
            <a
              href="https://docs.adaptyvbio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-full items-center justify-center rounded-sm bg-primary text-white text-sm font-medium"
            >
              API Docs
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
