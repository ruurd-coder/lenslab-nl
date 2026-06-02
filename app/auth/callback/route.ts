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
        // Bepaal rol: admin of photographer
        const role = isAdmin(user.email) ? "admin" : "photographer";

        // Upsert profiel met juiste rol
        await supabase.from("profiles").upsert({
          id: user.id,
          role,
          full_name: user.email,
        }, { onConflict: "id" });

        // Admin → /admin, photographer → /dashboard
        const redirectPath = role === "admin" ? "/admin" : "/dashboard";
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
