import type { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const BASE = 'https://lenslab.nl'

const CATEGORY_SLUGS = [
  'drone-lucht', 'food-restaurant', 'afscheid', 'baby', 'evenementen',
  'makelaars', 'bedrijf', 'huisdier', 'familie', 'portret',
  'boudoir', 'bruiloft', 'zwangerschap', 'feest',
]

const PROVINCE_SLUGS = [
  'noord-holland', 'zuid-holland', 'utrecht-provincie', 'noord-brabant',
  'gelderland', 'overijssel', 'groningen', 'friesland',
  'limburg', 'drenthe', 'flevoland', 'zeeland',
]

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${BASE}/`,                          changeFrequency: 'weekly',  priority: 1.0 },
  { url: `${BASE}/beeldmakers`,               changeFrequency: 'daily',   priority: 0.9 },
  { url: `${BASE}/fotografen`,                changeFrequency: 'daily',   priority: 0.8 },
  { url: `${BASE}/blog`,                      changeFrequency: 'weekly',  priority: 0.8 },
  { url: `${BASE}/locaties`,                  changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/hoe-het-werkt`,             changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/hoe-het-werkt-beeldmakers`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/memberships`,               changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE}/over-ons`,                  changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE}/faq`,                       changeFrequency: 'monthly', priority: 0.5 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoryUrls: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE}/categorie/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const provinceUrls: MetadataRoute.Sitemap = PROVINCE_SLUGS.map((slug) => ({
    url: `${BASE}/locatie/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  let photographerUrls: MetadataRoute.Sitemap = []
  let blogUrls: MetadataRoute.Sitemap = []
  let locationUrls: MetadataRoute.Sitemap = []

  try {
    const service = await createServiceClient()

    const { data: photographers } = await service
      .from('photographers')
      .select('slug, updated_at')
      .eq('is_published', true)

    photographerUrls = (photographers || []).map((p) => ({
      url: `${BASE}/beeldmakers/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    const { data: posts } = await service
      .from('blog_posts')
      .select('slug, published_at')
      .eq('is_published', true)
      .or('platform.eq.lenslab.nl,platform.is.null')
      .order('published_at', { ascending: false })

    blogUrls = (posts || []).map((post) => ({
      url: `${BASE}/blog/${post.slug.replace(/^\/+/, '')}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Alleen locaties met minstens 1 fotograaf in de sitemap — voorkomt thin content
    // 2 queries: alle fotografen-regio's ophalen + alle regio-slugs matchen
    const { data: photographerRows } = await service
      .from('photographers')
      .select('regions')
      .eq('is_published', true)

    const coveredProvinces = new Set(
      (photographerRows || []).flatMap((p) => (p.regions as string[]) || [])
    )

    const { data: allRegions } = await service
      .from('regions')
      .select('slug, name, city, province')

    locationUrls = (allRegions || [])
      .filter((region) => {
        const provinceName = region.city ? region.province : region.name
        return provinceName && coveredProvinces.has(provinceName)
      })
      .map((region) => ({
        url: `${BASE}/locatie/${region.slug}`,
        changeFrequency: 'weekly' as const,
        priority: region.city ? 0.6 : 0.7, // steden iets lager dan provincies
      }))
  } catch {
    // Supabase unavailable — fall back to static province slugs
    locationUrls = provinceUrls
  }

  return [
    ...STATIC_PAGES,
    ...categoryUrls,
    ...(locationUrls.length > 0 ? locationUrls : provinceUrls),
    ...photographerUrls,
    ...blogUrls,
  ]
}
