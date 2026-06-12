import { getStripe, TIER_FROM_PRICE } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Geen signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const photographerId = session.metadata?.photographer_id;
      const tier = session.metadata?.tier as "plus" | "premium" | undefined;

      if (photographerId && tier) {
        await supabase.from("photographers").update({
          membership_tier: tier,
          stripe_subscription_id: session.subscription as string,
          stripe_subscription_status: "active",
        }).eq("id", photographerId);
      }
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const photographerId = sub.metadata?.photographer_id;
      const priceId = sub.items.data[0]?.price.id;
      const tier = TIER_FROM_PRICE[priceId];

      if (photographerId) {
        const updates: any = { stripe_subscription_status: sub.status };
        if (tier) updates.membership_tier = tier;
        if (sub.cancel_at_period_end && sub.cancel_at) {
          updates.subscription_cancel_at = new Date(sub.cancel_at * 1000).toISOString();
        } else {
          updates.subscription_cancel_at = null;
        }
        if (["canceled", "unpaid", "past_due"].includes(sub.status)) {
          updates.membership_tier = "free";
          updates.subscription_cancel_at = null;
        }
        await supabase.from("photographers").update(updates).eq("id", photographerId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const photographerId = sub.metadata?.photographer_id;

      if (photographerId) {
        await supabase.from("photographers").update({
          membership_tier: "free",
          stripe_subscription_id: null,
          stripe_subscription_status: "canceled",
          subscription_cancel_at: null,
        }).eq("id", photographerId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
