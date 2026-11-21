"use client";

import { useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { api } from "@/lib/api";
import type { Review } from "@/types";

interface ReviewFormProps {
  studioId: string;
  onReviewAdded?: (review: Review) => void;
}

export function ReviewForm({ studioId, onReviewAdded }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-base-content/15 bg-base-200/30 p-5 text-center">
        <p className="text-sm text-base-content/65">
          Share your experience with this studio!
        </p>
        <Link
          href={`/login?redirect=/studios/${studioId}`}
          className="mt-3 inline-block"
        >
          <Button size="sm" variant="outline">
            Sign in to leave a review
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      toast.error("Please enter a review of at least 5 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post<{
        success: boolean;
        data: { studio: { reviews: Review[] } };
      }>(`/api/studios/${studioId}/reviews`, {
        rating,
        comment: comment.trim(),
      });

      toast.success("Thank you! Your review has been published.");
      setComment("");
      if (res.data?.data?.studio?.reviews?.[0] && onReviewAdded) {
        onReviewAdded(res.data.data.studio.reviews[0]);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to submit review.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-base-content/10 bg-base-100 p-5"
    >
      <h3 className="text-sm font-semibold tracking-tight">Leave a Review</h3>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="mr-2 text-xs text-base-content/60">Your Rating:</span>
        {Array.from({ length: 5 }, (_, i) => {
          const starVal = i + 1;
          return (
            <button
              key={starVal}
              type="button"
              className="p-1 transition-transform hover:scale-110 focus:outline-none"
              onMouseEnter={() => setHoverRating(starVal)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(starVal)}
            >
              <Star
                className={`size-5 transition-colors ${
                  starVal <= (hoverRating || rating)
                    ? "fill-current text-warning"
                    : "text-base-content/20"
                }`}
              />
            </button>
          );
        })}
      </div>

      <textarea
        className="mt-3 w-full rounded-xl border border-base-content/15 bg-base-200/40 p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        rows={3}
        placeholder="How was your production experience here?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isSubmitting}
      />

      <div className="mt-3 flex justify-end">
        <Button type="submit" size="sm" isLoading={isSubmitting}>
          Submit Review
        </Button>
      </div>
    </form>
  );
}
