import type { Metadata } from 'next'
import { getPageSeoOverrides } from '@/lib/seo-overrides'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const ov = await getPageSeoOverrides('nl:over-ons')
  return {
    title: ov?.meta_title || 'Over ons | LensLab',
    description: ov?.meta_description || 'Leer het team achter LensLab kennen. Wij verbinden opdrachtgevers met de beste fotografen en videografen in Nederland — geboren uit liefde voor sterk beeld.',
    alternates: { canonical: 'https://lenslab.nl/over-ons' },
  }
}

export default function OverOnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
