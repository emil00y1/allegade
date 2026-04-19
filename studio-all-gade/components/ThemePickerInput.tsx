import {useCallback, useState} from 'react'
import {set} from 'sanity'
import type {StringInputProps} from 'sanity'

// ─── Color math ───────────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    default: h = ((r - g) / d + 4) / 6
  }
  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)))))
      .toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v))
}

function isValidHex(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v)
}

// ─── Custom theme types & serialization ───────────────────────────────────────

export interface CustomColors {
  brand: string
  brandLight: string
  warmWhite: string
  warmBrown: string
  darkStone: string
}

interface CustomThemeData {
  name: string
  colors: CustomColors
}

function parseCustomValue(value: string): CustomThemeData | null {
  try {
    return JSON.parse(value.slice(7)) as CustomThemeData
  } catch {
    return null
  }
}

function serializeCustom(name: string, colors: CustomColors): string {
  return `custom:${JSON.stringify({name, colors})}`
}

// Derives the full 9-variable palette from 5 editable colors
export function deriveFullTheme(colors: CustomColors): Record<string, string> {
  const [h, s, l] = hexToHsl(colors.brand)
  const [wh, ws, wl] = hexToHsl(colors.warmWhite)
  const [blh, bls, bll] = hexToHsl(colors.brandLight)
  return {
    '--brand': colors.brand,
    '--brand-mid': hslToHex(h, clamp(s * 0.85), clamp(l + 14)),
    '--brand-light': colors.brandLight,
    '--brand-dark': hslToHex(h, clamp(s * 1.05), clamp(l - 22)),
    '--warm-white': colors.warmWhite,
    '--warm-gray': hslToHex(wh, clamp(ws + 2), clamp(wl - 4)),
    '--warm-brown': colors.warmBrown,
    '--dark-stone': colors.darkStone,
    '--border-warm': hslToHex(blh, clamp(bls * 1.1), clamp(bll - 16)),
  }
}

// ─── Preset themes ────────────────────────────────────────────────────────────

export const COLOR_THEMES = {
  'warm-brown': {
    label: 'Varm Brun', description: 'Standard — varm brun og ferskentoner',
    brand: '#903f00', brandLight: '#ffdbcb', warmWhite: '#fcf9f8',
    warmBrown: '#564338', darkStone: '#1c1b1b', borderWarm: '#ddc1b3',
  },
  forest: {
    label: 'Skov', description: 'Dyb grøn med naturlige toner',
    brand: '#2d5a1b', brandLight: '#d1f0c8', warmWhite: '#f7fbf5',
    warmBrown: '#374b31', darkStone: '#1a1c19', borderWarm: '#b8d9af',
  },
  navy: {
    label: 'Marineblå', description: 'Elegant mørkeblå med kølige toner',
    brand: '#1a3a5c', brandLight: '#c8ddf0', warmWhite: '#f5f8fc',
    warmBrown: '#2e4560', darkStone: '#0f1c2e', borderWarm: '#a8c4df',
  },
  slate: {
    label: 'Skifer', description: 'Neutral grå med moderne udtryk',
    brand: '#374151', brandLight: '#d1d5db', warmWhite: '#f9fafb',
    warmBrown: '#4b5563', darkStone: '#111827', borderWarm: '#d1d5db',
  },
  champagne: {
    label: 'Champagne', description: 'Varm guld og cremetoner — luksuriøst og tidløst',
    brand: '#8a6a2e', brandLight: '#f5e6c0', warmWhite: '#fdfaf4',
    warmBrown: '#5c4a2a', darkStone: '#1e1a10', borderWarm: '#e8d5a0',
  },
  sage: {
    label: 'Salvie', description: 'Dæmpet salvie grøn — naturlig og rolig',
    brand: '#4a6741', brandLight: '#d4e8d0', warmWhite: '#f6f9f5',
    warmBrown: '#3d5035', darkStone: '#1a2118', borderWarm: '#c0d8b8',
  },
  terracotta: {
    label: 'Terrakotta', description: 'Varme jordtoner med et sydlandsk præg',
    brand: '#9c4a2f', brandLight: '#f8d5c8', warmWhite: '#fdf8f6',
    warmBrown: '#5a3528', darkStone: '#1e1210', borderWarm: '#e8c4b8',
  },
  onyx: {
    label: 'Onyx', description: 'Guld på sort — maksimal luksus og kontrast',
    brand: '#c9a96e', brandLight: '#f0e0c0', warmWhite: '#f9f7f4',
    warmBrown: '#4a3d2d', darkStone: '#0a0a0a', borderWarm: '#e0d0b8',
  },
  cobalt: {
    label: 'Kobolt', description: 'Klar koboltblå med frisk og moderne udtryk',
    brand: '#1c4b9e', brandLight: '#c5d8f8', warmWhite: '#f4f7fe',
    warmBrown: '#2a3f6e', darkStone: '#0c1a38', borderWarm: '#a8c0f0',
  },
} as const

