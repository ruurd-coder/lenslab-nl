import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-04-30.basil",
    });
  }
  return _stripe;
}

export const STRIPE_PRICES = {
  plus:    "price_1Te8s9LzPLkQ4VvbKpwArFhS",
  premium: "price_1Te8sdLzPLkQ4VvbYPpmupne",
} as const;

export const TIER_FROM_PRICE: Record<string, "plus" | "premium"> = {
  "price_1Te8s9LzPLkQ4VvbKpwArFhS": "plus",
  "price_1Te8sdLzPLkQ4VvbYPpmupne": "premium",
};
