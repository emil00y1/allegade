import React, {Component, type ReactNode} from 'react'
import {Button, Card, Heading, Stack, Text} from '@sanity/ui'

interface WidgetBoundaryProps {
  title: string
  children: ReactNode
}

interface WidgetBoundaryState {
  error: Error | null
}

export class WidgetBoundary extends Component<WidgetBoundaryProps, WidgetBoundaryState> {
  state: WidgetBoundaryState = {error: null}

  static getDerivedStateFromError(error: Error): WidgetBoundaryState {
    return {error}
  }

  componentDidCatch(error: Error): void {
    console.error(`Analytics widget "${this.props.title}" failed:`, error)
  }

  private handleReset = (): void => {
    this.setState({error: null})
  }

  render(): ReactNode {
    const {error} = this.state
    if (error) {
      return (
        <Card padding={4} radius={3} shadow={1} tone="critical">
          <Stack space={3}>
            <Heading size={1}>{this.props.title} unavailable</Heading>
            <Text size={1} muted>
              {error.message}
            </Text>
            <Button text="Retry" mode="ghost" onClick={this.handleReset} />
          </Stack>
        </Card>
      )
    }
    return this.props.children
  }
}
