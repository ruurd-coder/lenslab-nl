import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Photographer } from "@/lib/types";
import ProfileClient from "./profile-client";

export interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  review_text: string | null;
  review_date: string | null;
  source: string | null;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("photographers")
    .select("business_name, meta_title, meta_description, city, specialties, avatar_url, hero_image_url")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) return {};

  const ogImage = data.avatar_url || data.hero_image_url || null;

  return {
    title: data.meta_title || `${data.business_name} | LensLab`,
    description: data.meta_description ||
      `Bekijk het portfolio van ${data.business_name}${data.city ? ` in ${data.city}` : ""}. Gespecialiseerd in ${data.specialties?.slice(0, 2).join(", ")}.`,
    alternates: { canonical: `https://www.lenslab.nl/beeldmakers/${slug}` },
    openGraph: {
      siteName: 'LensLab',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function PhotographerProfilePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: photographer } = await supabase
    .from("photographers")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!photographer) notFound();

  // Haal echte reviews op voor deze fotograaf
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, reviewer_name, rating, review_text, review_date, source")
    .eq("photographer_id", photographer.id)
    .eq("is_published", true)
    .order("review_date", { ascending: false })
    .limit(6);

  // Haal andere fotografen op (echte data, met avatar_url)
  const { data: otherPhotographers } = await supabase
    .from("photographers")
    .select("id, slug, business_name, city, avatar_url")
    .eq("is_published", true)
    .neq("id", photographer.id)
    .order("rating", { ascending: false })
    .limit(8);

  return (
    <ProfileClient
      photographer={photographer as Photographer}
      reviews={(reviews as Review[]) || []}
      otherPhotographers={otherPhotographers || []}
    />
  );
}
