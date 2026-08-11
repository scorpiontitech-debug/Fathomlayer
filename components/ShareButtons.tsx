"use client";

import { useState } from "react";

export function ShareButtons({ 
  title, 
  score, 
  urlPath 
}: { 
  title: string; 
  score: number | null; 
  urlPath: string;
}) {
  const [copied, setCopied] = useState(false);

  const getFullUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin + urlPath;
    }
    return `https://fathomlayer.com${urlPath}`;
  };

  const shareOnX = () => {
    const url = getFullUrl();
    const scoreText = score ? ` Incredible score of ${score}/10!` : "";
    const text = `Just saw the deep dive on ${title} at Fathom Layer.${scoreText}`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, "_blank", "noopener,noreferrer");
  };

  const copyEmbedCode = () => {
    const url = getFullUrl();
    const scoreParam = score ? `?score=${score}` : "";
    const embedCode = `<a href="${url}" target="_blank" rel="noopener noreferrer"><img src="https://fathomlayer.com/api/badge${scoreParam}" alt="Featured on Fathom Layer" /></a>`;
    
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row md:flex-col mt-4 pt-4 border-t border-edge/50">
      <button
        onClick={shareOnX}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-edge hover:text-white border border-edge"
        title="Share this Fathom Layer page on X (Twitter)"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
        Share on X
      </button>

      {score !== null && (
        <button
          onClick={copyEmbedCode}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-surface px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-edge hover:text-white border border-edge"
          title="Copy the HTML code to embed our Design Score badge on your website"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Copied HTML!
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              Embed Badge
            </>
          )}
        </button>
      )}
    </div>
  );
}
