"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "Services", href: "https://start.adaptyvbio.com" },
  { label: "Blog", href: "https://adaptyvbio.com/blog" },
  { label: "Team", href: "https://adaptyvbio.com/team" },
  { label: "Careers", href: "https://adaptyvbio.com/careers" },
  { label: "Docs", href: "https://docs.adaptyvbio.com" },
  { label: "API", href: "https://docs.adaptyvbio.com/api-reference/api-introduction" },
];

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur">
      <nav className="px-5 lg:px-[60px] h-[64px] flex items-center gap-4">
        <a
          href="https://adaptyvbio.com"
          aria-label="Adaptyv Bio Home"
          className="shrink-0 flex items-center gap-2"
        >
          <Image
            src="/logos/adaptyv.svg"
            alt="Adaptyv Bio"
            width={142}
            height={24}
            priority
          />
        </a>

        <div className="hidden md:flex items-center text-[#58666E]">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-[#F6F7F7] py-1.5 px-3 rounded-md font-medium text-sm transition-all duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden ml-auto text-[#142933] p-2 rounded-md hover:bg-[#F6F7F7]"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
        >
          <span className="sr-only">Toggle navigation</span>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {isMenuOpen && (
        <div id="mobile-nav" className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 flex flex-col items-center gap-2 text-[#58666E]">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="w-full max-w-xs text-center hover:bg-[#F6F7F7] py-2 px-3 rounded-md font-medium text-sm transition-all duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
