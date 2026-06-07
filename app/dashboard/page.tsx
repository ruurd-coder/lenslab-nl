import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Gebruik service client om fotograaf op te halen (bypast RLS)
  const serviceSupabase = await createServiceClient();

  const { data: photographer } = await serviceSupabase
    .from("photographers")
    .select("*")
    .eq("email", user.email)
    .single();

  if (!photographer) {
    return (
      <div className="min-h-screen bg-[#FCFAFF] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl border border-[#E9E7F0] p-8 max-w-md w-full text-center">
          <p className="text-3xl mb-4">🔍</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Geen profiel gevonden</h1>
          <p className="text-sm text-gray-500 mb-6">
            Er is geen beeldmakersprofiel gekoppeld aan <strong>{user.email}</strong>.
            Neem contact op via hello@lenslab.nl.
          </p>
          <a href="mailto:hello@lenslab.nl" className="inline-block bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors">
            Contact opnemen
          </a>
        </div>
      </div>
    );
  }

  // Koppel user_id via service client (bypast RLS — user_id was null)
  if (!photographer.user_id) {
    await serviceSupabase
      .from("photographers")
      .update({ user_id: user.id })
      .eq("id", photographer.id);
  }

  // Geef de fotograaf terug met de gekoppelde user_id
  const photographerWithUser = { ...photographer, user_id: user.id };

  const { data: messages } = await serviceSupabase
    .from("contact_messages")
    .select("*")
    .eq("photographer_id", photographer.id)
    .order("created_at", { ascending: false });

  return <DashboardClient photographer={photographerWithUser} user={user} messages={messages || []} />;
}
