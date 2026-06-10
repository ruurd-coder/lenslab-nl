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
  let type: string | null = null
  let specialties: string[] = []
  let avatarUrl:   string | null = null

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/photographers?slug=eq.${encodeURIComponent(slug)}&is_published=eq.true&select=business_name,city,type,specialties,avatar_url`,
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
      type        = p.type          ?? null
      specialties = (p.specialties  ?? []).slice(0, 3)
      avatarUrl   = p.avatar_url    ?? null
    }
  } catch {
    // Use defaults
  }

  const role = type === 'videograaf' ? 'Videograaf' : type === 'beide' ? 'Fotograaf & videograaf' : 'Fotograaf'
  const location = city ? `${role} in ${city}` : role

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#F4F0FA',
        }}
      >
        {/* Left: avatar photo */}
        <div
          style={{
            display: 'flex',
            width: 420,
            height: '100%',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
          ) : (
            <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#E8E0F0' }} />
          )}
        </div>

        {/* Right: content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '64px 64px 56px 56px',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex' }}>
            <img
              src="https://www.lenslab.nl/logo.png"
              width={110}
              height={26}
              style={{ objectFit: 'contain', objectPosition: 'left center' }}
            />
          </div>

          {/* Name + role + specialties */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              style={{
                color: '#0d0010',
                fontSize: name.length > 20 ? 52 : 62,
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
              }}
            >
              {name}
            </div>
            <div style={{ color: '#6B5C7A', fontSize: 26, letterSpacing: '-0.01em' }}>
              {location}
            </div>
            {specialties.length > 0 && (
              <div style={{ color: '#9B8AAA', fontSize: 20 }}>
                {specialties.join(' · ')}
              </div>
            )}
          </div>

          {/* lenslab.nl badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#530095',
              color: 'white',
              fontSize: 18,
              fontWeight: 600,
              padding: '10px 20px',
              borderRadius: 100,
              alignSelf: 'flex-start',
            }}
          >
            Bekijk profiel op LensLab
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
