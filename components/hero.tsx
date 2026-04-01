export function Hero() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32">
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[400px] rounded-full opacity-80"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0, 112, 243, 0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] font-bold tracking-[-0.04em] text-foreground leading-[1.1]">
          Let your users test their protein designs in a real lab
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-[1.25rem] text-[#3C4257] max-w-[520px] mx-auto leading-relaxed tracking-[-0.01em]">
          The Adaptyv API connects your computational design platform to our wet
          lab. Your users design proteins — we test them. Binding data in weeks,
          not months.
        </p>

        <div className="mt-10 flex items-center justify-center gap-8">
          <span className="text-sm text-muted-foreground font-medium opacity-60 tracking-tight">
            Tamarind Bio
          </span>
          <span className="text-sm text-muted-foreground font-medium opacity-60 tracking-tight">
            Phylo
          </span>
          <span className="text-sm text-muted-foreground italic opacity-40">
            and others
          </span>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <a
            href="https://docs.adaptyvbio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-5 inline-flex items-center rounded-lg bg-[#0070F3] text-white text-sm font-medium hover:bg-[#005CC8] transition-colors duration-150 tracking-[-0.005em]"
          >
            Explore API Docs
          </a>
          <a
            href="https://docs.adaptyvbio.com"
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-5 inline-flex items-center rounded-lg border border-border text-[#3C4257] text-sm font-medium hover:bg-[#F4F4F5] hover:border-[#D4D4D8] transition-colors duration-150 tracking-[-0.005em]"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
