import type { Photographer } from "./types";

export interface ScoreBreakdown {
  portfolio: { pct: number; maxPct: 40; photoCount: number; maxPhotos: number; activeCategories: number };
  reviews: { pct: number; maxPct: 25; count: number };
  links: { pct: number; maxPct: 20; filled: number; hasWebsite: boolean; hasInstagram: boolean; hasLinkedin: boolean };
  recency: { pct: number; maxPct: 15; monthsAgo: number };
  total: number;
}

export interface ScoreTip {
  text: string;
  pts: number;
}

const DAY = 24 * 3600 * 1000;

export function calcBreakdown(p: Photographer): ScoreBreakdown {
  const now = Date.now();

  // Portfolio (max 40%): total photos across all active categories / (activeCategories × 5)
  const byCategory = (p.portfolio_by_category as Record<string, string[]>) ?? {};
  const activeCategories = Object.keys(byCategory).length;
  const photoCount = Object.values(byCategory).reduce((sum, imgs) => sum + imgs.length, 0);
  const maxPhotos = activeCategories * 5;
  const portfolioPct = activeCategories > 0
    ? Math.min(photoCount / maxPhotos, 1) * 40
    : 0;

  // Reviews (max 25%): 5% per review, max 5 reviews
  const reviewCount = p.review_count ?? 0;
  const reviewsPct = Math.min(reviewCount, 5) * 5;

  // Links (max 20%): 3 links, each ~6.67%
  const hasWebsite = !!(p.website_url?.trim());
  const hasInstagram = !!(p.instagram_url?.trim());
  const hasLinkedin = !!(p.linkedin_url?.trim());
  const filledLinks = (hasWebsite ? 1 : 0) + (hasInstagram ? 1 : 0) + (hasLinkedin ? 1 : 0);
  const linksPct = (filledLinks / 3) * 20;

  // Recency (max 15%): -5% per inactive month, min 0%
  const updatedMs = new Date(p.updated_at).getTime();
  const lastReviewMs = p.last_review_at ? new Date(p.last_review_at).getTime() : 0;
  const lastActivity = Math.max(updatedMs, lastReviewMs);
  const monthsAgo = (now - lastActivity) / (30 * DAY);
  const recencyPct = monthsAgo <= 1 ? 15 : monthsAgo <= 2 ? 10 : monthsAgo <= 3 ? 5 : 0;

  const total = Math.round(portfolioPct + reviewsPct + linksPct + recencyPct);

  return {
    portfolio: { pct: Math.round(portfolioPct), maxPct: 40, photoCount, maxPhotos, activeCategories },
    reviews: { pct: reviewsPct, maxPct: 25, count: reviewCount },
    links: { pct: Math.round(linksPct), maxPct: 20, filled: filledLinks, hasWebsite, hasInstagram, hasLinkedin },
    recency: { pct: recencyPct, maxPct: 15, monthsAgo },
    total,
  };
}

export function calcTips(bd: ScoreBreakdown): ScoreTip[] {
  const tips: ScoreTip[] = [];

  if (bd.portfolio.activeCategories === 0) {
    tips.push({ text: "Voeg je eerste fotocategorie toe aan je portfolio", pts: 40 });
  } else if (bd.portfolio.photoCount < bd.portfolio.maxPhotos) {
    const missing = bd.portfolio.maxPhotos - bd.portfolio.photoCount;
    const gain = Math.round((missing / bd.portfolio.maxPhotos) * 40);
    tips.push({ text: `Voeg nog ${missing} foto${missing === 1 ? "" : "'s"} toe om je portfolio te completeren`, pts: gain });
  }

  const missingReviews = Math.max(0, 5 - bd.reviews.count);
  if (missingReviews > 0) {
    tips.push({ text: `Verzamel nog ${missingReviews} ${missingReviews === 1 ? "review" : "reviews"}`, pts: missingReviews * 5 });
  }

  if (!bd.links.hasWebsite) tips.push({ text: "Voeg je website toe aan je profiel", pts: 7 });
  if (!bd.links.hasInstagram) tips.push({ text: "Voeg je Instagram toe aan je profiel", pts: 7 });
  if (!bd.links.hasLinkedin) tips.push({ text: "Voeg je LinkedIn toe aan je profiel", pts: 7 });

  if (bd.recency.pct < 15) {
    const gain = 15 - bd.recency.pct;
    tips.push({ text: "Voeg foto's toe of verzamel een review om je activiteitsscore te verhogen", pts: gain });
  }

  return tips.filter((t) => t.pts > 0).sort((a, b) => b.pts - a.pts);
}

export const SCORE_EXPLANATION = `Je profielscore bepaalt hoe hoog je verschijnt in zoekresultaten.

📁 Portfolio (40%) Voeg minimaal 5 foto's toe per actieve categorie. Hoe meer categorieën volledig gevuld, hoe hoger de score.

⭐ Reviews (25%) Elke review telt voor 5%. Met 5 reviews bereik je de maximale score.

🔗 Profiel links (20%) Vul je website, Instagram en LinkedIn in.

🔄 Recente activiteit (15%) Voeg maandelijks foto's toe of ontvang een review. Doe je een maand niets, dan daalt deze score met 5%.`;
