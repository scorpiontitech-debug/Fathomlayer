import type { Metadata } from "next";
import { CloudVsLocalClient } from "@/components/tools/CloudVsLocalClient";

export const metadata: Metadata = {
  title: "Cloud AI vs Local Build TCO | Fathom Layer",
  description: "Calculate the Exact Break-Even Point between paying monthly Cloud AI subscriptions vs building your own Local AI server.",
};

export default function CloudVsLocalPage() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-24">
      <div className="mb-12 max-w-4xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink mb-4">
          Cloud AI vs Local Build (Break-Even Matrix)
        </h1>
        <p className="text-lg text-dim">
          Don't buy hardware based on emotion. Calculate the deterministic Break-Even Point (ROI) comparing your monthly Cloud API/Subscription costs against the upfront capital expenditure of a Local AI workstation.
        </p>
      </div>

      <CloudVsLocalClient />
    </div>
  );
}
