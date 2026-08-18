"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLink, makePrimary, saveLink } from "./actions";

export type EntityRow = {
  id: string;
  type: "product" | "software";
  title: string;
  path: string | null;
};

export type LinkRow = {
  id: string;
  entity_type: string;
  entity_id: string;
  program_name: string | null;
  url: string;
  label: string | null;
  region: string;
  is_primary: boolean;
  clicks: number;
};

type Form = {
  id?: string;
  entity_type: "product" | "software";
  entity_id: string;
  program_name: string;
  url: string;
  label: string;
  region: string;
  is_primary: boolean;
};

const EMPTY: Form = {
  entity_type: "product",
  entity_id: "",
  program_name: "",
  url: "",
  label: "",
  region: "global",
  is_primary: true,
};

// Programas do roadmap #16. PartnerStack e Impact são os motores; Amazon é
// cobertura. Lista sugerida, não fechada — o campo aceita qualquer texto.
const PROGRAMS = ["PartnerStack", "Impact", "Amazon Associates", "Direct", "ShareASale", "Awin"];
const REGIONS = ["global", "us", "uk", "eu", "br"];

const input =
  "w-full rounded border border-edge bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent-bright";
const btn =
  "rounded px-3 py-1.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export function LinksAdmin({
  entities,
  links,
}: {
  entities: EntityRow[];
  links: LinkRow[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"uncovered" | "covered" | "all">("uncovered");
  const [query, setQuery] = useState("");
  const [pending, startTransition] = useTransition();

  const set = (patch: Partial<Form>) => setForm((f) => (f ? { ...f, ...patch } : f));

  const byEntity = useMemo(() => {
    const map = new Map<string, LinkRow[]>();
    for (const l of links) {
      const key = `${l.entity_type}:${l.entity_id}`;
      const list = map.get(key);
      if (list) list.push(l);
      else map.set(key, [l]);
    }
    return map;
  }, [links]);

  const covered = useMemo(
    () => entities.filter((e) => (byEntity.get(`${e.type}:${e.id}`)?.length ?? 0) > 0).length,
    [entities, byEntity]
  );

  const totalClicks = useMemo(() => links.reduce((sum, l) => sum + l.clicks, 0), [links]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entities.filter((e) => {
      const count = byEntity.get(`${e.type}:${e.id}`)?.length ?? 0;
      if (filter === "uncovered" && count > 0) return false;
      if (filter === "covered" && count === 0) return false;
      if (q && !e.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [entities, byEntity, filter, query]);

  function addFor(entity: EntityRow) {
    setError(null);
    const existing = byEntity.get(`${entity.type}:${entity.id}`)?.length ?? 0;
    setForm({
      ...EMPTY,
      entity_type: entity.type,
      entity_id: entity.id,
      // Primeiro link de um item é o primário por padrão: sem primário, a
      // página de produto não tem botão de destaque.
      is_primary: existing === 0,
    });
  }

  function edit(link: LinkRow) {
    setError(null);
    setForm({
      id: link.id,
      entity_type: link.entity_type as Form["entity_type"],
      entity_id: link.entity_id,
      program_name: link.program_name ?? "",
      url: link.url,
      label: link.label ?? "",
      region: link.region,
      is_primary: link.is_primary,
    });
  }

  function submit() {
    if (!form) return;
    setError(null);
    startTransition(async () => {
      const res = await saveLink({
        id: form.id,
        entity_type: form.entity_type,
        entity_id: form.entity_id,
        program_name: form.program_name,
        url: form.url,
        label: form.label || null,
        region: form.region,
        is_primary: form.is_primary,
      });
      if (!res.ok) {
        setError(res.error ?? "Could not save the link.");
        return;
      }
      setForm(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await deleteLink(id);
      if (!res.ok) setError(res.error ?? "Could not delete the link.");
      else router.refresh();
    });
  }

  function promote(id: string) {
    setError(null);
    startTransition(async () => {
      const res = await makePrimary(id);
      if (!res.ok) setError(res.error ?? "Could not set the primary link.");
      else router.refresh();
    });
  }

  const formEntity = form ? entities.find((e) => e.id === form.entity_id) : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Items with a link" value={`${covered} / ${entities.length}`} warn={covered === 0} />
        <Stat label="Live links" value={String(links.length)} warn={links.length === 0} />
        <Stat label="Clicks tracked" value={String(totalClicks)} />
      </div>

      {error ? (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      ) : null}

      {form ? (
        <div className="space-y-4 rounded-lg border border-edge-strong bg-surface p-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-semibold text-ink">
              {form.id ? "Edit link" : "New link"}
              {formEntity ? <span className="ml-2 text-sm font-normal text-dim">{formEntity.title}</span> : null}
            </h2>
            <button type="button" className={`${btn} text-dim hover:text-ink`} onClick={() => setForm(null)}>
              Cancel
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="block text-xs uppercase tracking-wider text-dim">Program</span>
              <input
                className={input}
                list="fl-programs"
                value={form.program_name}
                onChange={(e) => set({ program_name: e.target.value })}
                placeholder="PartnerStack"
              />
              <datalist id="fl-programs">
                {PROGRAMS.map((p) => (
                  <option key={p} value={p} />
                ))}
              </datalist>
            </label>

            <label className="space-y-1.5">
              <span className="block text-xs uppercase tracking-wider text-dim">Region</span>
              <select className={input} value={form.region} onChange={(e) => set({ region: e.target.value })}>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="block text-xs uppercase tracking-wider text-dim">
                Destination URL <span className="normal-case text-faint">— the tracked affiliate URL, https only</span>
              </span>
              <input
                className={`${input} font-mono text-xs`}
                value={form.url}
                onChange={(e) => set({ url: e.target.value })}
                placeholder="https://partner.example.com/track?id=..."
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-xs uppercase tracking-wider text-dim">
                Button label <span className="normal-case text-faint">— optional</span>
              </span>
              <input
                className={input}
                value={form.label}
                onChange={(e) => set({ label: e.target.value })}
                placeholder="Buy at Amazon"
              />
            </label>

            <label className="flex items-center gap-2.5 self-end pb-2">
              <input
                type="checkbox"
                checked={form.is_primary}
                onChange={(e) => set({ is_primary: e.target.checked })}
                className="h-4 w-4 accent-[var(--accent,#0052ff)]"
              />
              <span className="text-sm text-ink">
                Primary — gets the highlighted button
              </span>
            </label>
          </div>

          <button
            type="button"
            className={`${btn} bg-accent text-white hover:bg-accent-bright`}
            onClick={submit}
            disabled={pending}
          >
            {pending ? "Saving…" : "Save link"}
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3 border-b border-edge pb-3">
        <div className="flex gap-1">
          {(["uncovered", "covered", "all"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`${btn} ${filter === f ? "bg-surface text-ink" : "text-dim hover:text-ink"}`}
            >
              {f === "uncovered" ? "No link yet" : f === "covered" ? "Monetised" : "All"}
            </button>
          ))}
        </div>
        <input
          className={`${input} ml-auto max-w-xs`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name…"
        />
      </div>

      {visible.length === 0 ? (
        <p className="rounded border border-dashed border-edge-strong px-4 py-8 text-center text-sm text-dim">
          {filter === "uncovered"
            ? "Every published item has at least one link. Nothing left uncovered."
            : "No items match this filter."}
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((entity) => {
            const rows = byEntity.get(`${entity.type}:${entity.id}`) ?? [];
            return (
              <li key={`${entity.type}:${entity.id}`} className="rounded-lg border border-edge bg-surface p-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-medium text-ink">{entity.title}</span>
                  <span className="rounded bg-surface-dim px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint">
                    {entity.type}
                  </span>
                  {entity.path ? (
                    <a
                      href={entity.path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-dim underline-offset-2 hover:text-ink hover:underline"
                    >
                      view page
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className={`${btn} ml-auto border border-edge-strong text-ink hover:border-accent-bright`}
                    onClick={() => addFor(entity)}
                  >
                    Add link
                  </button>
                </div>

                {rows.length > 0 ? (
                  <ul className="mt-3 space-y-1.5 border-t border-edge pt-3">
                    {rows.map((link) => (
                      <li key={link.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                        {link.is_primary ? (
                          <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-bright">
                            primary
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-faint hover:text-ink"
                            onClick={() => promote(link.id)}
                            disabled={pending}
                          >
                            make primary
                          </button>
                        )}
                        <span className="text-ink">{link.program_name ?? "—"}</span>
                        <span className="font-mono text-[11px] uppercase text-faint">{link.region}</span>
                        <span className="max-w-xs truncate font-mono text-[11px] text-dim" title={link.url}>
                          {link.url}
                        </span>
                        <span className="font-mono text-[11px] tabular-nums text-faint">
                          {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
                        </span>
                        <span className="ml-auto flex gap-2">
                          <button
                            type="button"
                            className="text-xs text-dim hover:text-ink"
                            onClick={() => edit(link)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-xs text-dim hover:text-red-400"
                            onClick={() => remove(link.id)}
                            disabled={pending}
                          >
                            Delete
                          </button>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-lg border border-edge bg-surface px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-dim">{label}</p>
      <p
        className={`mt-1 font-mono text-2xl tabular-nums ${warn ? "text-amber-400" : "text-ink"}`}
      >
        {value}
      </p>
    </div>
  );
}
