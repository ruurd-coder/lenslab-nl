import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

/** Convert an ArrayBuffer to a base64 data URL — works in Edge runtime (no Buffer needed) */
async function toDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buf   = await res.arrayBuffer()
    const bytes = new Uint8Array(buf)
    let binary  = ''
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i])
    const ct = res.headers.get('content-type') || 'image/png'
    return `data:${ct};base64,${btoa(binary)}`
  } catch {
    return null
  }
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  // ── Photographer data ────────────────────────────────────────────────────
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
      name       = p.business_name ?? 'Beeldmaker'
      city       = p.city          ?? null
      specialties = (p.specialties ?? []).slice(0, 3)
      avatarUrl  = p.avatar_url    ?? null
    }
  } catch {
    // Use defaults
  }

  // ── Pre-fetch images as base64 so Satori never makes external requests ───
  // This prevents the 500 error caused by Satori fetching URLs during streaming
  const [avatarSrc, logoSrc] = await Promise.all([
    avatarUrl ? toDataUrl(avatarUrl) : Promise.resolve(null),
    toDataUrl('https://lenslab.nl/logo.png'),
  ])

  const subtitle = [city, ...specialties].filter(Boolean).join(' · ')

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
        {/* Avatar — embedded as data URL, no external fetch by Satori */}
        {avatarSrc && (
          <img
            src={avatarSrc}
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
            background: avatarSrc
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
          {/* Logo — embedded as data URL or text fallback */}
          <div style={{ display: 'flex', marginBottom: 20 }}>
            {logoSrc ? (
              <img
                src={logoSrc}
                width={130}
                height={31}
                style={{ objectFit: 'contain', objectPosition: 'left center' }}
              />
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.80)', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em' }}>
                LensLab
              </span>
            )}
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
