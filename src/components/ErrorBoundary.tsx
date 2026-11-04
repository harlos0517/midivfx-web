import { Alert, Box, Button, Code, Collapse, Group, Stack, Text } from '@mantine/core'
import { WarningCircleIcon } from '@phosphor-icons/react'
import { Component, useState, type ErrorInfo, type ReactNode } from 'react'

import ErrorReportButtons from '@/components/ErrorReportButtons'
import { useMessages } from '@/store/localeStore'
import { buildReport, toError } from '@/utils/errorReport'

interface ErrorAlertProps {
  error: Error
  componentStack: string | null
  onRetry: () => void
}

const ErrorAlert = ({ error, componentStack, onRetry }: ErrorAlertProps) => {
  const m = useMessages().errors.boundary
  const [showDetails, setShowDetails] = useState(false)
  const report = buildReport(error, componentStack)

  return <Box p="md">
    <Alert
      color="red" variant="light" title={m.title}
      icon={<WarningCircleIcon />}
    >
      <Stack>
        <Text>{m.desc}</Text>
        <Text ff="monospace" style={{ wordBreak: 'break-word' }}>
          {error.message || String(error)}
        </Text>
        <Group>
          <Button color="red" onClick={onRetry}>{m.retry}</Button>
          <Button variant="default" onClick={() => location.reload()}>
            {m.reload}
          </Button>
        </Group>
        <Group>
          <ErrorReportButtons error={error} report={report} />
        </Group>
        <Button
          variant="outline"
          w="auto" color="gray"
          onClick={() => setShowDetails(v => !v)}
        >
          {showDetails ? m.hideDetails : m.showDetails}
        </Button>
        <Collapse expanded={showDetails}>
          <Code block style={{
            maxHeight: 240,
            maxWidth: '100%',
            overflow: 'auto',
            'overflow-x': 'auto',
            'white-space': 'pre-wrap',
            'word-break': 'break-all',
          }}>
            {report}
          </Code>
        </Collapse>
      </Stack>
    </Alert>
  </Box>
}

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
  componentStack: string | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, componentStack: null }

  static getDerivedStateFromError(error: unknown): Pick<ErrorBoundaryState, 'error'> {
    return { error: toError(error) }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error(error, info.componentStack)
    this.setState({ componentStack: info.componentStack ?? null })
  }

  reset = () => this.setState({ error: null, componentStack: null })

  render() {
    const { error, componentStack } = this.state
    if (error) {
      return <ErrorAlert
        error={error} componentStack={componentStack} onRetry={this.reset}
      />
    }
    return this.props.children
  }
}

export default ErrorBoundary
