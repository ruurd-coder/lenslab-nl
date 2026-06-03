import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user?.email) {
        // Check existing profile to avoid overwriting company users from lenslab.tech
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("role, organization_id")
          .eq("id", user.id)
          .single();

        const isCompanyUser = !!existingProfile?.organization_id;
        const isExistingAdmin = existingProfile?.role === "admin";

        if (!isCompanyUser && !isExistingAdmin) {
          // New user or photographer — set photographer role
          const role = isAdmin(user.email) ? "admin" : "photographer";
          await supabase.from("profiles").upsert({
            id: user.id,
            role,
            full_name: user.user_metadata?.full_name || user.email,
          }, { onConflict: "id" });
        }

        const redirectPath = isAdmin(user.email) ? "/admin" : "/dashboard";
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
