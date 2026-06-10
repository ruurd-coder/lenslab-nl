import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

export default async function Image({ params }: Props) {
  const { slug } = await params

  // Read logo directly from filesystem — avoids circular network request
  let logoSrc: string | null = null
  try {
    const logoBuffer = readFileSync(join(process.cwd(), 'public', 'logo.png'))
    logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`
  } catch {
    // Logo not found — skip it
  }

  // Fetch photographer data via Supabase REST
  let name = 'Beeldmaker'
  let city: string | null = null
  let specialties: string[] = []
  let avatarImage: string | null = null

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/photographers?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&select=business_name,city,specialties,avatar_url,type`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
        next: { revalidate: 3600 },
      }
    )
    const [p] = (await res.json()) ?? []
    if (p) {
      name        = p.business_name ?? 'Beeldmaker'
      city        = p.city ?? null
      specialties = (p.specialties ?? []).slice(0, 3)
      avatarImage = p.avatar_url ?? null
    }
  } catch {
    // Fall back to defaults
  }

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
        {/* Avatar as background */}
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

        {/* Gradient overlay — max 50% opacity */}
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

        {/* Content — bottom left */}
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
          {/* LensLab logo or text fallback */}
          <div style={{ display: 'flex', marginBottom: 20 }}>
            {logoSrc ? (
              <img
                src={logoSrc}
                width={130}
                height={31}
                style={{ objectFit: 'contain', objectPosition: 'left center' }}
              />
            ) : (
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 22, fontWeight: 600 }}>
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
            <div
              style={{
                color: 'rgba(255,255,255,0.70)',
                fontSize: 24,
                letterSpacing: '-0.01em',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  )
}
