"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

const idsKey = ["wishlist", "ids"] as const;

export function WishlistButton({
  studioId,
  className,
  iconClassName,
  nextPath,
}: {
  studioId: string;
  className?: string;
  iconClassName?: string;
  nextPath?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const idsQuery = useQuery({
    queryKey: idsKey,
    queryFn: async (): Promise<string[]> => {
      const response = await api.get<{ studioIds: string[] }>("/wishlist/ids");
      return response.data.studioIds;
    },
    enabled: Boolean(user),
    staleTime: 60_000,
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<{ saved: boolean; studioId: string }>(
        `/wishlist/${id}`,
      );
      return response.data;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: idsKey });
      const previous = queryClient.getQueryData<string[]>(idsKey);

      queryClient.setQueryData<string[]>(idsKey, (current = []) =>
        current.includes(id)
          ? current.filter((item) => item !== id)
          : [...current, id],
      );

      return { previous };
    },
    onError: (error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(idsKey, context.previous);
      }

      toast.error(
        error instanceof ApiError
          ? error.message
          : "Could not update your saved studios.",
      );
    },
    onSuccess: (data) => {
      toast.success(
        data.saved ? "Saved to your wishlist." : "Removed from saved studios.",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: idsKey });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const isSaved = idsQuery.data?.includes(studioId) ?? false;

  function handleClick() {
    if (!user) {
      toast.info("Sign in to save studios for later.");
      const next = nextPath ?? `/studios/${studioId}`;
      router.push(`/login?next=${encodeURIComponent(next)}`);
      return;
    }

    mutation.mutate(studioId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={mutation.isPending}
      aria-pressed={isSaved}
      aria-label={isSaved ? "Remove from saved studios" : "Save studio"}
      title={isSaved ? "Remove from saved studios" : "Save studio"}
      className={cn(
        "grid size-10 place-items-center rounded-full border border-base-content/10 bg-base-100 text-base-content/55 shadow-sm transition-colors hover:border-base-content/30 hover:text-base-content disabled:opacity-60",
        isSaved && "border-primary/40 bg-primary/15 text-base-content",
        className,
      )}
    >
      {mutation.isPending ? (
        <span className="loading loading-spinner loading-xs" aria-hidden="true" />
      ) : (
        <Heart
          className={cn("size-4", isSaved && "fill-current", iconClassName)}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
