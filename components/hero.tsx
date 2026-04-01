export function Hero() {
  return (
    <section className="relative py-20 md:py-28 lg:py-36">
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] lg:text-[3.75rem] font-bold tracking-[-0.045em] text-foreground leading-[1.05]">
          Let your users test
          <br className="hidden sm:block" /> protein designs{" "}
          <span className="text-[#0070F3]">in a real lab</span>
        </h1>

        <p className="mt-5 text-[15px] sm:text-lg md:text-[1.2rem] text-foreground/60 max-w-[500px] mx-auto leading-relaxed tracking-[-0.005em]">
          The Adaptyv API connects your computational design platform to our wet
          lab. Your users design proteins — we test them. Binding data in weeks,
          not months.
        </p>

        <div className="mt-10 flex items-center justify-center gap-8">
          <span className="text-sm text-muted-foreground font-medium tracking-tight">
            Tamarind Bio
          </span>
          <span className="text-sm text-muted-foreground font-medium tracking-tight">
            Phylo
          </span>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="#browse-targets"
            className="h-11 px-6 inline-flex items-center rounded-lg bg-[#0070F3] text-white text-sm font-semibold hover:bg-[#005CC8] transition-colors duration-150 tracking-[-0.005em]"
          >
            Explore Examples
          </a>
          <a
            href="https://docs.adaptyvbio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-6 inline-flex items-center rounded-lg border border-border text-foreground/60 text-sm font-medium hover:bg-muted hover:border-border transition-colors duration-150 tracking-[-0.005em]"
          >
            API Docs
          </a>
        </div>
      </div>
    </section>
  );
}
