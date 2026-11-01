"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Search,
  SearchX,
  SlidersHorizontal,
  WifiOff,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { StudioCardSkeleton } from "@/components/ui/skeleton";
import { StudioCard } from "@/features/studios/studio-card";
import { api } from "@/lib/api";
import { STUDIO_CATEGORIES } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import type { PaginatedStudios } from "@/types";

const PAGE_SIZE = 9;

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

const priceBands = [
  { value: "", label: "Any price", minRate: undefined, maxRate: undefined },
  { value: "under-60", label: "Under $60/hr", minRate: undefined, maxRate: 60 },
  { value: "60-90", label: "$60 – $90/hr", minRate: 60, maxRate: 90 },
  { value: "90-130", label: "$90 – $130/hr", minRate: 90, maxRate: 130 },
  { value: "130-plus", label: "$130+/hr", minRate: 130, maxRate: undefined },
] as const;

export function StudiosExplorer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const minRate = searchParams.get("minRate") ?? "";
  const maxRate = searchParams.get("maxRate") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback(
    (changes: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, []);

  function handleSearchChange(value: string) {
    setSearch(value);

    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      updateParams({ search: value.trim() || null, page: null });
    }, 400);
  }

  function applySearch() {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    updateParams({ search: search.trim() || null, page: null });
  }

  function selectPriceBand(value: string) {
    const band = priceBands.find((option) => option.value === value);

    updateParams({
      minRate: band?.minRate ? String(band.minRate) : null,
      maxRate: band?.maxRate ? String(band.maxRate) : null,
      page: null,
    });
  }

  function resetFilters() {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setSearch("");
    router.replace(pathname, { scroll: false });
  }

  function goToPage(nextPage: number) {
    updateParams({ page: nextPage <= 1 ? null : String(nextPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    if (searchParams.get("search")) params.set("search", searchParams.get("search")!);
    if (category) params.set("category", category);
    if (minRate) params.set("minRate", minRate);
    if (maxRate) params.set("maxRate", maxRate);
    if (sort) params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", String(PAGE_SIZE));

    return params.toString();
  }, [category, maxRate, minRate, page, searchParams, sort]);

  const studiosQuery = useQuery({
    queryKey: ["studios", "explore", queryString],
    queryFn: async () => {
      const response = await api.get<PaginatedStudios>(
        `/studios?${queryString}`,
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
  });

  const activePriceBand = priceBands.find(
    (band) =>
      String(band.minRate ?? "") === minRate &&
      String(band.maxRate ?? "") === maxRate,
  );

  const hasFilters = Boolean(
    searchParams.get("search") ||
      category ||
      minRate ||
      maxRate ||
      (sort && sort !== "newest"),
  );

  const total = studiosQuery.data?.pagination.total ?? 0;
  const totalPages = studiosQuery.data?.pagination.totalPages ?? 0;
  const firstResult = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastResult = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="container-shell py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="eyebrow">
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Studio directory
        </p>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
          Find the room for the work.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-base-content/60 sm:text-base">
          Search by name or neighborhood, narrow by discipline and budget, then
          request the exact slot you need.
        </p>
      </div>

      <div className="mt-10 rounded-[1.5rem] border border-base-content/10 bg-base-200/40 p-4 sm:p-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            applySearch();
          }}
          className="flex flex-col gap-3 lg:flex-row lg:items-center"
        >
          <label className="relative flex-1">
            <span className="sr-only">Search studios</span>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-base-content/35"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search by studio name, area, or amenity…"
              className="input input-bordered h-12 w-full rounded-xl border-base-content/10 bg-base-100 pl-11 pr-4 text-sm focus:border-base-content/30 focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <select
              value={activePriceBand?.value ?? ""}
              onChange={(event) => selectPriceBand(event.target.value)}
              className="select select-bordered h-12 min-h-0 rounded-xl border-base-content/10 bg-base-100 text-sm font-medium focus:border-base-content/30 focus:outline-none"
              aria-label="Filter by price"
            >
              {priceBands.map((band) => (
                <option key={band.value} value={band.value}>
                  {band.label}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(event) =>
                updateParams({
                  sort:
                    event.target.value === "newest"
                      ? null
                      : event.target.value,
                  page: null,
                })
              }
              className="select select-bordered h-12 min-h-0 rounded-xl border-base-content/10 bg-base-100 text-sm font-medium focus:border-base-content/30 focus:outline-none"
              aria-label="Sort studios"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-base-content/10 pt-4">
          <button
            type="button"
            onClick={() => updateParams({ category: null, page: null })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
              !category
                ? "border-base-content bg-base-content text-base-100"
                : "border-base-content/10 bg-base-100 text-base-content/60 hover:border-base-content/30 hover:text-base-content",
            )}
          >
            All studios
          </button>
          {STUDIO_CATEGORIES.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                updateParams({
                  category: category === option ? null : option,
                  page: null,
                })
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                category === option
                  ? "border-base-content bg-base-content text-base-100"
                  : "border-base-content/10 bg-base-100 text-base-content/60 hover:border-base-content/30 hover:text-base-content",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-base-content/55" aria-live="polite">
          {studiosQuery.isPending ? (
            "Loading studios…"
          ) : total === 0 ? (
            "No studios found"
          ) : (
            <>
              Showing{" "}
              <span className="font-semibold text-base-content">
                {firstResult}–{lastResult}
              </span>{" "}
              of <span className="font-semibold text-base-content">{total}</span>{" "}
              studios
            </>
          )}
        </p>

        {hasFilters ? (
          <div className="flex flex-wrap items-center gap-2">
            {searchParams.get("search") ? (
              <FilterChip
                label={`“${searchParams.get("search")}”`}
                onRemove={() => {
                  setSearch("");
                  updateParams({ search: null, page: null });
                }}
              />
            ) : null}
            {category ? (
              <FilterChip
                label={category}
                onRemove={() => updateParams({ category: null, page: null })}
              />
            ) : null}
            {activePriceBand?.value ? (
              <FilterChip
                label={
                  activePriceBand.minRate && activePriceBand.maxRate
                    ? `${formatCurrency(activePriceBand.minRate)}–${formatCurrency(activePriceBand.maxRate)}/hr`
                    : activePriceBand.maxRate
                      ? `Under ${formatCurrency(activePriceBand.maxRate)}/hr`
                      : `${formatCurrency(activePriceBand.minRate ?? 0)}+/hr`
                }
                onRemove={() =>
                  updateParams({ minRate: null, maxRate: null, page: null })
                }
              />
            ) : null}
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-base-content/50 underline-offset-4 hover:text-base-content hover:underline"
            >
              Clear all
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        {studiosQuery.isPending ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <StudioCardSkeleton key={index} />
            ))}
          </div>
        ) : studiosQuery.isError ? (
          <EmptyState
            icon={WifiOff}
            title="The studio list did not load"
            description="The API may be taking a quick break. Try again in a moment."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => void studiosQuery.refetch()}
              >
                <RefreshCw className="size-3.5" aria-hidden="true" />
                Try again
              </Button>
            }
          />
        ) : studiosQuery.data && studiosQuery.data.studios.length > 0 ? (
          <div
            className={cn(
              "grid gap-5 transition-opacity sm:grid-cols-2 xl:grid-cols-3",
              studiosQuery.isFetching && "opacity-60",
            )}
          >
            {studiosQuery.data.studios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No studios match those filters"
            description="Try a different category or a wider price range. There is a room for almost every kind of work."
            action={
              <Button variant="primary" size="sm" onClick={resetFilters}>
                Reset filters
              </Button>
            }
          />
        )}
      </div>

      {totalPages > 1 ? (
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-base-content/10 pt-6 sm:flex-row">
          <p className="text-xs text-base-content/45">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-base-content/10 bg-base-100 py-1 pl-3 pr-1.5 text-xs font-semibold text-base-content/65">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="grid size-5 place-items-center rounded-full text-base-content/40 transition-colors hover:bg-base-200 hover:text-base-content"
        aria-label={`Remove ${label} filter`}
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </span>
  );
}

export function StudiosExplorerSkeleton() {
  return (
    <div className="container-shell py-12 sm:py-16">
      <div className="h-4 w-32 animate-pulse rounded-full bg-base-300/70" />
      <div className="mt-5 h-14 w-full max-w-xl animate-pulse rounded-2xl bg-base-300/70" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded-full bg-base-300/70" />
      <div className="mt-10 h-40 rounded-[1.5rem] border border-base-content/10 bg-base-200/40" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
          <StudioCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
