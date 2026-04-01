export function Footer() {
  return (
    <footer className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <span className="text-foreground font-semibold text-lg tracking-tight">
              Adaptyv
            </span>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
              Protein binding assays as a service. From design to data, powered
              by an API.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Developers
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.adaptyvbio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent-blue transition-colors"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://docs.adaptyvbio.com/reference"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent-blue transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="https://docs.adaptyvbio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent-blue transition-colors"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://adaptyvbio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent-blue transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@adaptyvbio.com"
                  className="text-sm text-muted-foreground hover:text-accent-blue transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Adaptyv Bio. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
