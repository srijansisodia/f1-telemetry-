import { Suspense } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import SectionHeader from "@/components/layout/SectionHeader";
import CopyLinkButton from "@/components/ui/CopyLinkButton";
import SectorsClient from "./SectorsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sector Analysis" };
export const revalidate = 3600;

export default function SectorsPage() {
  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <SectionHeader
          title="Sector Analysis"
          subtitle="Real telemetry from FastF1 — sector performance breakdown"
          accent="cyan"
          right={<CopyLinkButton />}
        />
        <Suspense
          fallback={
            <div className="glass-card p-8 text-center">
              <p className="text-text-muted font-data text-sm">Loading sector data...</p>
            </div>
          }
        >
          <SectorsClient />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
