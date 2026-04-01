"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-success pulse-dot" />
          Live API Demo
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          Adaptyv API Showcase
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Explore the Foundry API with interactive examples. Search protein
          targets, estimate costs, track experiments, and view binding results
          — all with live API calls and real-time JSON.
        </p>
        <div className="flex items-center justify-center gap-3">
          <a
            href="#targets"
            className={cn(
              buttonVariants(),
              "bg-accent-blue hover:bg-accent-blue-hover text-white"
            )}
          >
            Explore Examples
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </a>
          <a
            href="https://docs.adaptyvbio.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            API Docs
            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
