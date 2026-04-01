"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

const NAV_ITEMS = [
  { id: "targets", label: "Targets" },
  { id: "builder", label: "Builder" },
  { id: "cost", label: "Cost" },
  { id: "lifecycle", label: "Lifecycle" },
  { id: "results", label: "Results" },
  { id: "assistant", label: "AI" },
];

export function Nav() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 nav-frosted border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 mr-8">
          <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center">
            <span className="text-background text-xs font-bold">A</span>
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:block">
            Adaptyv
          </span>
        </a>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(
                "px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                active === id
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="https://docs.adaptyvbio.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-accent-blue text-white hover:bg-accent-blue-hover transition-colors"
        >
          View API Docs
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </header>
  );
}
