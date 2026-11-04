import { currentVersion } from '@/i18n/changelog'
import { REPO_URL } from '@/utils/const'

// GitHub rejects issue URLs much longer than ~8 KB, so the prefilled body is capped
const MAX_ISSUE_BODY = 2048

export const toError = (value: unknown) =>
  value instanceof Error ? value : new Error(String(value))

export const buildReport = (error: Error, componentStack?: string | null) => [
  `MIDIVFX v${currentVersion}`,
  navigator.userAgent,
  '',
  error.stack || `${error.name}: ${error.message}`,
  ...componentStack ? ['', 'Component stack:', componentStack.trim()] : [],
].join('\n')

export const buildIssueUrl = (error: Error, report: string) => {
  const body = report.length > MAX_ISSUE_BODY
    ? `${report.slice(0, MAX_ISSUE_BODY)}\n...`
    : report
  const params = new URLSearchParams({
    title: (error.message || error.name).slice(0, 100),
    body: `\`\`\`\n${body}\n\`\`\``,
  })
  return `${REPO_URL}/issues/new?${params}`
}
