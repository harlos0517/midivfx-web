import { Button, CopyButton } from '@mantine/core'
import { ArrowSquareOutIcon, CheckIcon, CopyIcon } from '@phosphor-icons/react'

import { useMessages } from '@/store/localeStore'
import { buildIssueUrl } from '@/utils/errorReport'

interface ErrorReportButtonsProps {
  error: Error
  report: string
}

const ErrorReportButtons = ({ error, report }: ErrorReportButtonsProps) => {
  const m = useMessages().errors.report

  return <>
    <CopyButton value={report}>
      {({ copied, copy }) => <Button
        variant="default" onClick={copy}
        leftSection={copied ? <CheckIcon /> : <CopyIcon />}
      >
        {copied ? m.copied : m.copy}
      </Button>}
    </CopyButton>
    <Button
      variant="default"
      component="a" href={buildIssueUrl(error, report)}
      target="_blank" rel="noopener noreferrer"
      leftSection={<ArrowSquareOutIcon />}
    >
      {m.report}
    </Button>
  </>
}

export default ErrorReportButtons
