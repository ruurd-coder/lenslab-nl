import type { Photographer } from "./types";

export interface ScoreBreakdown {
  portfolio: { score: number; max: number; filled: number; activeCategories: number };
  reviews: { score: number; max: 30 };
  links: { score: number; max: 20; hasWebsite: boolean; hasInstagram: boolean; hasLinkedin: boolean };
  recency: { score: number; max: 15; portfolioRecent: boolean; reviewRecent: boolean };
  totalMax: number;
  total: number;
}

export interface ScoreTip {
  text: string;
  pts: number;
}

export function calcBreakdown(p: Photographer): ScoreBreakdown {
  const now = Date.now();

  // Portfolio — max based on number of activated categories, capped at 5
  const byCategory = (p.portfolio_by_category as Record<string, string[]>) ?? {};
  const activeCategories = Object.keys(byCategory).length;
  const filled = Object.values(byCategory).filter((imgs) => imgs.length >= 5).length;
  const portfolioMax = Math.min(activeCategories, 5) * 7;
  const portfolioScore = Math.min(filled, 5) * 7;

  // Reviews — 6pt per review, max 5 reviews = 30pt
  const reviewsScore = Math.min(p.review_count ?? 0, 5) * 6;

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
  const totalMax = portfolioMax + 30 + 20 + 15;

  return {
    portfolio: { score: portfolioScore, max: portfolioMax, filled, activeCategories },
    reviews: { score: reviewsScore, max: 30 },
    links: { score: linksScore, max: 20, hasWebsite, hasInstagram, hasLinkedin },
    recency: { score: recencyScore, max: 15, portfolioRecent, reviewRecent },
    totalMax,
    total,
  };
}

export function calcTips(bd: ScoreBreakdown, p?: Photographer): ScoreTip[] {
  const tips: ScoreTip[] = [];

  const missingFilled = Math.max(0, bd.portfolio.activeCategories - bd.portfolio.filled);
  if (missingFilled > 0) {
    tips.push({
      text: `Voeg 5+ foto's toe aan ${missingFilled === 1 ? "nog 1 categorie" : `nog ${missingFilled} categorieën`}`,
      pts: missingFilled * 7,
    });
  }

  if (bd.portfolio.activeCategories === 0) {
    tips.push({ text: "Voeg je eerste fotocategorie toe aan je portfolio", pts: 7 });
  }

  const missingReviews = Math.max(0, 5 - Math.floor(bd.reviews.score / 6));
  if (missingReviews > 0) {
    tips.push({
      text: `Verzamel nog ${missingReviews} ${missingReviews === 1 ? "review" : "reviews"} voor de maximale score`,
      pts: missingReviews * 6,
    });
  }

  if (!bd.links.hasWebsite) tips.push({ text: "Voeg je website toe aan je profiel", pts: 8 });
  if (!bd.links.hasInstagram) tips.push({ text: "Voeg je Instagram toe aan je profiel", pts: 8 });
  if (!bd.links.hasLinkedin) tips.push({ text: "Voeg je LinkedIn toe aan je profiel", pts: 4 });

  if (!bd.recency.reviewRecent)
    tips.push({ text: "Vraag een klant om een review (geldt 30 dagen)", pts: 7 });

  if (!bd.recency.portfolioRecent)
    tips.push({ text: "Werk je portfolio bij om je recency-bonus te behouden", pts: 8 });

  return tips.filter((t) => t.pts > 0).sort((a, b) => b.pts - a.pts);
}
