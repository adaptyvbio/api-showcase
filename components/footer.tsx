import Image from "next/image";

const NAV_LINKS = [
  { label: "Services", href: "https://start.adaptyvbio.com" },
  { label: "Blog", href: "https://adaptyvbio.com/blog" },
  { label: "Team", href: "https://adaptyvbio.com/team" },
  { label: "Careers", href: "https://adaptyvbio.com/careers" },
];

const DOC_LINKS = [
  { label: "Docs", href: "https://docs.adaptyvbio.com" },
  { label: "API", href: "https://docs.adaptyvbio.com/api-reference/api-introduction" },
  { label: "Privacy Policy", href: "https://adaptyvbio.com/privacy" },
  { label: "Terms & Conditions", href: "https://adaptyvbio.com/terms" },
];

export function Footer() {
  return (
    <footer className="bg-[#142933] text-white">
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-[60px] py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Column 1 — Brand + Contact */}
            <div>
              <Image
                src="/logos/adaptyv-white.svg"
                alt="Adaptyv Bio"
                width={120}
                height={20}
                className="mb-4 opacity-90"
              />
              <p className="text-sm text-white/40 leading-relaxed">
                &copy; {new Date().getFullYear()} — Adaptyv Biosystems
              </p>
              <p className="text-sm text-white/40 mt-4">For all questions:</p>
              <a
                href="mailto:support@adaptyvbio.com"
                className="text-sm text-accent-blue hover:text-white transition-colors"
              >
                support@adaptyvbio.com
              </a>
            </div>

            {/* Column 2 — Nav */}
            <div>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Docs & Legal */}
            <div>
              <ul className="space-y-2.5">
                {DOC_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 — Address */}
            <div>
              <a
                href="https://maps.google.com/?q=Route+de+la+Corniche+5+1066+Epalinges+Switzerland"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-white transition-colors leading-relaxed block"
              >
                Biopole Life Science Campus
                <br />
                Route de la Corniche 5, 1066 Epalinges
                <br />
                Lausanne, Switzerland
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
