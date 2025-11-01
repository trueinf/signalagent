import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2, ClipboardList, MessageSquare, Sparkles, Target } from 'lucide-react'

import { getRenewalAccountById } from '@/lib/data/renewals'

interface EngageCallPageProps {
  params: {
    id: string
  }
}

export default function EngageCallPage({ params }: EngageCallPageProps) {
  const account = getRenewalAccountById(params.id)

  if (!account) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-5xl px-6 py-8 space-y-4">
          <Link
            href={`/renewals/${account.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-20)] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to renewal brief
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold">Renewal Call Companion</h1>
            <p className="text-[var(--color-blue-20)]">
              Signal-generated guidance for {account.company} &mdash; renewal in {account.daysToRenewal} days.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-blue-10)] px-3 py-1 text-sm font-medium text-[var(--color-blue-80)]">
            <Sparkles className="h-4 w-4" />
            Live run-of-show
          </div>
          <div className="grid gap-4 md:grid-cols-2 text-sm text-[var(--text-secondary)]">
            <CardBlock icon={<MessageSquare className="h-4 w-4 text-[var(--color-blue-80)]" />} title="Opening">
              {account.talkTrack.opening}
            </CardBlock>
            <CardBlock icon={<ClipboardList className="h-4 w-4 text-[var(--color-blue-80)]" />} title="Agenda">
              <ul className="list-disc list-inside space-y-1">
                {account.talkTrack.agenda.map((item, idx) => (
                  <li key={`${account.id}-agenda-${idx}`}>{item}</li>
                ))}
              </ul>
            </CardBlock>
            <CardBlock icon={<Target className="h-4 w-4 text-[var(--color-blue-80)]" />} title="Negotiation lever">
              {account.talkTrack.negotiation}
            </CardBlock>
            <CardBlock icon={<CheckCircle2 className="h-4 w-4 text-[var(--color-blue-80)]" />} title="Closing">
              {account.talkTrack.closing}
            </CardBlock>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Call notes template</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Drop notes in Signal Assist or paste them here to keep the summary tight.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {['Business outcomes', 'Stakeholders', 'Commercial terms', 'Follow-ups'].map((label) => (
              <div key={label} className="space-y-2">
                <div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
                <textarea
                  className="w-full min-h-[120px] rounded-xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
                  placeholder={`Capture ${label.toLowerCase()} discussed during the call...`}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Signal tips</h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-[var(--text-secondary)]">
            <li>Reference the adoption metrics: {account.usageTrend.summary}</li>
            <li>Surface the recommended action: {account.recommendedActions[0]}</li>
            <li>Prep objection rebuttal: {account.objectionHandling[0]?.title ?? 'Have pricing justification ready.'}</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

function CardBlock({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-[var(--color-blue-10)]/40 p-4 space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-[var(--text-primary)]">{title}</span>
      </div>
      <div className="text-sm text-[var(--text-secondary)]">{children}</div>
    </div>
  )
}
