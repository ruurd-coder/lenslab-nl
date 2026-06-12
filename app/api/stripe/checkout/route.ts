import { createClient } from "@/lib/supabase/server";
import { getStripe, STRIPE_PRICES } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { tier } = await request.json();

    if (tier !== "plus" && tier !== "premium") {
      return NextResponse.json({ error: "Ongeldig tier" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    // Haal fotograaf op
    const { data: photographer } = await supabase
      .from("photographers")
      .select("id, email, business_name, stripe_customer_id")
      .eq("email", user.email)
      .single();

    if (!photographer) {
      return NextResponse.json({ error: "Profiel niet gevonden" }, { status: 404 });
    }

    const stripe = getStripe();
    let customerId = photographer.stripe_customer_id;

    // Maak Stripe klant aan als die nog niet bestaat
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: photographer.email || user.email,
        name: photographer.business_name,
        metadata: { photographer_id: photographer.id },
      });
      customerId = customer.id;

      await supabase
        .from("photographers")
        .update({ stripe_customer_id: customerId })
        .eq("id", photographer.id);
    }

    // Maak checkout session aan
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: STRIPE_PRICES[tier as "plus" | "premium"], quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/memberships`,
      metadata: {
        photographer_id: photographer.id,
        tier,
      },
      subscription_data: {
        metadata: {
          photographer_id: photographer.id,
          tier,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: true },
      locale: "nl",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
