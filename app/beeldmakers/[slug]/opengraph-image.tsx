import { ImageResponse } from 'next/og'

// Node.js runtime is required to read the logo from the filesystem
export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  // ── Logo — dynamic import inside the function so it runs AFTER
  //    Node.js runtime is initialised (static top-level import fails)
  let logoSrc: string | null = null
  try {
    const { readFileSync } = await import('fs')
    const { join }         = await import('path')
    const buf = readFileSync(join(process.cwd(), 'public', 'logo.png'))
    logoSrc = `data:image/png;base64,${buf.toString('base64')}`
  } catch {
    // Logo unavailable — fall back to text
  }

  // ── Photographer data
  let name        = 'Beeldmaker'
  let city: string | null = null
  let specialties: string[] = []
  let avatarImage: string | null = null

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
      avatarImage = p.avatar_url    ?? null
    }
  } catch {
    // Fall back to defaults
  }

  const subtitle = [city, ...specialties].filter(Boolean).join(' · ')

  // ── Render — wrapped in try/catch in case the avatar URL fails to load
  try {
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
          {/* Avatar background */}
          {avatarImage && (
            <img
              src={avatarImage}
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

          {/* Gradient overlay — 50% max opacity */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: avatarImage
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
            {/* Logo or text fallback */}
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
  } catch {
    // Ultimate fallback — no external assets at all
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #2a0050 0%, #0d0010 100%)',
            alignItems: 'flex-end',
            padding: '0 60px 52px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 22, fontWeight: 600, marginBottom: 16 }}>LensLab</span>
            <span style={{ color: '#ffffff', fontSize: 64, fontWeight: 900, letterSpacing: '-0.035em' }}>{name}</span>
          </div>
        </div>
      ),
      { ...size }
    )
  }
}
