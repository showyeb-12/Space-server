import { cache } from "react";
import type { Studio } from "@/types";

const objectIdPattern = /^[a-f\d]{24}$/i;

export const getStudio = cache(async (id: string): Promise<Studio | null> => {
  if (!objectIdPattern.test(id)) {
    return null;
  }

  const apiBase = (
    process.env.API_PROXY_TARGET ?? "http://localhost:5000"
  ).replace(/\/$/, "");

  const response = await fetch(
    `${apiBase}/api/studios/${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error("The studio could not be loaded.");
  }

  const payload = (await response.json()) as {
    data: { studio: Studio };
  };

  return payload.data.studio;
});
