import { Alert, Badge, getDefaultZIndex, Group, Portal, Stack, Text } from '@mantine/core'
import { WarningCircleIcon } from '@phosphor-icons/react'

import ErrorReportButtons from '@/components/ErrorReportButtons'
import useErrorStore, { type CaughtError } from '@/store/errorStore'
import { useMessages } from '@/store/localeStore'
import { buildReport } from '@/utils/errorReport'

const GlobalErrorAlert = ({ caught }: { caught: CaughtError }) => {
  const m = useMessages().errors.unexpected
  const dismiss = useErrorStore(s => s.dismiss)
  const { error, count } = caught

  return <Alert
    color="red" variant="filled" icon={<WarningCircleIcon />}
    withCloseButton closeButtonLabel={m.dismiss} onClose={() => dismiss(caught.id)}
    title={<Group>
      {m.title}
      {count > 1 && <Badge color="dark" size="sm">{m.repeated(count)}</Badge>}
    </Group>}
  >
    <Stack>
      <Text size="sm">{m.desc}</Text>
      <Text size="sm" ff="monospace" lineClamp={3} style={{ wordBreak: 'break-word' }}>
        {error.message || String(error)}
      </Text>
      <Group>
        <ErrorReportButtons error={error} report={buildReport(error)} />
      </Group>
    </Stack>
  </Alert>
}

const GlobalErrorAlerts = () => {
  const errors = useErrorStore(s => s.errors)
  if (!errors.length) return null

  return <Portal>
    <Stack
      gap="sm" pos="fixed" bottom={16} right={16}
      w="min(420px, calc(100vw - 32px))" style={{ zIndex: getDefaultZIndex('max') }}
    >
      {errors.map(caught => <GlobalErrorAlert key={caught.id} caught={caught} />)}
    </Stack>
  </Portal>
}

export default GlobalErrorAlerts
