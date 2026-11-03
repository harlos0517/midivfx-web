import { Tour, type FloatingPosition } from '@mantine/core'
import type { DockviewApi } from 'dockview-react'

import type { Messages } from '@/i18n/en'
import { useMessages } from '@/store/localeStore'
import useTourStore from '@/store/tourStore'

type PanelId = keyof Messages['tour']['steps']

/** Workflow order, not layout order. */
const steps: PanelId[] = [
  'Import', 'Main', 'Navigator', 'Tracks', 'Styles',
  'Playback', 'Camera', 'Display', 'Export', 'Miscellaneous',
]

// Full-height panels leave no room above or below, so the tooltip goes beside them
const positions: Partial<Record<PanelId, FloatingPosition>> = {
  Tracks: 'right',
  Styles: 'left',
}

interface GuidedTourProps {
  api: DockviewApi
}

const GuidedTour = ({ api }: GuidedTourProps) => {
  const m = useMessages()
  const active = useTourStore(s => s.active)
  const close = useTourStore(s => s.close)

  return <Tour active={active} onClose={close} labels={m.tour.labels}>
    {steps.map(id => <Tour.Step
      key={id}
      // A getter, because dragging a panel into another group replaces its group element
      target={{ get current() { return api.getPanel(id)?.group.element ?? null } }}
      title={m.panels[id]}
      position={positions[id] ?? 'bottom'}
      // The panel may sit behind another tab in its group
      onStepOpen={() => api.getPanel(id)?.api.setActive()}
    >
      {m.tour.steps[id]}
    </Tour.Step>)}
  </Tour>
}

export default GuidedTour
