import React from 'react'
import {Box, Card, Heading, Stack, Text} from '@sanity/ui'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type {DailyPoint} from '../types'

interface SessionsChartProps {
  daily: DailyPoint[]
  timezone: string
}

function formatTick(date: string): string {
  const parts = date.split('-')
  if (parts.length !== 3) return date
  return `${parts[1]}-${parts[2]}`
}

export function SessionsChart({daily, timezone}: SessionsChartProps) {
  return (
    <Card padding={4} radius={3} shadow={1} tone="default">
      <Stack space={4}>
        <Stack space={2}>
          <Heading size={2}>Daily sessions</Heading>
          <Text size={0} muted>
            Timezone: {timezone}
          </Text>
        </Stack>

        {daily.length === 0 ? (
          <Text size={1} muted>
            No data for the selected range.
          </Text>
        ) : (
          <Box style={{width: '100%', height: 240}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={daily}
                margin={{top: 8, right: 16, bottom: 8, left: 0}}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--card-border-color)"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatTick}
                  tick={{fontSize: 11}}
                  stroke="var(--card-muted-fg-color)"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{fontSize: 11}}
                  stroke="var(--card-muted-fg-color)"
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card-bg-color)',
                    border: '1px solid var(--card-border-color)',
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                  labelStyle={{color: 'var(--card-fg-color)'}}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="var(--card-focus-ring-color, #2276fc)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Stack>
    </Card>
  )
}
