import { createServiceClient } from '@/lib/supabase/server'

export interface SeoPageOverrides {
  meta_title:       string | null
  meta_description: string | null
  og_image_url:     string | null
}

/**
 * Fetches admin-configured SEO overrides for a static page.
 * Returns null if no override row exists — callers use their hardcoded defaults.
 */
export async function getPageSeoOverrides(pageSlug: string): Promise<SeoPageOverrides | null> {
  try {
    const service = await createServiceClient()
    const { data } = await service
      .from('seo_og_images')
      .select('image_url, meta_title, meta_description')
      .eq('page_slug', pageSlug)
      .single()
    if (!data) return null
    return {
      meta_title:       data.meta_title       ?? null,
      meta_description: data.meta_description ?? null,
      og_image_url:     data.image_url        ?? null,
    }
  } catch {
    return null
  }
}
