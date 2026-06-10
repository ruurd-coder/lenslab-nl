import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/dashboard',
          '/login',
          '/aanmelden',
          '/help-support',
          '/review',
          '/api/',
        ],
      },
    ],
    sitemap: 'https://lenslab.nl/sitemap.xml',
  }
}
