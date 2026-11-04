import { Button, Checkbox, Group, Modal, Stack, Text } from '@mantine/core'
import { useState } from 'react'

import useConfigStore from '@/store/configStore'
import { useMessages } from '@/store/localeStore'
import {
  applyConfigFile,
  configSections,
  createConfigFile,
  downloadConfigFile,
  getFileSections,
  type ConfigFile,
  type ConfigSection,
} from '@/utils/configFile'

const sectionPanels = { camera: 'Camera', display: 'Display', styles: 'Styles' } as const

interface ConfigFileFormProps {
  /** `export` to save, or a parsed file to load it. */
  target: 'export' | ConfigFile
  onClose: () => void
}

const ConfigFileForm = ({ target, onClose }: ConfigFileFormProps) => {
  const m = useMessages()
  const resolution = useConfigStore(s => s.config.export)
  const isImport = target !== 'export'
  const available: readonly ConfigSection[] = isImport ? getFileSections(target) : configSections

  const [sections, setSections] = useState<ConfigSection[]>([...available])
  const [applyResolution, setApplyResolution] = useState(true)

  const fileResolution = isImport ? target.resolution : undefined
  const resolutionDiffers = fileResolution !== undefined && (
    fileResolution.width !== resolution.width || fileResolution.height !== resolution.height
  )

  const toggle = (section: ConfigSection, checked: boolean) =>
    setSections(s => checked ? [...s, section] : s.filter(x => x !== section))

  const onConfirm = () => {
    const { config, setConfig } = useConfigStore.getState()
    if (target === 'export') downloadConfigFile(createConfigFile(config, sections))
    else setConfig(c => applyConfigFile(c, target, sections, applyResolution))
    onClose()
  }

  return <Stack>
    {available.map(section => <Stack key={section} gap={6}>
      <Checkbox
        label={m.panels[sectionPanels[section]]}
        description={isImport && section === 'styles' ? m.configFile.replaceStyles : undefined}
        checked={sections.includes(section)}
        onChange={e => toggle(section, e.currentTarget.checked)}
      />
      {section === 'camera' && resolutionDiffers && <Checkbox
        ml="lg"
        label={m.configFile.resolution(fileResolution.width, fileResolution.height)}
        description={m.configFile.resolutionDesc}
        checked={applyResolution && sections.includes('camera')}
        disabled={!sections.includes('camera')}
        onChange={e => setApplyResolution(e.currentTarget.checked)}
      />}
    </Stack>)}
    {target === 'export' && <Text size="xs" c="dimmed">{m.configFile.excluded}</Text>}
    <Group justify="flex-end">
      <Button variant="default" onClick={onClose}>{m.configFile.cancel}</Button>
      <Button disabled={sections.length === 0} onClick={onConfirm}>
        {isImport ? m.configFile.import : m.configFile.export}
      </Button>
    </Group>
  </Stack>
}

interface ConfigFileModalProps {
  /** `export` to save, a parsed file to load it, or `null` when closed. */
  target: 'export' | ConfigFile | null
  onClose: () => void
}

const ConfigFileModal = ({ target, onClose }: ConfigFileModalProps) => {
  const m = useMessages()
  return <Modal
    opened={target !== null}
    onClose={onClose}
    title={target === 'export' ? m.configFile.exportTitle : m.configFile.importTitle}
  >
    {/* Mounted per opening, so the choices start from what this file contains */}
    {target !== null && <ConfigFileForm target={target} onClose={onClose} />}
  </Modal>
}

export default ConfigFileModal
