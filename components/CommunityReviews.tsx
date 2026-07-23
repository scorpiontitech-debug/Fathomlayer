"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Star, MessageSquare } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_profiles: {
    username: string;
    avatar_url: string | null;
  };
};

export function CommunityReviews({ entityId, entityType }: { entityId: string; entityType: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("community_reviews")
      .select("id, rating, comment, created_at, user_profiles(username, avatar_url)")
      .eq("entity_id", entityId)
      .eq("entity_type", entityType)
      .order("created_at", { ascending: false });
    
    if (data) {
      setReviews(data as any[]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    
    const { error } = await supabase.from("community_reviews").insert({
      user_id: session.user.id,
      entity_id: entityId,
      entity_type: entityType,
      rating,
      comment,
    });

    setSubmitting(false);
    if (!error) {
      setComment("");
      fetchReviews();
    } else {
      alert("Error posting review. You may have already reviewed this item.");
    }
  };

  return (
    <section className="mt-16 reveal border-t border-edge pt-12">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-ink flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-accent-bright" />
        Community Reviews
      </h2>
      <p className="mt-2 text-dim">Real experiences from developers and founders.</p>

      {session ? (
        <form onSubmit={handleSubmit} className="mt-8 rounded-xl border border-edge bg-surface p-6 shadow-sm">
          <h3 className="font-medium text-ink mb-4">Leave a Review</h3>
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`focus:outline-none ${star <= rating ? "text-accent-bright" : "text-edge-strong"}`}
              >
                <Star className="h-6 w-6 fill-current" />
              </button>
            ))}
          </div>
          <textarea
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What do you think about this?"
            className="w-full rounded-lg border border-edge bg-transparent p-3 text-sm text-ink placeholder:text-faint focus:border-accent-bright focus:outline-none focus:ring-1 focus:ring-accent-bright min-h-[100px]"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-ink px-5 py-2 text-sm font-medium text-surface transition hover:bg-ink/90 disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-edge-strong p-8 text-center bg-surface">
          <p className="text-dim">You must be logged in to leave a review.</p>
          <a href="/login" className="mt-4 inline-block text-accent-bright font-medium hover:underline">
            Sign In with GitHub →
          </a>
        </div>
      )}

      <div className="mt-12 space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 rounded-lg bg-edge-strong" />
            <div className="h-24 rounded-lg bg-edge-strong" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-faint italic">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-edge p-5 bg-surface">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-edge flex items-center justify-center font-mono text-xs text-ink overflow-hidden">
                    {review.user_profiles?.avatar_url ? (
                      <img src={review.user_profiles.avatar_url} alt="avatar" />
                    ) : (
                      review.user_profiles?.username?.charAt(0).toUpperCase() || "?"
                    )}
                  </div>
                  <span className="font-medium text-ink">{review.user_profiles?.username || "Anonymous"}</span>
                </div>
                <div className="flex text-accent-bright">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-edge-strong"}`} />
                  ))}
                </div>
              </div>
              <p className="text-dim text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
