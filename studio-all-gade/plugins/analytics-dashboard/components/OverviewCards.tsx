import React from 'react'
import {Card, Grid, Heading, Stack, Text} from '@sanity/ui'
import type {AnalyticsTotals} from '../types'

interface OverviewCardsProps {
  totals: AnalyticsTotals
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(n))
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const total = Math.round(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

interface MetricCardProps {
  label: string
  value: string
}

function MetricCard({label, value}: MetricCardProps) {
  return (
    <Card padding={4} radius={3} shadow={1} tone="default">
      <Stack space={3}>
        <Text size={1} muted>
          {label}
        </Text>
        <Heading size={3}>{value}</Heading>
      </Stack>
    </Card>
  )
}

export function OverviewCards({totals}: OverviewCardsProps) {
  return (
    <Grid columns={[1, 2, 4]} gap={3}>
      <MetricCard label="Sessions" value={formatNumber(totals.sessions)} />
      <MetricCard label="Users" value={formatNumber(totals.users)} />
      <MetricCard label="Page views" value={formatNumber(totals.pageviews)} />
      <MetricCard
        label="Avg. session duration"
        value={formatDuration(totals.avgSessionDurationSec)}
      />
    </Grid>
  )
}
