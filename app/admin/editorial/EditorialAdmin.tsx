"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteEditorial, saveEditorial, setEditorialStatus } from "./actions";

export type EditorialRow = {
  id: string;
  content_type: string;
  title: string;
  slug: string;
  body_markdown: string;
  tags: string[];
  status: string;
  expected_release_date: string | null;
  launch_confidence: string | null;
  source_url: string | null;
  updated_at: string;
};

type Form = {
  id?: string;
  content_type: "glossary" | "guide" | "launch";
  title: string;
  slug: string;
  body_markdown: string;
  tags: string;
  expected_release_date: string;
  launch_confidence: "rumored" | "announced" | "confirmed" | "";
  source_url: string;
};

const EMPTY: Form = {
  content_type: "glossary",
  title: "",
  slug: "",
  body_markdown: "",
  tags: "",
  expected_release_date: "",
  launch_confidence: "",
  source_url: "",
};

const BASE_PATH: Record<string, string> = {
  glossary: "/glossary",
  guide: "/guides",
  launch: "/radar",
};

// CRUD de editorial_pages — o operador publica sem tocar em SQL.
export function EditorialAdmin({ rows }: { rows: EditorialRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (patch: Partial<Form>) => setForm((f) => (f ? { ...f, ...patch } : f));

  function edit(row: EditorialRow) {
    setError(null);
    setForm({
      id: row.id,
      content_type: row.content_type as Form["content_type"],
      title: row.title,
      slug: row.slug,
      body_markdown: row.body_markdown,
      tags: row.tags.join(", "),
      expected_release_date: row.expected_release_date ?? "",
      launch_confidence: (row.launch_confidence as Form["launch_confidence"]) ?? "",
      source_url: row.source_url ?? "",
    });
  }

  function save() {
    if (!form) return;
    setError(null);
    startTransition(async () => {
      const result = await saveEditorial({
        id: form.id,
        content_type: form.content_type,
        title: form.title,
        slug: form.slug,
        body_markdown: form.body_markdown,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        expected_release_date: form.expected_release_date || null,
        launch_confidence: form.launch_confidence || null,
        source_url: form.source_url || null,
      });
      if (!result.ok) setError(result.error ?? "Unknown error");
      else {
        setForm(null);
        router.refresh();
      }
    });
  }

  function toggle(row: EditorialRow) {
    startTransition(async () => {
      const result = await setEditorialStatus(row.id, row.status !== "published");
      if (!result.ok) setError(result.error ?? "Unknown error");
      else router.refresh();
    });
  }

  function remove(row: EditorialRow) {
    if (!confirm(`Delete "${row.title}" permanently?`)) return;
    startTransition(async () => {
      const result = await deleteEditorial(row.id);
      if (!result.ok) setError(result.error ?? "Unknown error");
      else router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setError(null);
            setForm({ ...EMPTY });
          }}
          className="rounded bg-accent px-3 py-1.5 text-sm text-white"
        >
          New entry
        </button>
        <span className="text-sm text-dim">
          {rows.length} entr{rows.length === 1 ? "y" : "ies"} ·{" "}
          {rows.filter((r) => r.status === "published").length} published
        </span>
      </div>

      {error ? (
        <p className="rounded border border-warn/40 bg-warn/10 px-3 py-2 text-sm text-warn">
          {error}
        </p>
      ) : null}

      {form ? (
        <div className="space-y-3 rounded-lg border border-accent bg-surface p-5">
          <div className="flex flex-wrap gap-3">
            <label className="text-sm">
              <span className="text-dim">Type</span>
              <select
                value={form.content_type}
                onChange={(e) => set({ content_type: e.target.value as Form["content_type"] })}
                className="mt-1 block rounded border border-edge bg-bg p-2"
              >
                <option value="glossary">glossary</option>
                <option value="guide">guide</option>
                <option value="launch">launch (radar)</option>
              </select>
            </label>
            <label className="flex-1 text-sm">
              <span className="text-dim">Title</span>
              <input
                value={form.title}
                onChange={(e) => set({ title: e.target.value })}
                className="mt-1 w-full rounded border border-edge bg-bg p-2"
              />
            </label>
            <label className="text-sm">
              <span className="text-dim">Slug (auto if blank)</span>
              <input
                value={form.slug}
                onChange={(e) => set({ slug: e.target.value })}
                className="mt-1 w-full rounded border border-edge bg-bg p-2 font-mono text-xs"
              />
            </label>
          </div>

          {form.content_type === "launch" ? (
            <div className="flex flex-wrap gap-3">
              <label className="text-sm">
                <span className="text-dim">Expected date</span>
                <input
                  type="date"
                  value={form.expected_release_date}
                  onChange={(e) => set({ expected_release_date: e.target.value })}
                  className="mt-1 block rounded border border-edge bg-bg p-2"
                />
              </label>
              <label className="text-sm">
                <span className="text-dim">Confidence</span>
                <select
                  value={form.launch_confidence}
                  onChange={(e) =>
                    set({ launch_confidence: e.target.value as Form["launch_confidence"] })
                  }
                  className="mt-1 block rounded border border-edge bg-bg p-2"
                >
                  <option value="">—</option>
                  <option value="rumored">rumored</option>
                  <option value="announced">announced</option>
                  <option value="confirmed">confirmed</option>
                </select>
              </label>
              <label className="flex-1 text-sm">
                <span className="text-dim">Source URL (required for launches)</span>
                <input
                  value={form.source_url}
                  onChange={(e) => set({ source_url: e.target.value })}
                  className="mt-1 w-full rounded border border-edge bg-bg p-2"
                />
              </label>
            </div>
          ) : null}

          <label className="block text-sm">
            <span className="text-dim">Body (markdown)</span>
            <textarea
              value={form.body_markdown}
              onChange={(e) => set({ body_markdown: e.target.value })}
              rows={16}
              className="mt-1 w-full rounded border border-edge bg-bg p-3 font-mono text-xs leading-relaxed"
            />
          </label>

          <label className="block text-sm">
            <span className="text-dim">Tags (comma separated)</span>
            <input
              value={form.tags}
              onChange={(e) => set({ tags: e.target.value })}
              className="mt-1 w-full rounded border border-edge bg-bg p-2"
            />
          </label>

          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={pending}
              className="rounded bg-accent px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setForm(null)}
              className="rounded border border-edge px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <ul className="space-y-2">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded border border-edge bg-surface px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{row.title}</p>
              <p className="font-mono text-xs text-faint">
                {row.content_type} · {BASE_PATH[row.content_type]}/{row.slug} ·{" "}
                <span className={row.status === "published" ? "text-ok" : "text-warn"}>
                  {row.status}
                </span>
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => edit(row)}
                className="rounded border border-edge px-3 py-1 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => toggle(row)}
                disabled={pending}
                className="rounded border border-edge px-3 py-1 text-sm disabled:opacity-50"
              >
                {row.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button
                onClick={() => remove(row)}
                disabled={pending}
                className="rounded border border-edge px-3 py-1 text-sm text-warn disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
