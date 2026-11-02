import { Select } from '@mantine/core'
import { TranslateIcon } from '@phosphor-icons/react'

import ConfigOptionRow from '@/components/ConfigOptionRow'
import PanelWrapper from '@/components/PanelWrapper'
import useLocaleStore, { localeNames, useMessages, type Locale } from '@/store/localeStore'

const MiscellaneousPanel = () => {
  const m = useMessages()
  const locale = useLocaleStore(s => s.locale)
  const setLocale = useLocaleStore(s => s.setLocale)

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
  </PanelWrapper>
}

export default MiscellaneousPanel
