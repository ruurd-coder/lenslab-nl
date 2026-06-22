import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const photographerId = searchParams.get("id");
  if (!photographerId) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const service = await createServiceClient();

  // Fetch the photographer to get their auth user_id
  const { data: photographer, error: fetchError } = await service
    .from("photographers")
    .select("id, user_id, business_name")
    .eq("id", photographerId)
    .single();

  if (fetchError || !photographer) {
    return NextResponse.json({ error: "Photographer not found" }, { status: 404 });
  }

  // Delete the photographer record (cascades related data via DB foreign keys)
  const { error: deleteError } = await service
    .from("photographers")
    .delete()
    .eq("id", photographerId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Delete the auth user if they have one
  if (photographer.user_id) {
    const { error: authError } = await service.auth.admin.deleteUser(photographer.user_id);
    if (authError) {
      // Photographer record is already deleted; log but don't fail the request
      console.error("Failed to delete auth user:", authError.message);
    }
  }

  return NextResponse.json({ success: true });
}
