import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WishExperience } from "@/components/wish/WishExperience";
import { getWish } from "@/lib/wish";

const TEASER = "Someone made something special just for you. Tap to open your surprise.";

// The WhatsApp preview teases the surprise without spoiling the design.
export async function generateMetadata({ params }: PageProps<"/w/[id]">): Promise<Metadata> {
  const { id } = await params;
  const wish = getWish(id);
  if (!wish) return { title: "Wish not found" };
  const title = `${wish.to}, you have a surprise 🎁`;
  return {
    title,
    description: TEASER,
    openGraph: { title, description: TEASER, type: "website" },
    robots: { index: false, follow: false },
  };
}

async function WishLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const wish = getWish(id);
  if (!wish) notFound();
  return <WishExperience wish={wish} />;
}

export default function WishPage({ params }: PageProps<"/w/[id]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#12082b]" />}>
      <WishLoader params={params} />
    </Suspense>
  );
}
