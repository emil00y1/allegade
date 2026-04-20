import React from 'react'
import {Box, Card, Flex, Heading, Stack, Text} from '@sanity/ui'
import type {TopQuery} from '../types'

interface TopQueriesTableProps {
  rows: TopQuery[]
  siteUrl: string
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(n))
}

function formatCtr(ctr: number): string {
  return `${(ctr * 100).toFixed(1)}%`
}

function formatPosition(pos: number): string {
  return pos.toFixed(1)
}

export function TopQueriesTable({rows, siteUrl}: TopQueriesTableProps) {
  return (
    <Card padding={4} radius={3} shadow={1} tone="default">
      <Stack space={4}>
        <Stack space={2}>
          <Heading size={2}>Search Console — top queries</Heading>
          <Text size={0} muted>
            {siteUrl} · last 28 days
          </Text>
        </Stack>

        {rows.length === 0 ? (
          <Text size={1} muted>
            No query data available.
          </Text>
        ) : (
          <Stack as="ul" space={2} style={{listStyle: 'none', padding: 0, margin: 0}}>
            <Box as="li" paddingY={2}>
              <Flex gap={3}>
                <Box flex={4}>
                  <Text size={0} muted weight="semibold">
                    Query
                  </Text>
                </Box>
                <Box flex={1} style={{textAlign: 'right'}}>
                  <Text size={0} muted weight="semibold">
                    Clicks
                  </Text>
                </Box>
                <Box flex={1} style={{textAlign: 'right'}}>
                  <Text size={0} muted weight="semibold">
                    Impr.
                  </Text>
                </Box>
                <Box flex={1} style={{textAlign: 'right'}}>
                  <Text size={0} muted weight="semibold">
                    CTR
                  </Text>
                </Box>
                <Box flex={1} style={{textAlign: 'right'}}>
                  <Text size={0} muted weight="semibold">
                    Pos.
                  </Text>
                </Box>
              </Flex>
            </Box>
            {rows.map((row, idx) => (
              <Box
                as="li"
                key={`${row.query}-${idx}`}
                paddingY={2}
                style={{borderTop: '1px solid var(--card-border-color)'}}
              >
                <Flex gap={3} align="center">
                  <Box flex={4} style={{minWidth: 0}}>
                    <Text size={1} weight="medium" textOverflow="ellipsis">
                      {row.query}
                    </Text>
                  </Box>
                  <Box flex={1} style={{textAlign: 'right'}}>
                    <Text size={1}>{formatNumber(row.clicks)}</Text>
                  </Box>
                  <Box flex={1} style={{textAlign: 'right'}}>
                    <Text size={1}>{formatNumber(row.impressions)}</Text>
                  </Box>
                  <Box flex={1} style={{textAlign: 'right'}}>
                    <Text size={1}>{formatCtr(row.ctr)}</Text>
                  </Box>
                  <Box flex={1} style={{textAlign: 'right'}}>
                    <Text size={1}>{formatPosition(row.position)}</Text>
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