export type ThemeKey = keyof typeof COLOR_THEMES

const COLOR_FIELDS: Array<{key: keyof CustomColors; label: string; hint: string}> = [
  {key: 'brand',      label: 'Accent / Brand',  hint: 'Knapper, links og fremhævninger'},
  {key: 'brandLight', label: 'Lys Accent',       hint: 'Lyse tintflader og badges'},
  {key: 'warmWhite',  label: 'Sidebaggrund',     hint: 'Primær hvid baggrundfarve'},
  {key: 'warmBrown',  label: 'Brødtekst',        hint: 'Normal tekst og beskrivelser'},
  {key: 'darkStone',  label: 'Overskrifter',     hint: 'Titler og fremhævet tekst'},
]

const DEFAULT_COLORS: CustomColors = {
  brand: '#5a8a6e', brandLight: '#c8e8d8',
  warmWhite: '#f5fbf8', warmBrown: '#3a5848', darkStone: '#1a2820',
}

// ─── Mini preview card ────────────────────────────────────────────────────────

function MiniPreview({
  brand, warmWhite, warmBrown, darkStone, label,
}: Omit<CustomColors, 'brandLight'> & {label: string}) {
  return (
    <div style={{backgroundColor: warmWhite, padding: '14px'}}>
      <div style={{fontSize: '13px', fontWeight: 600, color: darkStone, marginBottom: '4px'}}>
        {label}
      </div>
      <div style={{fontSize: '10px', color: warmBrown, marginBottom: '10px', lineHeight: 1.4}}>
        Hotel, restaurant og selskaber
      </div>
      <div style={{
        display: 'inline-block', backgroundColor: brand, color: '#fff',
        fontSize: '9px', fontWeight: 600, padding: '4px 10px',
        borderRadius: '4px', letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>
        Book bord
      </div>
    </div>
  )
}

// ─── Color row in editor ──────────────────────────────────────────────────────

function ColorRow({
  fieldKey, label, hint, value, onChange,
}: {
  fieldKey: keyof CustomColors
  label: string
  hint: string
  value: string
  onChange: (key: keyof CustomColors, val: string) => void
}) {
  const [textVal, setTextVal] = useState(value)

  const handleText = (raw: string) => {
    const v = raw.startsWith('#') ? raw : `#${raw}`
    setTextVal(v)
    if (isValidHex(v)) onChange(fieldKey, v)
  }

  const handlePicker = (v: string) => {
    setTextVal(v)
    onChange(fieldKey, v)
  }

  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f0f0f0'}}>
      {/* Color swatch / native picker */}
      <div style={{position: 'relative', flexShrink: 0}}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '6px',
          backgroundColor: isValidHex(value) ? value : '#ccc',
          border: '1px solid rgba(0,0,0,0.12)', overflow: 'hidden',
        }}>
          <input
            type="color"
            value={isValidHex(value) ? value : '#cccccc'}
            onChange={(e) => handlePicker(e.target.value)}
            style={{
              position: 'absolute', inset: '-4px', width: 'calc(100% + 8px)',
              height: 'calc(100% + 8px)', opacity: 0, cursor: 'pointer',
            }}
          />
        </div>
      </div>

      {/* Label + hint */}
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontSize: '12px', fontWeight: 600, color: '#222', marginBottom: '2px'}}>{label}</div>
        <div style={{fontSize: '10px', color: '#999'}}>{hint}</div>
      </div>

      {/* Hex text input */}
      <input
        type="text"
        value={textVal}
        onChange={(e) => handleText(e.target.value)}
        maxLength={7}
        placeholder="#rrggbb"
        style={{
          fontFamily: 'monospace', fontSize: '12px', width: '84px',
          padding: '6px 8px', borderRadius: '5px', flexShrink: 0,
          border: `1px solid ${isValidHex(textVal) ? '#ddd' : '#f87171'}`,
          outline: 'none', backgroundColor: '#fff',
        }}
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ThemePickerInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props

  const isCustomActive = typeof value === 'string' && (value as string).startsWith('custom:')
  const parsedCustom = isCustomActive ? parseCustomValue(value as string) : null

  const [editorOpen, setEditorOpen] = useState(false)
  const [editName, setEditName] = useState(parsedCustom?.name ?? '')
  const [editColors, setEditColors] = useState<CustomColors>(parsedCustom?.colors ?? DEFAULT_COLORS)

  const activePreset = !isCustomActive ? ((value as ThemeKey) || 'warm-brown') : null

  // Opens the editor pre-filled from a preset theme
  const openEditorFromPreset = useCallback((key: ThemeKey) => {
    const t = COLOR_THEMES[key]
    setEditName(`${t.label} (tilpasset)`)
    setEditColors({
      brand: t.brand, brandLight: t.brandLight, warmWhite: t.warmWhite,
      warmBrown: t.warmBrown, darkStone: t.darkStone,
    })
    setEditorOpen(true)
  }, [])

  // Opens editor with existing custom data (or defaults)
  const openCustomEditor = useCallback(() => {
    if (parsedCustom) {
      setEditName(parsedCustom.name)
      setEditColors(parsedCustom.colors)
    } else {
      setEditName('')
      setEditColors(DEFAULT_COLORS)
    }
    setEditorOpen(true)
  }, [parsedCustom])

  const handleColorChange = useCallback((key: keyof CustomColors, val: string) => {
    setEditColors((prev) => ({...prev, [key]: val}))
  }, [])

  const handleSave = useCallback(() => {
    const name = editName.trim() || 'Mit tema'
    onChange(set(serializeCustom(name, editColors)))
    setEditorOpen(false)
  }, [onChange, editName, editColors])

  const handleCancel = useCallback(() => {
    // Restore editor state from current saved value
    if (parsedCustom) {
      setEditName(parsedCustom.name)
      setEditColors(parsedCustom.colors)
    }
    setEditorOpen(false)
  }, [parsedCustom])

  const handleSelectPreset = useCallback((key: ThemeKey) => {
    onChange(set(key))
    setEditorOpen(false)
  }, [onChange])

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* ── Theme grid ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '12px', marginTop: '8px',
      }}>

        {/* Preset cards */}
        {(Object.entries(COLOR_THEMES) as [ThemeKey, typeof COLOR_THEMES[ThemeKey]][]).map(([key, theme]) => {
          const isActive = activePreset === key
          return (
            <div
              key={key}
              style={{
                borderRadius: '8px', overflow: 'hidden', position: 'relative',
                border: isActive ? `2px solid ${theme.brand}` : '2px solid transparent',
                boxShadow: isActive ? `0 0 0 1px ${theme.brand}` : '0 1px 4px rgba(0,0,0,0.10)',
                opacity: readOnly ? 0.5 : 1,
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Active checkmark */}
              {isActive && (
                <div style={{
                  position: 'absolute', top: '7px', right: '7px', zIndex: 2,
                  width: '18px', height: '18px', borderRadius: '50%',
                  backgroundColor: theme.brand,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Select area */}
              <button
                type="button"
                disabled={readOnly}
                onClick={() => handleSelectPreset(key)}
                style={{all: 'unset', cursor: readOnly ? 'not-allowed' : 'pointer', display: 'block'}}
              >
                <MiniPreview
                  label={theme.label}
                  brand={theme.brand}
                  warmWhite={theme.warmWhite} warmBrown={theme.warmBrown} darkStone={theme.darkStone}
                />
              </button>

              {/* Tilpas bar */}
              <button
                type="button"
                disabled={readOnly}
                onClick={() => openEditorFromPreset(key)}
                style={{
                  all: 'unset', cursor: readOnly ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '5px 0', fontSize: '10px', fontWeight: 500,
                  letterSpacing: '0.04em', color: '#888',
                  backgroundColor: '#fafafa',
                  borderTop: '1px solid #ececec',
                  transition: 'background 0.1s, color 0.1s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f0f0f0'; e.currentTarget.style.color = '#333' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fafafa'; e.currentTarget.style.color = '#888' }}
              >
                ✏ Tilpas
              </button>
            </div>
          )
        })}

        {/* ── Custom / Opret card ─────────────────────────────────────────── */}
        <div style={{
          borderRadius: '8px', overflow: 'hidden', position: 'relative',
          background: isCustomActive
            ? `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${editColors.brand}, ${editColors.brandLight}) border-box`
            : 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #f97316, #ec4899, #8b5cf6) border-box',
          border: '2px solid transparent',
          boxShadow: isCustomActive ? `0 0 0 1px ${editColors.brand}40` : '0 1px 4px rgba(0,0,0,0.10)',
          opacity: readOnly ? 0.5 : 1,
        }}>
          {/* Active checkmark */}
          {isCustomActive && (
            <div style={{
              position: 'absolute', top: '7px', right: '7px', zIndex: 2,
              width: '18px', height: '18px', borderRadius: '50%',
              backgroundColor: editColors.brand,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

          <button
            type="button"
            disabled={readOnly}
            onClick={openCustomEditor}
            style={{all: 'unset', cursor: readOnly ? 'not-allowed' : 'pointer', display: 'block', width: '100%'}}
          >
            {isCustomActive && parsedCustom ? (
              <MiniPreview
                label={parsedCustom.name || 'Tilpasset'}
                brand={editColors.brand}
                warmWhite={editColors.warmWhite}
                warmBrown={editColors.warmBrown}
                darkStone={editColors.darkStone}
              />
            ) : (
              <div style={{
                padding: '20px 14px 22px',
                background: 'linear-gradient(135deg, #fff9f5 0%, #fdf5ff 50%, #f0f8ff 100%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '8px', textAlign: 'center',
                minHeight: '120px', justifyContent: 'center',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="paletteGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#f97316"/>
                      <stop offset="50%" stopColor="#ec4899"/>
                      <stop offset="100%" stopColor="#8b5cf6"/>
                    </linearGradient>
                  </defs>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="url(#paletteGrad)"/>
                </svg>
                <div style={{fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                  background: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                  Opret eget tema
                </div>
                <div style={{fontSize: '10px', color: '#aaa', lineHeight: 1.4}}>
                  Vælg dine egne farver og gem under et navn
                </div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ── Editor panel ───────────────────────────────────────────────────── */}
      {editorOpen && (
        <div style={{
          marginTop: '20px', borderRadius: '10px',
          border: '1px solid #e4e4e4', backgroundColor: '#fff',
          overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'linear-gradient(135deg, #fff9f5 0%, #fdf5ff 50%, #f0f8ff 100%)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="hdrGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f97316"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="url(#hdrGrad)"/>
            </svg>
            <span style={{
              fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #f97316, #8b5cf6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Tilpas tema
            </span>
          </div>

          <div style={{padding: '20px', display: 'flex', gap: '24px', flexWrap: 'wrap'}}>
            {/* Left: controls */}
            <div style={{flex: '1 1 260px', minWidth: 0}}>
              {/* Theme name */}
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '6px'}}>
                  Temanavn
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="F.eks. Forårs 2025"
                  style={{
                    width: '100%', padding: '8px 12px', borderRadius: '6px',
                    border: '1px solid #ddd', fontSize: '13px', outline: 'none',
                    boxSizing: 'border-box', backgroundColor: '#fafafa',
                  }}
                />
              </div>

              {/* Color fields */}
              <div>
                <div style={{fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px'}}>
                  Farver
                </div>
                {COLOR_FIELDS.map((field) => (
                  <ColorRow
                    key={field.key}
                    fieldKey={field.key}
                    label={field.label}
                    hint={field.hint}
                    value={editColors[field.key]}
                    onChange={handleColorChange}
                  />
                ))}
              </div>
            </div>

            {/* Right: live preview */}
            <div style={{flexShrink: 0, width: '180px'}}>
              <div style={{fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '8px'}}>
                Forhåndsvisning
              </div>
              <div style={{borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', border: '1px solid #eee'}}>
                <MiniPreview
                  label={editName || 'Mit tema'}
                  brand={editColors.brand}
                  warmWhite={editColors.warmWhite}
                  warmBrown={editColors.warmBrown}
                  darkStone={editColors.darkStone}
                />
              </div>

              {/* Derived colors hint */}
              <div style={{marginTop: '12px'}}>
                <div style={{fontSize: '10px', color: '#aaa', marginBottom: '6px', letterSpacing: '0.04em'}}>Auto-afledte farver</div>
                <div style={{display: 'flex', gap: '4px', flexWrap: 'wrap'}}>
                  {Object.entries(deriveFullTheme(editColors))
                    .filter(([k]) => !['--brand', '--brand-light', '--warm-white', '--warm-brown', '--dark-stone'].includes(k))
                    .map(([k, v]) => (
                      <div key={k} title={`${k}: ${v}`} style={{
                        width: '18px', height: '18px', borderRadius: '3px',
                        backgroundColor: v, border: '1px solid rgba(0,0,0,0.08)',
                        cursor: 'help',
                      }} />
                    ))}
                </div>
                <div style={{fontSize: '9px', color: '#bbb', marginTop: '4px', lineHeight: 1.4}}>
                  Hover for variabelnavne
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div style={{
            padding: '14px 20px', borderTop: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px',
            backgroundColor: '#fafafa',
          }}>
            <button
              type="button"
              onClick={handleCancel}
              style={{
                all: 'unset', cursor: 'pointer', padding: '7px 16px',
                fontSize: '12px', color: '#666', borderRadius: '6px',
                border: '1px solid #ddd', backgroundColor: '#fff',
              }}
            >
              Annullér
            </button>
            <button
              type="button"
              onClick={handleSave}
              style={{
                all: 'unset', cursor: 'pointer', padding: '7px 20px',
                fontSize: '12px', fontWeight: 600, color: '#fff', borderRadius: '6px',
                background: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)',
              }}
            >
              Gem tema
            </button>
          </div>
        </div>
      )}

      {/* Description for active preset */}
      {!isCustomActive && !editorOpen && activePreset && COLOR_THEMES[activePreset] && (
        <p style={{marginTop: '12px', fontSize: '12px', color: '#888', fontStyle: 'italic'}}>
          {COLOR_THEMES[activePreset].description}
        </p>
      )}
    </div>
  )
}
