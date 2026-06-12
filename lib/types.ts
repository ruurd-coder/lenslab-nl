export type PhotographerType = "fotograaf" | "videograaf" | "beide";
export type MembershipTier = "free" | "plus" | "premium";

export interface Photographer {
  id: string;
  user_id: string | null;
  slug: string;
  business_name: string;
  contact_name: string | null;
  type: PhotographerType;
  bio: string | null;
  avatar_url: string | null;
  hero_image_url: string | null;
  portfolio_images: string[];                          // legacy / hero thumbnails
  portfolio_by_category: Record<string, string[]>;     // { "Familie": ["url1", ...], max 10 per cat }
  specialties: string[];
  regions: string[];
  city: string | null;
  website_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  phone: string | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_published: boolean;
  is_b2b: boolean;
  membership_tier: MembershipTier;
  subscription_cancel_at?: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  province: string | null;
  city: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface PhotographyType {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  hero_image_url: string | null;
}

export type AnalyticsEventType =
  | "impression"
  | "profile_click"
  | "mail_click"
  | "instagram_click"
  | "linkedin_click"
  | "website_click"
  | "contact_request";
