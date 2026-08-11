"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Star, MessageSquareText } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user_profiles?: {
    username: string | null;
  } | null;
};

export function CommunityReviews({
  entityId,
  entityType,
  initialReviews = [],
}: {
  entityId: string;
  entityType: "product" | "software";
  initialReviews?: Review[];
}) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(initialReviews.length === 0);

  // Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const fetchReviews = async () => {
      const { data } = await supabase
        .from("community_reviews")
        .select(`
          id, rating, comment, created_at,
          user_profiles ( username )
        `)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false });

      if (data) {
        setReviews(data as any);
      }
      setLoading(false);
    };

    if (initialReviews.length === 0) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [entityId, initialReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setSubmitting(true);

    const { data, error } = await supabase
      .from("community_reviews")
      .insert({
        user_id: session.user.id,
        entity_id: entityId,
        entity_type: entityType,
        rating,
        comment,
      })
      .select(`
        id, rating, comment, created_at,
        user_profiles ( username )
      `)
      .single();

    if (error) {
      alert("Error submitting review. You might have already reviewed this item.");
    } else if (data) {
      setReviews([data as any, ...reviews]);
      setComment("");
      setRating(5);
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-12 rounded-2xl border border-edge bg-surface/50 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink flex items-center gap-2">
            <MessageSquareText className="h-5 w-5 text-accent" />
            Community Reviews
          </h2>
          <p className="text-dim text-sm mt-1">Real feedback from Fathom Layer users.</p>
        </div>
        {avgRating && (
          <div className="flex items-center gap-2 bg-surface border border-edge px-4 py-2 rounded-xl">
            <Star className="h-5 w-5 fill-accent text-accent" />
            <span className="font-display text-xl font-bold text-ink">{avgRating}</span>
            <span className="text-faint text-sm">({reviews.length})</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-2 bg-edge rounded w-3/4"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-edge rounded col-span-2"></div>
                    <div className="h-2 bg-edge rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-edge rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-dim italic bg-surface border border-edge rounded-lg p-6 text-center">
              No reviews yet. Be the first to share your experience!
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="rounded-xl border border-edge bg-surface p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-ink">
                    {rev.user_profiles?.username || "Anonymous User"}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3 w-3 ${
                          star <= rev.rating ? "fill-accent text-accent" : "text-edge fill-surface"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-dim whitespace-pre-wrap">{rev.comment}</p>
                <div className="mt-3 text-xs text-faint">
                  {new Date(rev.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="md:col-span-1">
          <div className="rounded-xl border border-edge bg-surface p-6 sticky top-24">
            <h3 className="font-medium text-ink mb-4">Write a Review</h3>
            {session ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-dim mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        onClick={() => setRating(star)}
                        className={`transition-transform hover:scale-110 ${
                          star <= rating ? "text-accent" : "text-edge"
                        }`}
                      >
                        <Star className={`h-6 w-6 ${star <= rating ? "fill-current" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-dim mb-2">Your experience</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-edge bg-surface p-3 text-sm text-ink focus:border-accent-bright focus:outline-none"
                    placeholder="What did you like or dislike?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-ink py-2.5 text-sm font-medium text-surface hover:bg-ink/90 disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post Review"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-dim mb-4">Sign in to join the discussion and leave a review.</p>
                <a
                  href="/login"
                  className="inline-block w-full rounded-lg bg-ink py-2.5 text-sm font-medium text-surface hover:bg-ink/90"
                >
                  Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
