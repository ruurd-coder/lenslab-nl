import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  let name        = 'Beeldmaker'
  let city: string | null = null
  let specialties: string[] = []
  let avatarUrl:   string | null = null

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/photographers?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&select=business_name,city,specialties,avatar_url`,
      {
        headers: {
          apikey:        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      }
    )
    const [p] = (await res.json()) ?? []
    if (p) {
      name        = p.business_name ?? 'Beeldmaker'
      city        = p.city          ?? null
      specialties = (p.specialties  ?? []).slice(0, 3)
      avatarUrl   = p.avatar_url    ?? null
    }
  } catch {
    // Use defaults
  }

  const subtitle  = [city, ...specialties].filter(Boolean).join(' · ')
  // Use www.lenslab.nl — no redirect, Satori can fetch directly
  const logoUrl   = 'https://www.lenslab.nl/logo.png'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#0d0010',
          position: 'relative',
        }}
      >
        {/* Avatar — Supabase public URL, no redirect */}
        {avatarUrl && (
          <img
            src={avatarUrl}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: avatarUrl
              ? 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.50) 100%)'
              : 'linear-gradient(135deg, #2a0050 0%, #0d0010 100%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0 60px 52px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Logo — www.lenslab.nl, no redirect */}
          <div style={{ display: 'flex', marginBottom: 20 }}>
            <img
              src={logoUrl}
              width={130}
              height={31}
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
            />
          </div>

          {/* Name */}
          <div
            style={{
              color: '#ffffff',
              fontSize: name.length > 24 ? 52 : 68,
              fontWeight: 900,
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
              marginBottom: 16,
            }}
          >
            {name}
          </div>

          {/* City + specialties */}
          {subtitle && (
            <div style={{ color: 'rgba(255,255,255,0.70)', fontSize: 24, letterSpacing: '-0.01em' }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  )
}
