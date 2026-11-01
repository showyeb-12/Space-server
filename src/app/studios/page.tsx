import type { Metadata } from "next";
import { Suspense } from "react";
import {
  StudiosExplorer,
  StudiosExplorerSkeleton,
} from "@/features/studios/studios-explorer";

export const metadata: Metadata = {
  title: "Explore studios",
  description:
    "Search photo studios, film stages, podcast lounges, music suites, and workshop spaces by type, price, and location.",
};

export default function StudiosPage() {
  return (
    <Suspense fallback={<StudiosExplorerSkeleton />}>
      <StudiosExplorer />
    </Suspense>
  );
}
