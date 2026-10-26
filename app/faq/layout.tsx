import { SITE_URL } from "@/lib/site-url";
import type { Metadata } from 'next'
import { getPageSeoOverrides } from '@/lib/seo-overrides'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const ov = await getPageSeoOverrides('nl:faq')
  return {
    title: ov?.meta_title || 'Veelgestelde vragen | LensLab',
    description: ov?.meta_description || 'Antwoorden op de meest gestelde vragen over LensLab — voor opdrachtgevers die een fotograaf zoeken én voor beeldmakers die zich willen aanmelden.',
    alternates: { canonical: `${SITE_URL}/faq` },
  }
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
