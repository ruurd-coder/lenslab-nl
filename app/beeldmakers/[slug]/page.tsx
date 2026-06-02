import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Photographer } from "@/lib/types";
import ProfileClient from "./profile-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

async function getPhotographer(slug: string): Promise<Photographer | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("photographers")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return (data as Photographer) ?? null;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const photographer = await getPhotographer(slug);
  if (!photographer) return {};

  const title =
    photographer.meta_title ||
    `${photographer.business_name} — Beeldmaker op LensLab`;
  const description =
    photographer.meta_description ||
    `Bekijk het portfolio van ${photographer.business_name}${photographer.city ? ` in ${photographer.city}` : ""}. Gespecialiseerd in ${photographer.specialties.slice(0, 3).join(", ")}.`;

  return { title, description };
}

export default async function PhotographerProfilePage({ params }: Props) {
  const { slug } = await params;
  const photographer = await getPhotographer(slug);

  if (!photographer) notFound();

  return <ProfileClient photographer={photographer} />;
}
