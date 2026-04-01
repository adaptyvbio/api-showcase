"use client";

import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
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

        <div className="pb-20">
          <div className="border-t border-border" />

          <div className="mt-20">
            <TargetExplorer />
          </div>

          <div className="border-t border-border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20" />
          <div className="mt-20">
            <ExperimentBuilder />
          </div>

          <div className="border-t border-border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20" />
          <div className="mt-20">
            <CostEstimator />
          </div>

          <div className="border-t border-border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20" />
          <div className="mt-20">
            <LifecycleViewer />
          </div>

          <div className="border-t border-border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20" />
          <div className="mt-20">
            <ResultsViewer />
          </div>

          <div className="border-t border-border max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20" />
          <div className="mt-20">
            <AiChat />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
