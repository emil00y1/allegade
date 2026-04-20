import React, {useMemo, useState} from 'react'
import {Box, Card, Flex, Heading, Inline, Stack, Text} from '@sanity/ui'
import type {TopPage} from '../types'

interface TopPagesTableProps {
  rows: TopPage[]
}

type SortKey = 'pageviews' | 'sessions'

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(n))
}

export function TopPagesTable({rows}: TopPagesTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('pageviews')

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => b[sortKey] - a[sortKey])
  }, [rows, sortKey])

  return (
    <Card padding={4} radius={3} shadow={1} tone="default">
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Heading size={2}>Top pages</Heading>
          <Inline space={2}>
            <SortButton
              active={sortKey === 'pageviews'}
              onClick={() => setSortKey('pageviews')}
              label="Views"
            />
            <SortButton
              active={sortKey === 'sessions'}
              onClick={() => setSortKey('sessions')}
              label="Sessions"
            />
          </Inline>
        </Flex>

        {sorted.length === 0 ? (
          <Text size={1} muted>
            No data for the selected range.
          </Text>
        ) : (
          <Stack as="ul" space={2} style={{listStyle: 'none', padding: 0, margin: 0}}>
            <Box as="li" paddingY={2}>
              <Flex gap={3}>
                <Box flex={4}>
                  <Text size={0} muted weight="semibold">
                    Page
                  </Text>
                </Box>
                <Box flex={1} style={{textAlign: 'right'}}>
                  <Text size={0} muted weight="semibold">
                    Views
                  </Text>
                </Box>
                <Box flex={1} style={{textAlign: 'right'}}>
                  <Text size={0} muted weight="semibold">
                    Sessions
                  </Text>
                </Box>
              </Flex>
            </Box>
            {sorted.map((row, idx) => (
              <Box
                as="li"
                key={`${row.path}-${idx}`}
                paddingY={2}
                style={{borderTop: '1px solid var(--card-border-color)'}}
              >
                <Flex gap={3} align="center">
                  <Box flex={4} style={{minWidth: 0}}>
                    <Stack space={1}>
                      <Text size={1} weight="medium" textOverflow="ellipsis">
                        {row.title || row.path}
                      </Text>
                      <Text size={0} muted textOverflow="ellipsis">
                        {row.path}
                      </Text>
                    </Stack>
                  </Box>
                  <Box flex={1} style={{textAlign: 'right'}}>
                    <Text size={1}>{formatNumber(row.pageviews)}</Text>
                  </Box>
                  <Box flex={1} style={{textAlign: 'right'}}>
                    <Text size={1}>{formatNumber(row.sessions)}</Text>
                  </Box>
                </Flex>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}

interface SortButtonProps {
  active: boolean
  label: string
  onClick: () => void
}

function SortButton({active, label, onClick}: SortButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
      }}
    >
      <Text size={1} weight={active ? 'semibold' : 'regular'} muted={!active}>
        {label}
      </Text>
    </button>
  )
}
