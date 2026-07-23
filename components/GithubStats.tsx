import { Suspense } from "react";
import { Star, GitFork, Activity } from "lucide-react";

async function fetchGithubData(repo: string) {
  const res = await fetch(`https://api.github.com/repos/${repo}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!res.ok) return null;
  return res.json();
}

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

async function Stats({ repo }: { repo: string }) {
  const data = await fetchGithubData(repo);
  if (!data) return null;

  const lastUpdated = new Date(data.pushed_at || data.updated_at);
  const daysAgo = Math.floor((Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));
  const isStagnant = daysAgo > 180;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-edge bg-surface px-4 py-3 text-sm">
      <div className="flex items-center gap-1.5 text-ink">
        <Star className="h-4 w-4 text-accent" />
        <span className="font-medium">{formatNumber(data.stargazers_count)}</span>
      </div>
      <div className="flex items-center gap-1.5 text-dim">
        <GitFork className="h-4 w-4" />
        <span>{formatNumber(data.forks_count)}</span>
      </div>
      <div className="flex items-center gap-1.5 ml-auto">
        <Activity className={`h-4 w-4 ${isStagnant ? "text-error" : "text-success"}`} />
        <span className={isStagnant ? "text-error" : "text-dim"}>
          {isStagnant ? "Stagnant (>6 mo)" : `Updated ${daysAgo}d ago`}
        </span>
      </div>
    </div>
  );
}

export function GithubStats({ repo }: { repo: string | null }) {
  if (!repo) return null;
  return (
    <Suspense fallback={<div className="h-[46px] w-full animate-pulse rounded-lg bg-edge-strong" />}>
      <Stats repo={repo} />
    </Suspense>
  );
}
