import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileText, Sparkles } from 'lucide-react'

import { getRenewalAccountById } from '@/lib/data/renewals'

interface EngageBriefPageProps {
  params: {
    id: string
  }
}

export default function EngageBriefPage({ params }: EngageBriefPageProps) {
  const account = getRenewalAccountById(params.id)

  if (!account) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-4xl px-6 py-8 space-y-4">
          <Link
            href={`/renewals/${account.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-20)] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to renewal brief
          </Link>
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-semibold">Executive Brief Generator</h1>
              <p className="text-[var(--color-blue-20)]">
                Tailor the account story before sending it to finance or C-suite sponsors.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-blue-10)] px-3 py-1 text-sm font-medium text-[var(--color-blue-80)]">
            <Sparkles className="h-4 w-4" />
            Summary headline
          </div>
          <textarea
            className="w-full min-h-[120px] rounded-xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
            defaultValue={`$${(account.arr / 1000).toFixed(0)}k renewal at risk due to ${account.usageTrend.summary.toLowerCase()}. Signal recommends ${account.recommendedActions[0].toLowerCase()}.`}
          />
        </section>

        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Key metrics</h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm text-[var(--text-secondary)]">
            {account.usageHighlights.map((item) => (
              <div key={`${account.id}-brief-${item.label}`} className="rounded-xl bg-[var(--color-blue-10)]/40 px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{item.label}</div>
                <div className="text-base font-semibold text-[var(--text-primary)]">{item.value}</div>
                <div className="text-xs text-[var(--text-secondary)]">{item.trend}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3 text-sm text-[var(--text-secondary)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Narrative structure</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <span className="font-semibold text-[var(--text-primary)]">Why now:</span> {account.execSummary}
            </li>
            <li>
              <span className="font-semibold text-[var(--text-primary)]">Signal insights:</span> {account.recommendedActions[0]} and
              {` ${account.recommendedActions[1] ?? ''}`.trim()}
            </li>
            <li>
              <span className="font-semibold text-[var(--text-primary)]">Call to action:</span> {account.talkTrack.closing}
            </li>
          </ol>
        </section>

        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Attach proof</h2>
          <div className="flex flex-wrap gap-2 text-xs text-[var(--color-blue-80)]">
            {account.caseStudies.map((item, idx) => (
              <span key={`${account.id}-brief-case-${idx}`} className="rounded-full bg-[var(--color-blue-10)] px-3 py-1 font-medium">
                {item.title}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
