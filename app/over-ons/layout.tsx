import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Over ons | LensLab',
  description: 'Leer het team achter LensLab kennen. Wij verbinden opdrachtgevers met de beste fotografen en videografen in Nederland — geboren uit liefde voor sterk beeld.',
  alternates: { canonical: 'https://lenslab.nl/over-ons' },
}

export default function OverOnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
