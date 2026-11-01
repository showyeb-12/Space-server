import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudioDetail } from "@/features/studios/studio-detail";
import { getStudio } from "@/features/studios/get-studio";

interface StudioPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: StudioPageProps): Promise<Metadata> {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) {
    return { title: "Studio not found" };
  }

  const description = studio.overview.slice(0, 155);

  return {
    title: studio.title,
    description,
    openGraph: {
      title: studio.title,
      description,
      images: [{ url: studio.imageUrl }],
    },
  };
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { id } = await params;
  const studio = await getStudio(id);

  if (!studio) {
    notFound();
  }

  return <StudioDetail studio={studio} />;
}
