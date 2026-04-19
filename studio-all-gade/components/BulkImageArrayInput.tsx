import {useCallback, useState} from 'react'
import {ArrayOfObjectsInputProps, insert, PatchEvent, useClient} from 'sanity'
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Grid,
  Spinner,
  Text,
  Checkbox,
  Stack,
  Badge,
} from '@sanity/ui'
import {AddIcon, ImagesIcon} from '@sanity/icons'

type ImageAsset = {
  _id: string
  url: string
  originalFilename?: string
  metadata?: {dimensions?: {width: number; height: number}}
}

const randomKey = () => Math.random().toString(36).slice(2, 14)

export function BulkImageArrayInput(props: ArrayOfObjectsInputProps) {
  const {onChange, renderDefault} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const [open, setOpen] = useState(false)
  const [assets, setAssets] = useState<ImageAsset[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  const handleOpen = useCallback(async () => {
    setOpen(true)
    setLoading(true)
    setSelected(new Set())
    try {
      const result = await client.fetch<ImageAsset[]>(
        `*[_type == "sanity.imageAsset"] | order(_createdAt desc) [0...200] {
          _id,
          url,
          originalFilename,
          metadata { dimensions }
        }`,
      )
      setAssets(result)
    } finally {
      setLoading(false)
    }
  }, [client])

  const handleClose = useCallback(() => {
    setOpen(false)
    setSelected(new Set())
  }, [])

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleConfirm = useCallback(() => {
    const items = assets
      .filter((a) => selected.has(a._id))
      .map((a) => ({
        _type: 'image',
        _key: randomKey(),
        asset: {_type: 'reference', _ref: a._id},
      }))

    if (items.length > 0) {
      onChange(PatchEvent.from(insert(items, 'after', [-1])))
    }

    handleClose()
  }, [assets, selected, onChange, handleClose])

  const selectCount = selected.size

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Box>
        <Button
          text="Vælg flere billeder"
          icon={AddIcon}
          mode="ghost"
          tone="primary"
          fontSize={1}
          padding={3}
          onClick={handleOpen}
        />
      </Box>

      {open && (
        <Dialog
          id="bulk-image-select-dialog"
          header={
            <Flex align="center" gap={2}>
              <ImagesIcon />
              <Text weight="semibold">Vælg billeder fra mediebiblioteket</Text>
              {selectCount > 0 && (
                <Badge tone="primary" radius={2}>
                  {selectCount} valgt
                </Badge>
              )}
            </Flex>
          }
          width={4}
          onClose={handleClose}
          footer={
            <Flex padding={3} justify="flex-end" gap={2}>
              <Button text="Annuller" mode="ghost" onClick={handleClose} />
              <Button
                text={
                  selectCount > 0
                    ? `Tilføj ${selectCount} billede${selectCount !== 1 ? 'r' : ''}`
                    : 'Tilføj billeder'
                }
                tone="primary"
                disabled={selectCount === 0}
                onClick={handleConfirm}
              />
            </Flex>
          }
        >
          <Box padding={4}>
            {loading ? (
              <Flex justify="center" padding={6}>
                <Spinner muted />
              </Flex>
            ) : assets.length === 0 ? (
              <Text muted>Ingen billeder fundet i mediebiblioteket.</Text>
            ) : (
              <Grid columns={[2, 3, 4]} gap={2}>
                {assets.map((asset) => {
                  const isSelected = selected.has(asset._id)
                  return (
                    <Card
                      key={asset._id}
                      radius={2}
                      border
                      tone={isSelected ? 'primary' : 'default'}
                      style={{cursor: 'pointer', overflow: 'hidden', position: 'relative'}}
                      onClick={() => toggleSelect(asset._id)}
                    >
                      <img
                        src={`${asset.url}?w=300&h=300&fit=crop&auto=format`}
                        alt={asset.originalFilename || ''}
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        loading="lazy"
                      />
                      <Box
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          background: isSelected
                            ? 'var(--card-focus-ring-color, #0070f3)'
                            : 'rgba(255,255,255,0.85)',
                          borderRadius: 4,
                          padding: 2,
                        }}
                      >
                        <Checkbox checked={isSelected} readOnly style={{display: 'block'}} />
                      </Box>
                    </Card>
                  )
                })}
              </Grid>
            )}
          </Box>
        </Dialog>
      )}
    </Stack>
  )
}
