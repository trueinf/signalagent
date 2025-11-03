import { Lead } from '@prisma/client'
import { Copy, Link2, Sparkle, Target, X } from 'lucide-react'
import type { SimilarWinsDetail } from '@/lib/data/leadEnhancements'

interface SimilarWinsPanelProps {
  open: boolean
  lead?: Lead | null
  detail?: SimilarWinsDetail
  onClose: () => void
}

export default function SimilarWinsPanel({ open, lead, detail, onClose }: SimilarWinsPanelProps) {
  if (!open || !lead || !detail) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="relative flex h-full w-full max-w-xl flex-col overflow-hidden bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="similar-wins-title"
      >
        <header className="border-b border-[var(--border-subtle)] bg-[var(--color-blue-10)] px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Similar Wins</p>
              <h2 id="similar-wins-title" className="text-lg font-semibold text-[var(--text-primary)]">
                {lead.company || 'This lead'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Insights from recently closed, closely matched opportunities.
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close similar wins"
              className="rounded-full border border-[var(--border-subtle)] bg-white p-2 text-[var(--text-secondary)] transition hover:bg-[var(--background-hover)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <SimilarWinsDetailView detail={detail} />
      </aside>
    </div>
  )
}

export function SimilarWinsDetailView({
  detail,
  scrollable = true,
  className,
}: {
  detail: SimilarWinsDetail
  scrollable?: boolean
  className?: string
}) {
  const classes = [
    scrollable ? 'flex-1 overflow-y-auto' : '',
    scrollable ? 'px-6 py-6' : '',
    'space-y-6',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <section className="space-y-3 rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-blue-10)] text-[var(--color-blue-80)]">
            <Target className="h-4 w-4" />
          </span>
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-primary)]">{detail.matchSummary}</p>
            {detail.matchConfidence && (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                <Sparkle className="h-3 w-3" />
                Match Confidence: {detail.matchConfidence.level} ({detail.matchConfidence.percent}%)
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {detail.wins.map((win) => (
          <details
            key={win.id}
            className="group rounded-xl border border-[var(--border-strong)] bg-white shadow-sm"
            open
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{win.customer}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {win.contact} {win.contactTitle && `– ${win.contactTitle}`}
                </p>
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-blue-80)]">
                Closed {win.closedDate}
              </span>
            </summary>
            <div className="space-y-4 border-t border-[var(--border-subtle)] px-5 py-4">
              <div className="grid gap-3 text-sm text-[var(--text-secondary)] md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-placeholder)]">Source</p>
                  <p className="text-[var(--text-primary)]">{win.source}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-placeholder)]">Closed by</p>
                  <p className="text-[var(--text-primary)]">
                    {win.closedBy}
                    {win.outcome ? ` · ${win.outcome}` : ''}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-placeholder)]">Key signals</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
                    {win.keySignals.map((signal, idx) => (
                      <li key={`${win.id}-signal-${idx}`}>{signal}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-placeholder)]">Action taken</p>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
                    {win.actions.map((action, idx) => (
                      <li key={`${win.id}-action-${idx}`}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {(win.objection || win.rebuttal) && (
                <div className="rounded-lg bg-[var(--color-blue-10)]/80 p-4 text-sm text-[var(--text-secondary)]">
                  {win.objection && (
                    <p className="font-semibold text-[var(--text-primary)]">Objection: <span className="font-normal">{win.objection}</span></p>
                  )}
                  {win.rebuttal && (
                    <p className="mt-1">
                      <span className="font-semibold text-[var(--text-primary)]">Rebuttal used:</span> {win.rebuttal}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <SimilarWinsActionButton label="Copy Talk Track" />
                <SimilarWinsActionButton label="Copy Email Subject" />
                <SimilarWinsActionButton label="Use in Engage Flow" variant="primary" />
              </div>
            </div>
          </details>
        ))}
      </section>

      <section className="space-y-4 rounded-xl border border-[var(--color-blue-40)] bg-[var(--color-blue-10)]/70 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-blue-20)] text-[var(--color-blue-90)]">
            <Sparkle className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Pattern insight</p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{detail.patternInsight.summary}</p>
          </div>
        </div>
        {detail.patternInsight.actions && detail.patternInsight.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {detail.patternInsight.actions.map((action) => (
              <button
                key={action.id}
                className={`inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition ${
                  action.intent === 'primary'
                    ? 'bg-[var(--color-blue-90)] text-white hover:bg-[var(--color-blue-80)]'
                    : 'border border-[var(--color-blue-50)] bg-white text-[var(--color-blue-90)] hover:bg-[var(--color-blue-10)]'
                }`}
                type="button"
              >
                <Link2 className="h-4 w-4" />
                {action.label}
                {action.note && (
                  <span className="text-xs font-normal text-[var(--text-secondary)]">({action.note})</span>
                )}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function SimilarWinsActionButton({
  label,
  variant = 'secondary',
}: {
  label: string
  variant?: 'primary' | 'secondary'
}) {
  const baseClasses =
    'inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition focus:outline-none'
  if (variant === 'primary') {
    return (
      <button className={`${baseClasses} bg-[var(--color-blue-90)] text-white hover:bg-[var(--color-blue-80)]`} type="button">
        <Copy className="h-4 w-4" />
        {label}
      </button>
    )
  }

  return (
    <button
      className={`${baseClasses} border border-[var(--border-subtle)] bg-white text-[var(--text-primary)] hover:bg-[var(--background-hover)]`}
      type="button"
    >
      <Copy className="h-4 w-4" />
      {label}
    </button>
  )
}
