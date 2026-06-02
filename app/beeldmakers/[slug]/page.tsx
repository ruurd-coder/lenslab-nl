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

export const revalidate = 3600;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("photographers")
    .select("business_name, meta_title, meta_description, city, specialties")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!data) return {};

  return {
    title: data.meta_title || `${data.business_name} — Beeldmaker op LensLab`,
    description: data.meta_description ||
      `Bekijk het portfolio van ${data.business_name}${data.city ? ` in ${data.city}` : ""}. Gespecialiseerd in ${data.specialties?.slice(0, 3).join(", ")}.`,
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

  return (
    <ProfileClient
      photographer={photographer as Photographer}
      reviews={(reviews as Review[]) || []}
    />
  );
}
