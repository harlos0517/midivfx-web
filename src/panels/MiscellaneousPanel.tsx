import { Button, Select } from '@mantine/core'
import { SignpostIcon, TranslateIcon } from '@phosphor-icons/react'

import ConfigOptionRow from '@/components/ConfigOptionRow'
import PanelWrapper from '@/components/PanelWrapper'
import useLocaleStore, { localeNames, useMessages, type Locale } from '@/store/localeStore'
import useTourStore from '@/store/tourStore'

const MiscellaneousPanel = () => {
  const m = useMessages()
  const locale = useLocaleStore(s => s.locale)
  const setLocale = useLocaleStore(s => s.setLocale)
  const startTour = useTourStore(s => s.start)

  return <PanelWrapper>
    <ConfigOptionRow label={<TranslateIcon />} tooltip={m.miscellaneous.language}>
      <Select
        flex="1"
        aria-label={m.miscellaneous.language.name}
        value={locale}
        onChange={v => setLocale(v as Locale)}
        data={Object.entries(localeNames).map(([value, label]) => ({ value, label }))}
        allowDeselect={false}
      />
    </ConfigOptionRow>
    <ConfigOptionRow label={<SignpostIcon />} tooltip={m.miscellaneous.tour}>
      <Button flex="1" variant="default" onClick={startTour}>{m.tour.start}</Button>
    </ConfigOptionRow>
  </PanelWrapper>
}

export default MiscellaneousPanel
