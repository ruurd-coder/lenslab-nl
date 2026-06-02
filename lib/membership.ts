import type { MembershipTier } from "@/lib/types";

export interface MembershipConfig {
  tier: MembershipTier;
  label: string;
  price: string;
  maxCategories: number;
  maxPhotosPerCategory: number;
  maxLocations: number | null; // null = onbeperkt
  showWebsite: boolean;
  showSocials: boolean;
  showMail: boolean;
  showReviews: boolean;
  showOtherPhotographers: boolean;
  featuredOnHome: boolean;
  listingPriority: number; // hogere waarde = hoger in listing
}

export const MEMBERSHIP: Record<MembershipTier, MembershipConfig> = {
  free: {
    tier: "free",
    label: "Free",
    price: "Gratis",
    maxCategories: 1,
    maxPhotosPerCategory: 10,
    maxLocations: 1,
    showWebsite: false,
    showSocials: false,
    showMail: true,
    showReviews: true,
    showOtherPhotographers: true,
    featuredOnHome: false,
    listingPriority: 1,
  },
  plus: {
    tier: "plus",
    label: "Plus",
    price: "€7/maand",
    maxCategories: 4,
    maxPhotosPerCategory: 10,
    maxLocations: 3,
    showWebsite: true,
    showSocials: true,
    showMail: true,
    showReviews: true,
    showOtherPhotographers: false,
    featuredOnHome: false,
    listingPriority: 2,
  },
  premium: {
    tier: "premium",
    label: "Premium",
    price: "€14/maand",
    maxCategories: 8,
    maxPhotosPerCategory: 10,
    maxLocations: null,
    showWebsite: true,
    showSocials: true,
    showMail: true,
    showReviews: true,
    showOtherPhotographers: false,
    featuredOnHome: true,
    listingPriority: 3,
  },
};

export function getMembership(tier: MembershipTier): MembershipConfig {
  return MEMBERSHIP[tier];
}
