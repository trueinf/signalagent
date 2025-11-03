'use client'

interface Stats {
  priority: {
    high: number
    medium: number
    low: number
  }
  sources: Record<string, number>
}

interface SidebarSummaryProps {
  stats: Stats | null
}

export default function SidebarSummary({ stats }: SidebarSummaryProps) {
  if (!stats) return null

  const sourceLabels: Record<string, string> = {
    TRIAL: 'Azure Trials',
    WEBINAR: 'Signal Webinars',
    SQL: 'SQL (Field referrals)',
    CAMPAIGN_DOWNLOAD: 'Campaign Downloads',
    CAMPAIGN_EMAIL: 'Campaign Emails',
    UNCLASSIFIED: 'Unclassified',
  }

  return (
    <div className="bg-white rounded p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        Summary
      </h3>

      <div className="mb-6">
        <h4 className="text-base font-medium text-[var(--text-secondary)] mb-3">
          Lead Count by Priority
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-base text-[var(--text-primary)]">High (Score ≥ 85)</span>
            <span className="font-semibold text-green-600">{stats.priority.high}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base text-[var(--text-primary)]">Medium (Score 70–84)</span>
            <span className="font-semibold text-yellow-600">{stats.priority.medium}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-base text-[var(--text-primary)]">Low (Score &lt;70)</span>
            <span className="font-semibold text-gray-600">{stats.priority.low}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-base font-medium text-[var(--text-secondary)] mb-3">
          Breakdown by Source Type
        </h4>
        <div className="space-y-2">
          {Object.entries(stats.sources).map(([source, count]) => (
            <div key={source} className="flex items-center justify-between">
              <span className="text-base text-[var(--text-primary)]">
                {sourceLabels[source] || source}
              </span>
              <span className="font-semibold text-[var(--text-secondary)]">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-[var(--color-blue-10)] rounded">
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="font-medium">{stats.priority.high} leads</span> have shown strong Azure usage within the past 48 hours.
        </p>
      </div>
    </div>
  )
}
