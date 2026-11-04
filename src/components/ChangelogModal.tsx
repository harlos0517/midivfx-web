import { Group, List, Modal, Stack, Text, Title } from '@mantine/core'

import useChangelogStore from '@/store/changelogStore'
import useLocaleStore, { useMessages } from '@/store/localeStore'

const ChangelogModal = () => {
  const m = useMessages()
  const locale = useLocaleStore(s => s.locale)
  const entries = useChangelogStore(s => s.entries)
  const isUpdate = useChangelogStore(s => s.isUpdate)
  const close = useChangelogStore(s => s.close)

  return <Modal
    opened={entries !== null}
    onClose={close}
    title={isUpdate ? m.changelog.updated : m.changelog.history}
    size="lg"
  >
    <Stack gap="lg">
      {entries?.map(entry => <Stack key={entry.version}>
        <Group gap="sm" align="baseline">
          <Title order={4}>v{entry.version}</Title>
          <Text size="sm" c="dimmed">{entry.date}</Text>
        </Group>
        <List size="sm" spacing={4}>
          {entry.changes[locale].map(change => <List.Item key={change}>{change}</List.Item>)}
        </List>
      </Stack>)}
    </Stack>
  </Modal>
}

export default ChangelogModal
