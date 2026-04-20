import React, {useState} from 'react'
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Heading,
  Inline,
  Spinner,
  Stack,
  Tab,
  TabList,
  Text,
} from '@sanity/ui'
import {useAnalytics} from './hooks/useAnalytics'
import {OverviewCards} from './components/OverviewCards'
import {SessionsChart} from './components/SessionsChart'
import {TopPagesTable} from './components/TopPagesTable'
import {TopQueriesTable} from './components/TopQueriesTable'
import {WidgetBoundary} from './components/WidgetBoundary'
import type {AnalyticsRange} from './types'

function formatGeneratedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export function AnalyticsDashboard() {
  const [range, setRange] = useState<AnalyticsRange>('7d')
  const {data, error, isLoading, isRefreshing, refetch} = useAnalytics(range)

  return (
    <Box padding={[3, 4, 5]}>
      <Container width={4}>
        <Stack space={5}>
          <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
            <Stack space={2}>
              <Heading size={4}>Analytics</Heading>
              <Text size={1} muted>
                Google Analytics 4 & Search Console
                {data ? ` · updated ${formatGeneratedAt(data.generatedAt)}` : ''}
              </Text>
            </Stack>
            <Inline space={3}>
              <TabList space={1}>
                <Tab
                  id="range-7d"
                  aria-controls="analytics-body"
                  label="Last 7 days"
                  selected={range === '7d'}
                  onClick={() => setRange('7d')}
                />
                <Tab
                  id="range-30d"
                  aria-controls="analytics-body"
                  label="Last 30 days"
                  selected={range === '30d'}
                  onClick={() => setRange('30d')}
                />
              </TabList>
              <Button
                text="Refresh"
                mode="ghost"
                onClick={refetch}
                disabled={isLoading || isRefreshing}
              />
              {isRefreshing ? <Badge tone="primary">Refreshing…</Badge> : null}
            </Inline>
          </Flex>

          <Box id="analytics-body">
            {isLoading ? (
              <Card padding={5} radius={3} shadow={1}>
                <Flex align="center" justify="center" gap={3}>
                  <Spinner />
                  <Text size={1} muted>
                    Loading analytics…
                  </Text>
                </Flex>
              </Card>
            ) : error ? (
              <Card padding={4} radius={3} shadow={1} tone="critical">
                <Stack space={3}>
                  <Heading size={1}>Could not load analytics</Heading>
                  <Text size={1}>{error}</Text>
                  <Inline space={2}>
                    <Button text="Try again" tone="primary" onClick={refetch} />
                  </Inline>
                </Stack>
              </Card>
            ) : data ? (
              <Stack space={4}>
                <WidgetBoundary title="Overview">
                  <OverviewCards totals={data.totals} />
                </WidgetBoundary>

                <WidgetBoundary title="Daily sessions">
                  <SessionsChart daily={data.daily} timezone={data.timezone} />
                </WidgetBoundary>

                <WidgetBoundary title="Top pages">
                  <TopPagesTable rows={data.topPages} />
                </WidgetBoundary>

                <WidgetBoundary title="Search Console">
                  <TopQueriesTable
                    rows={data.searchConsole.topQueries}
                    siteUrl={data.searchConsole.siteUrl}
                  />
                </WidgetBoundary>
              </Stack>
            ) : (
              <Card padding={4} radius={3} shadow={1}>
                <Text size={1} muted>
                  No data available.
                </Text>
              </Card>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default AnalyticsDashboard
