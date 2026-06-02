import { redirect, notFound } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import AdminEditClient from "./admin-edit-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditPhotographerPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) redirect("/login");

  const serviceSupabase = await createServiceClient();
  const { data: photographer } = await serviceSupabase
    .from("photographers")
    .select("*")
    .eq("id", id)
    .single();

  if (!photographer) notFound();

  return <AdminEditClient photographer={photographer} />;
}
