"use client";

import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { TargetExplorer } from "@/components/target-catalog/target-explorer";
import { ExperimentBuilder } from "@/components/experiment-builder/experiment-form";
import { CostEstimator } from "@/components/cost-estimator/cost-estimator";
import { LifecycleViewer } from "@/components/experiment-lifecycle/lifecycle-viewer";
import { ResultsViewer } from "@/components/results-viewer/results-viewer";
import { AiChat } from "@/components/ai-assistant/ai-chat";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <div className="divide-y divide-border/50">
          <TargetExplorer />
          <ExperimentBuilder />
          <CostEstimator />
          <LifecycleViewer />
          <ResultsViewer />
          <AiChat />
        </div>
      </main>
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>&copy; 2026 Adaptyv Bio. All rights reserved.</span>
          <div className="flex gap-4">
            <a
              href="https://docs.adaptyvbio.com"
              className="hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              API Docs
            </a>
            <a
              href="https://adaptyvbio.com"
              className="hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Website
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
