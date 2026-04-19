import {useCallback, useEffect, useRef} from 'react'
import {set, useFormValue} from 'sanity'
import type {StringInputProps} from 'sanity'

// All preview fonts loaded as a single stylesheet
const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,200;1,200' +
  '&family=Cormorant+Garamond:ital,wght@1,300' +
  '&family=Playfair+Display:ital,wght@0,400;1,400' +
  '&family=EB+Garamond:ital,wght@0,400;1,400' +
  '&family=DM+Sans:wght@300;400' +
  '&family=Libre+Baskerville:ital,wght@0,400;1,400' +
  '&family=Work+Sans:wght@300;400' +
  '&family=Fraunces:ital,wght@0,300;1,300' +
  '&family=Jost:wght@300;400' +
  '&display=swap'

const FONT_PAIRINGS = {
  classic: {
    label: 'Klassisk',
    description: 'Tidløs og elegant — nuværende standard',
    headingStyle: {fontFamily: "'Newsreader', serif", fontWeight: 200} as React.CSSProperties,
    accentStyle: {fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300} as React.CSSProperties,
    bodyStyle: {fontFamily: "'Inter', sans-serif", fontWeight: 300} as React.CSSProperties,
    fontNames: {heading: 'Newsreader', body: 'Inter', accent: 'Cormorant'},
  },
  elegant: {
    label: 'Elegant',
    description: 'Sofistikeret og moderne luksus',
    headingStyle: {fontFamily: "'Playfair Display', serif", fontWeight: 400} as React.CSSProperties,
    accentStyle: {fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontWeight: 400} as React.CSSProperties,
    bodyStyle: {fontFamily: "'DM Sans', sans-serif", fontWeight: 300} as React.CSSProperties,
    fontNames: {heading: 'Playfair Display', body: 'DM Sans', accent: 'EB Garamond'},
  },
  nordic: {
    label: 'Nordisk',
    description: 'Ren og naturlig med solid karakter',
    headingStyle: {fontFamily: "'Libre Baskerville', serif", fontWeight: 400} as React.CSSProperties,
    accentStyle: {fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 300} as React.CSSProperties,
    bodyStyle: {fontFamily: "'Work Sans', sans-serif", fontWeight: 300} as React.CSSProperties,
    fontNames: {heading: 'Libre Baskerville', body: 'Work Sans', accent: 'Cormorant'},
  },
  dramatic: {
    label: 'Dramatisk',
    description: 'Ekspressiv og markant med høj personlighed',
    headingStyle: {fontFamily: "'Fraunces', serif", fontWeight: 300} as React.CSSProperties,
    accentStyle: {fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontWeight: 300} as React.CSSProperties,
    bodyStyle: {fontFamily: "'Jost', sans-serif", fontWeight: 300} as React.CSSProperties,
    fontNames: {heading: 'Fraunces', body: 'Jost', accent: 'Fraunces'},
  },
} as const

type PairingKey = keyof typeof FONT_PAIRINGS

interface CustomFontPairing {
  _key: string
  label?: string
  headingFontFamily?: string
  bodyFontFamily?: string
  accentFontFamily?: string
  headingFontUrl?: string
  bodyFontUrl?: string
  accentFontUrl?: string
}

