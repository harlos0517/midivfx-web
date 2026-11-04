import { ActionIcon, CheckIcon, ColorSwatch, Group, Select } from '@mantine/core'
import {
  ClockCounterClockwiseIcon,
  GithubLogoIcon,
  GlobeIcon,
  HeartIcon,
  PaletteIcon,
  SignpostIcon,
  TranslateIcon,
} from '@phosphor-icons/react'

import ConfigOptionRow from '@/components/ConfigOptionRow'
import OptionTooltip from '@/components/OptionTooltip'
import PanelWrapper from '@/components/PanelWrapper'
import useChangelogStore from '@/store/changelogStore'
import useLocaleStore, { localeNames, useMessages, type Locale } from '@/store/localeStore'
import useThemeStore, { themeColors } from '@/store/themeStore'
import useTourStore from '@/store/tourStore'
import { getSupportUrl, REPO_URL, WEBSITE_URL } from '@/utils/const'

const MiscellaneousPanel = () => {
  const m = useMessages()
  const locale = useLocaleStore(s => s.locale)
  const setLocale = useLocaleStore(s => s.setLocale)
  const startTour = useTourStore(s => s.start)
  const openHistory = useChangelogStore(s => s.openHistory)
  const themeColor = useThemeStore(s => s.themeColor)
  const setThemeColor = useThemeStore(s => s.setThemeColor)

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
    <ConfigOptionRow label={<PaletteIcon />} tooltip={m.miscellaneous.themeColor}>
      <Group
        flex="1" gap={4} wrap="wrap"
        role="radiogroup" aria-label={m.miscellaneous.themeColor.name}
      >
        {themeColors.map(color => <ColorSwatch
          key={color}
          component="button"
          role="radio"
          aria-label={color}
          aria-checked={color === themeColor}
          color={`var(--mantine-color-${color}-filled)`}
          size="1.5rem"
          radius="sm"
          c="white"
          style={{ cursor: 'pointer' }}
          onClick={() => setThemeColor(color)}
        >
          {color === themeColor && <CheckIcon size={12} />}
        </ColorSwatch>)}
      </Group>
    </ConfigOptionRow>
    <Group>
      <OptionTooltip tip={m.miscellaneous.tour}>
        <ActionIcon flex="1" variant="default" size="xl" onClick={startTour}>
          <SignpostIcon />
        </ActionIcon>
      </OptionTooltip>
      <OptionTooltip tip={m.miscellaneous.history}>
        <ActionIcon flex="1" variant="default" size="xl" onClick={openHistory}>
          <ClockCounterClockwiseIcon />
        </ActionIcon>
      </OptionTooltip>
    </Group>
    <Group>
      <OptionTooltip tip={m.miscellaneous.github}>
        <ActionIcon
          flex="1" variant="default" size="xl"
          component="a" href={REPO_URL} target="_blank" rel="noopener noreferrer"
        >
          <GithubLogoIcon />
        </ActionIcon>
      </OptionTooltip>
      <OptionTooltip tip={m.miscellaneous.website}>
        <ActionIcon
          flex="1" variant="default" size="xl"
          component="a" href={WEBSITE_URL} target="_blank" rel="noopener noreferrer"
        >
          <GlobeIcon />
        </ActionIcon>
      </OptionTooltip>
      <OptionTooltip tip={m.miscellaneous.support}>
        <ActionIcon
          flex="1" variant="default" size="xl"
          component="a" href={getSupportUrl(locale)} target="_blank" rel="noopener noreferrer"
        >
          <HeartIcon />
        </ActionIcon>
      </OptionTooltip>
    </Group>
  </PanelWrapper>
}

export default MiscellaneousPanel
