import {useCallback, useRef, useState} from 'react'
import {set, unset} from 'sanity'
import type {StringInputProps} from 'sanity'
import {Button, Flex, Text, Box, Stack} from '@sanity/ui'
import {UploadIcon, TrashIcon} from '@sanity/icons'

const UPLOAD_URL =
  (import.meta as unknown as {env: Record<string, string>}).env
    .SANITY_STUDIO_UPLOAD_URL || 'http://localhost:3000/api/upload-font'

const UPLOAD_SECRET =
  (import.meta as unknown as {env: Record<string, string>}).env
    .SANITY_STUDIO_FONT_UPLOAD_SECRET || ''

export function FontFileUploadInput(props: StringInputProps) {
  const {value, onChange, readOnly} = props
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      setError(null)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const headers: Record<string, string> = {}
        if (UPLOAD_SECRET) headers['x-upload-secret'] = UPLOAD_SECRET

        const res = await fetch(UPLOAD_URL, {method: 'POST', body: formData, headers})

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || `Upload fejlede (${res.status})`)
        }

        const {url} = await res.json()
        onChange(set(url))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload fejlede')
      } finally {
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [onChange],
  )

  const handleRemove = useCallback(() => {
    onChange(unset())
    setError(null)
  }, [onChange])

  const fileName = value ? decodeURIComponent(value.split('/').pop()?.split('?')[0] ?? '') : null

  return (
    <Stack space={2}>
      <input
        ref={inputRef}
        type="file"
        accept=".woff2,.woff,.ttf,.otf"
        style={{display: 'none'}}
        onChange={handleUpload}
        disabled={readOnly || uploading}
      />

      {value ? (
        <Flex align="center" gap={2}>
          <Text size={1} muted style={{wordBreak: 'break-all'}}>
            {fileName}
          </Text>
          <Button
            icon={TrashIcon}
            tone="critical"
            mode="ghost"
            onClick={handleRemove}
            disabled={readOnly}
            text="Fjern"
            fontSize={1}
            padding={2}
          />
        </Flex>
      ) : (
        <Box>
          <Button
            icon={UploadIcon}
            tone="primary"
            mode="ghost"
            text={uploading ? 'Uploader…' : 'Vælg skrifttypefil'}
            fontSize={1}
            padding={2}
            disabled={readOnly || uploading}
            onClick={() => inputRef.current?.click()}
          />
        </Box>
      )}

      {error && (
        <Text size={1} style={{color: 'var(--card-critical-fg-color, red)'}}>
          {error}
        </Text>
      )}
    </Stack>
  )
}
