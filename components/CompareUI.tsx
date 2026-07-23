"use client";

import Image from "next/image";
import Link from "next/link";
import { ProsCons } from "@/components/ProsCons";

type CompareItem = {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
};

export function CompareUI({ itemA, itemB }: { itemA: CompareItem | null; itemB: CompareItem | null }) {
  if (!itemA || !itemB) {
    return (
      <div className="rounded-xl border border-edge bg-surface p-12 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">Select two items to compare</h2>
        <p className="mt-2 text-dim">Pass the slugs in the URL like ?a=macbook-pro&b=mac-studio</p>
      </div>
    );
  }

  // Gather all unique spec keys to align the tables
  const allSpecKeys = Array.from(new Set([...Object.keys(itemA.specs || {}), ...Object.keys(itemB.specs || {})]));

  return (
    <div className="grid gap-8 md:grid-cols-2">
      
      {/* Column A */}
      <div className="space-y-8 rounded-xl border border-edge bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {itemA.image_url ? (
            <div className="relative aspect-square w-48 shrink-0 mb-4 mix-blend-screen">
              <Image src={itemA.image_url} alt={itemA.title} fill className="object-contain" />
            </div>
          ) : (
            <div className="mb-4 h-48 w-48 rounded-lg bg-edge-strong" />
          )}
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{itemA.title}</h2>
          <p className="mt-2 text-sm text-dim">{itemA.description}</p>
        </div>

        <ProsCons pros={itemA.pros} cons={itemA.cons} idealFor="" />

        <div>
          <h3 className="font-display text-lg font-medium text-ink border-b border-edge pb-2 mb-4">Specifications</h3>
          <ul className="divide-y divide-edge">
            {allSpecKeys.map((key) => (
              <li key={key} className="flex justify-between py-2 text-sm">
                <span className="text-faint">{key}</span>
                <span className="text-dim font-medium text-right max-w-[60%]">{itemA.specs?.[key] || "—"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Column B */}
      <div className="space-y-8 rounded-xl border border-edge bg-surface p-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          {itemB.image_url ? (
            <div className="relative aspect-square w-48 shrink-0 mb-4 mix-blend-screen">
              <Image src={itemB.image_url} alt={itemB.title} fill className="object-contain" />
            </div>
          ) : (
            <div className="mb-4 h-48 w-48 rounded-lg bg-edge-strong" />
          )}
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">{itemB.title}</h2>
          <p className="mt-2 text-sm text-dim">{itemB.description}</p>
        </div>

        <ProsCons pros={itemB.pros} cons={itemB.cons} idealFor="" />

        <div>
          <h3 className="font-display text-lg font-medium text-ink border-b border-edge pb-2 mb-4">Specifications</h3>
          <ul className="divide-y divide-edge">
            {allSpecKeys.map((key) => (
              <li key={key} className="flex justify-between py-2 text-sm">
                <span className="text-faint">{key}</span>
                <span className="text-dim font-medium text-right max-w-[60%]">{itemB.specs?.[key] || "—"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}
