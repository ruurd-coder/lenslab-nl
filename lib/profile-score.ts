import type { Photographer } from "./types";

export interface ScoreBreakdown {
  portfolio: { score: number; max: 35; filled: number };
  reviews: { score: number; max: 30 };
  links: { score: number; max: 20; hasWebsite: boolean; hasInstagram: boolean; hasLinkedin: boolean };
  recency: { score: number; max: 15; portfolioRecent: boolean; reviewRecent: boolean };
  total: number;
}

export interface ScoreTip {
  text: string;
  pts: number;
}

export function calcBreakdown(p: Photographer): ScoreBreakdown {
  const now = Date.now();

  // Portfolio
  const byCategory = (p.portfolio_by_category as Record<string, string[]>) ?? {};
  const filled = Object.values(byCategory).filter((imgs) => imgs.length >= 5).length;
  const portfolioScore = Math.min(filled, 5) * 7;

  // Reviews
  const ratingScore = Math.round((p.rating / 5) * 20);
  const volumeScore = Math.min(p.review_count, 10);
  const reviewsScore = ratingScore + volumeScore;

  // Links
  const hasWebsite = !!(p.website_url?.trim());
  const hasInstagram = !!(p.instagram_url?.trim());
  const hasLinkedin = !!(p.linkedin_url?.trim());
  const linksScore = (hasWebsite ? 8 : 0) + (hasInstagram ? 8 : 0) + (hasLinkedin ? 4 : 0);

  // Recency
  const updatedMs = new Date(p.updated_at).getTime();
  const portfolioRecent = now - updatedMs <= 30 * 24 * 3600 * 1000;
  const portfolioSemiRecent = now - updatedMs <= 90 * 24 * 3600 * 1000;
  const reviewRecent = !!p.last_review_at &&
    now - new Date(p.last_review_at).getTime() <= 30 * 24 * 3600 * 1000;

  const recencyScore =
    (portfolioRecent ? 8 : portfolioSemiRecent ? 4 : 0) +
    (reviewRecent ? 7 : 0);

  const total = portfolioScore + reviewsScore + linksScore + recencyScore;

  return {
    portfolio: { score: portfolioScore, max: 35, filled },
    reviews: { score: reviewsScore, max: 30 },
    links: { score: linksScore, max: 20, hasWebsite, hasInstagram, hasLinkedin },
    recency: { score: recencyScore, max: 15, portfolioRecent, reviewRecent },
    total,
  };
}

export function calcTips(bd: ScoreBreakdown): ScoreTip[] {
  const tips: ScoreTip[] = [];

  const missingCategories = Math.max(0, 5 - bd.portfolio.filled);
  if (missingCategories > 0) {
    tips.push({
      text: `Voeg 5+ foto's toe aan ${missingCategories === 1 ? "nog 1 categorie" : `nog ${missingCategories} categorieën`}`,
      pts: missingCategories * 7,
    });
  }

  if (!bd.links.hasWebsite) tips.push({ text: "Voeg je website toe aan je profiel", pts: 8 });
  if (!bd.links.hasInstagram) tips.push({ text: "Voeg je Instagram toe aan je profiel", pts: 8 });
  if (!bd.links.hasLinkedin) tips.push({ text: "Voeg je LinkedIn toe aan je profiel", pts: 4 });

  if (!bd.recency.reviewRecent)
    tips.push({ text: "Vraag een klant om een review (geldt 30 dagen)", pts: 7 });

  if (!bd.recency.portfolioRecent)
    tips.push({ text: "Werk je portfolio bij om je recency-bonus te behouden", pts: bd.recency.portfolioRecent ? 0 : 8 });

  return tips.sort((a, b) => b.pts - a.pts);
}
