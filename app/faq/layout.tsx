import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veelgestelde vragen | LensLab',
  description: 'Antwoorden op de meest gestelde vragen over LensLab — voor opdrachtgevers die een fotograaf zoeken én voor beeldmakers die zich willen aanmelden.',
  alternates: { canonical: 'https://lenslab.nl/faq' },
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
