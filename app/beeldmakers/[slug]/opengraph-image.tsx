import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 0

// Minimal static test — no external fetches, no dynamic data
export default function Image() {
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 24, fontWeight: 600 }}>
            LensLab
          </span>
          <span style={{ color: '#ffffff', fontSize: 72, fontWeight: 900, letterSpacing: '-0.03em' }}>
            Beeldmaker
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
