"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { publishItem, rejectItem } from "./actions";

export type ReviewItem = {
  kind: "product" | "software";
  id: string;
  title: string;
  subtitle: string;
  category: string;
  specsJson: string;
  specCount: number;
  tags: string[];
  description: string;
  editorialNotes: string;
  designScore: number | null;
  pros: string[];
  cons: string[];
  idealFor: string[];
  priceFrom: number | null;
  releaseYear: number | null;
};

type Draft = {
  description: string;
  editorialNotes: string;
  designScore: string;
  pros: string;      // uma entrada por linha
  cons: string;
  idealFor: string;
  priceFrom: string;
  releaseYear: string;
};

const splitLines = (s: string) =>
  s.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

// Fila de revisão (dashboard-spec 2.2): A aprova, R rejeita, j/k navega.
// O gate de densidade (#11) é validado no servidor; o contador aqui é
// só feedback imediato pro operador.
export function ReviewQueue({ items }: { items: ReviewItem[] }) {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(
      items.map((i) => [
        i.id,
        {
          description: i.description,
          editorialNotes: i.editorialNotes,
          designScore: i.designScore?.toString() ?? "",
          pros: i.pros.join("\n"),
          cons: i.cons.join("\n"),
          idealFor: i.idealFor.join("\n"),
          priceFrom: i.priceFrom?.toString() ?? "",
          releaseYear: i.releaseYear?.toString() ?? "",
        },
      ])
    )
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [focusIndex, setFocusIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const buildInput = useCallback(
    (item: ReviewItem) => {
      const draft = drafts[item.id];
      return {
        kind: item.kind,
        id: item.id,
        description: draft.description,
        editorial_notes: draft.editorialNotes,
        design_score: draft.designScore.trim() === "" ? null : Number(draft.designScore),
        pros: splitLines(draft.pros),
        cons: splitLines(draft.cons),
        ideal_for: splitLines(draft.idealFor),
        price_from: draft.priceFrom.trim() === "" ? null : Number(draft.priceFrom),
        release_year: draft.releaseYear.trim() === "" ? null : Number(draft.releaseYear),
      };
    },
    [drafts]
  );

  const submitOne = useCallback(
    (item: ReviewItem) => {
      startTransition(async () => {
        const result = await publishItem(buildInput(item));
        if (!result.ok) {
          setErrors((e) => ({ ...e, [item.id]: result.error ?? "Unknown error" }));
        } else {
          router.refresh();
        }
      });
    },
    [buildInput, router]
  );

  const rejectOne = useCallback(
    (item: ReviewItem) => {
      startTransition(async () => {
        const result = await rejectItem(item.kind, item.id);
        if (!result.ok) {
          setErrors((e) => ({ ...e, [item.id]: result.error ?? "Unknown error" }));
        } else {
          router.refresh();
        }
      });
    },
    [router]
  );

  const publishSelected = useCallback(() => {
    startTransition(async () => {
      for (const item of items.filter((i) => selected.has(i.id))) {
        const result = await publishItem(buildInput(item));
        if (!result.ok) {
          setErrors((e) => ({ ...e, [item.id]: result.error ?? "Unknown error" }));
        }
      }
      router.refresh();
    });
  }, [items, selected, buildInput, router]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      const key = e.key.toLowerCase();
      if (key === "j") {
        setFocusIndex((i) => {
          const next = Math.min(i + 1, items.length - 1);
          cardRefs.current[next]?.scrollIntoView({ block: "nearest" });
          return next;
        });
      } else if (key === "k") {
        setFocusIndex((i) => {
          const next = Math.max(i - 1, 0);
          cardRefs.current[next]?.scrollIntoView({ block: "nearest" });
          return next;
        });
      } else if (key === "a" && items[focusIndex]) {
        submitOne(items[focusIndex]);
      } else if (key === "r" && items[focusIndex]) {
        rejectOne(items[focusIndex]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, focusIndex, submitOne, rejectOne]);

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--fl-dim)]">
        Queue is empty — nothing in pending_review.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-[var(--fl-dim)]">
        <span>
          {items.length} item(s) · <kbd>j</kbd>/<kbd>k</kbd> navigate, <kbd>A</kbd> approve,{" "}
          <kbd>R</kbd> reject
        </span>
        {selected.size > 0 ? (
          <button
            onClick={publishSelected}
            disabled={pending}
            className="rounded bg-accent px-3 py-1 text-white disabled:opacity-50"
          >
            Publish {selected.size} selected
          </button>
        ) : null}
      </div>

      {items.map((item, index) => {
        const draft = drafts[item.id];
        const density =
          item.specCount +
          splitLines(draft.pros).length +
          splitLines(draft.cons).length +
          splitLines(draft.idealFor).length;
        const set = (patch: Partial<Draft>) =>
          setDrafts((d) => ({ ...d, [item.id]: { ...d[item.id], ...patch } }));

        return (
          <div
            key={item.id}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className={`space-y-3 rounded border bg-surface p-4 ${
              index === focusIndex ? "border-accent" : "border-edge"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.has(item.id)}
                    onChange={(e) => {
                      setSelected((prev) => {
                        const next = new Set(prev);
                        if (e.target.checked) next.add(item.id);
                        else next.delete(item.id);
                        return next;
                      });
                    }}
                  />
                  <span className="font-medium">{item.title}</span>
                </label>
                <p className="text-sm text-dim">
                  {item.kind} · {item.category}
                  {item.subtitle ? ` · ${item.subtitle}` : ""}
                </p>
                <p className={`font-mono text-xs ${density >= 5 ? "text-ok" : "text-warn"}`}>
                  data density: {density}/5 required (specs {item.specCount} + pros/cons/ideal-for)
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => submitOne(item)}
                  disabled={pending}
                  className="rounded bg-accent px-3 py-1 text-sm text-white disabled:opacity-50"
                >
                  Publish
                </button>
                <button
                  onClick={() => rejectOne(item)}
                  disabled={pending}
                  className="rounded border border-edge px-3 py-1 text-sm disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>

            {item.specsJson ? (
              <pre className="max-h-36 overflow-auto rounded bg-bg p-2 font-mono text-xs">
                {item.specsJson}
              </pre>
            ) : null}

            <div className="grid gap-2 lg:grid-cols-3">
              <label className="block text-sm">
                <span className="text-dim">Description</span>
                <textarea
                  value={draft.description}
                  onChange={(e) => set({ description: e.target.value })}
                  rows={5}
                  className="mt-1 w-full rounded border border-edge bg-bg p-2"
                />
              </label>
              <div className="space-y-2">
                <label className="block text-sm">
                  <span className="text-dim">Editorial note (required)</span>
                  <textarea
                    value={draft.editorialNotes}
                    onChange={(e) => set({ editorialNotes: e.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded border border-edge bg-bg p-2"
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  {item.kind === "product" ? (
                    <label className="block text-sm">
                      <span className="text-dim">Score 0–10</span>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.1}
                        value={draft.designScore}
                        onChange={(e) => set({ designScore: e.target.value })}
                        className="mt-1 w-20 rounded border border-edge bg-bg p-2 font-mono"
                      />
                    </label>
                  ) : null}
                  <label className="block text-sm">
                    <span className="text-dim">Price from</span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={draft.priceFrom}
                      onChange={(e) => set({ priceFrom: e.target.value })}
                      className="mt-1 w-24 rounded border border-edge bg-bg p-2 font-mono"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-dim">Release year</span>
                    <input
                      type="number"
                      min={2000}
                      max={2100}
                      value={draft.releaseYear}
                      onChange={(e) => set({ releaseYear: e.target.value })}
                      className="mt-1 w-24 rounded border border-edge bg-bg p-2 font-mono"
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm">
                  <span className="text-dim">Pros (one per line)</span>
                  <textarea
                    value={draft.pros}
                    onChange={(e) => set({ pros: e.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded border border-edge bg-bg p-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-dim">Cons (one per line)</span>
                  <textarea
                    value={draft.cons}
                    onChange={(e) => set({ cons: e.target.value })}
                    rows={3}
                    className="mt-1 w-full rounded border border-edge bg-bg p-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-dim">Ideal for (one per line)</span>
                  <textarea
                    value={draft.idealFor}
                    onChange={(e) => set({ idealFor: e.target.value })}
                    rows={2}
                    className="mt-1 w-full rounded border border-edge bg-bg p-2"
                  />
                </label>
              </div>
            </div>

            {errors[item.id] ? <p className="text-sm text-red-400">{errors[item.id]}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