export function FontPickerInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props
  const active = value || 'classic'
  const linkRef = useRef<HTMLLinkElement | null>(null)
  const customFontStyleRef = useRef<HTMLStyleElement | null>(null)

  const customPairings =
    (useFormValue(['customFontPairings']) as CustomFontPairing[] | undefined) ?? []

  // Inject Google Fonts into Sanity Studio's document head
  useEffect(() => {
    if (linkRef.current) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = GOOGLE_FONTS_URL
    document.head.appendChild(link)
    linkRef.current = link
  }, [])

  // Inject @font-face for custom pairings so previews work in Studio
  useEffect(() => {
    if (!customFontStyleRef.current) {
      const style = document.createElement('style')
      document.head.appendChild(style)
      customFontStyleRef.current = style
    }

    const faces = customPairings.flatMap((p) => {
      const entries: string[] = []
      const addFace = (url?: string, family?: string) => {
        if (!url || !family) return
        const ext = url.split('?')[0].split('.').pop()?.toLowerCase() ?? 'woff2'
        const formatMap: Record<string, string> = {woff2: 'woff2', woff: 'woff', ttf: 'truetype', otf: 'opentype'}
        entries.push(
          `@font-face { font-family: '${family}'; src: url('${url}') format('${formatMap[ext] ?? 'woff2'}'); font-display: swap; }`,
        )
      }
      addFace(p.headingFontUrl, p.headingFontFamily)
      if (p.bodyFontUrl !== p.headingFontUrl) addFace(p.bodyFontUrl, p.bodyFontFamily)
      if (p.accentFontUrl && p.accentFontUrl !== p.headingFontUrl)
        addFace(p.accentFontUrl, p.accentFontFamily)
      return entries
    })

    customFontStyleRef.current.textContent = faces.join('\n')
  }, [customPairings])

  const handleSelect = useCallback(
    (key: string) => {
      onChange(set(key))
    },
    [onChange],
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: '12px',
        marginTop: '8px',
      }}
    >
      {/* ── Preset pairings ─────────────────────────────────────── */}
      {(Object.entries(FONT_PAIRINGS) as [PairingKey, (typeof FONT_PAIRINGS)[PairingKey]][]).map(
        ([key, pairing]) => {
          const isActive = active === key
          return (
            <PairingCard
              key={key}
              id={key}
              isActive={isActive}
              readOnly={readOnly}
              label={pairing.label}
              description={pairing.description}
              headingName={pairing.fontNames.heading}
              bodyName={pairing.fontNames.body}
              headingStyle={pairing.headingStyle}
              accentStyle={pairing.accentStyle}
              bodyStyle={pairing.bodyStyle}
              onSelect={handleSelect}
            />
          )
        },
      )}

      {/* ── Custom uploaded pairings ─────────────────────────────── */}
      {customPairings.map((p) => {
        const id = `custom-${p._key}`
        const isActive = active === id
        const headingStyle: React.CSSProperties = p.headingFontFamily
          ? {fontFamily: `'${p.headingFontFamily}', serif`, fontWeight: 400}
          : {fontFamily: 'serif', fontWeight: 400}
        const bodyStyle: React.CSSProperties = p.bodyFontFamily
          ? {fontFamily: `'${p.bodyFontFamily}', sans-serif`, fontWeight: 300}
          : {fontFamily: 'sans-serif', fontWeight: 300}
        const accentStyle: React.CSSProperties = p.accentFontFamily
          ? {fontFamily: `'${p.accentFontFamily}', serif`, fontStyle: 'italic', fontWeight: 400}
          : {...headingStyle, fontStyle: 'italic'}

        return (
          <PairingCard
            key={id}
            id={id}
            isActive={isActive}
            readOnly={readOnly}
            label={p.label || 'Tilpasset'}
            description="Uploadet skrifttype"
            headingName={p.headingFontFamily || '—'}
            bodyName={p.bodyFontFamily || '—'}
            headingStyle={headingStyle}
            accentStyle={accentStyle}
            bodyStyle={bodyStyle}
            onSelect={handleSelect}
            isCustom
          />
        )
      })}
    </div>
  )
}

// ─── Card sub-component ───────────────────────────────────────────────────────

interface PairingCardProps {
  id: string
  isActive: boolean
  readOnly?: boolean
  label: string
  description: string
  headingName: string
  bodyName: string
  headingStyle: React.CSSProperties
  accentStyle: React.CSSProperties
  bodyStyle: React.CSSProperties
  onSelect: (id: string) => void
  isCustom?: boolean
}

function PairingCard({
  id,
  isActive,
  readOnly,
  label,
  description,
  headingName,
  bodyName,
  headingStyle,
  accentStyle,
  bodyStyle,
  onSelect,
  isCustom,
}: PairingCardProps) {
  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={() => onSelect(id)}
      style={{
        all: 'unset',
        cursor: readOnly ? 'not-allowed' : 'pointer',
        display: 'block',
        borderRadius: '8px',
        overflow: 'hidden',
        border: isActive ? '2px solid #1c1b1b' : '2px solid transparent',
        boxShadow: isActive ? '0 0 0 1px #1c1b1b' : '0 1px 4px rgba(0,0,0,0.10)',
        opacity: readOnly ? 0.5 : 1,
        position: 'relative',
      }}
    >
      {isCustom && (
        <div
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            background: '#564338',
            color: '#fff',
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '2px 5px',
            borderRadius: '3px',
          }}
        >
          Egen
        </div>
      )}

      {/* Font sample area */}
      <div style={{backgroundColor: '#faf9f7', padding: '18px 16px 14px'}}>
        <div style={{...headingStyle, fontSize: '22px', color: '#1c1b1b', lineHeight: 1.1, marginBottom: '2px'}}>
          Allégade
        </div>
        <div style={{...accentStyle, fontSize: '18px', color: '#564338', lineHeight: 1.1, marginBottom: '10px'}}>
          10
        </div>
        <div style={{...bodyStyle, fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa'}}>
          Hotel · Restaurant
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{backgroundColor: isActive ? '#1c1b1b' : '#f0f0f0', padding: '8px 12px'}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: isActive ? '#fff' : '#222',
            }}
          >
            {label}
          </span>
          {isActive && (
            <span style={{fontSize: '10px', color: 'rgba(255,255,255,0.65)'}}>✓</span>
          )}
        </div>
        <div
          style={{
            fontSize: '9px',
            color: isActive ? 'rgba(255,255,255,0.55)' : '#aaa',
            lineHeight: 1.5,
          }}
        >
          {headingName} · {bodyName}
        </div>
      </div>
    </button>
  )
}
