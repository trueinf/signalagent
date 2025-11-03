'use client'

import { Lead } from '@prisma/client'
import {
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Compass,
  ExternalLink,
  Lightbulb,
  Link2,
  Medal,
  Radar,
  Rocket,
  ShieldAlert,
  Sparkle,
  Zap,
} from 'lucide-react'
import type { LeadEnhancement, SignalTiming, TagGroup, WorkReadyStatus } from '@/lib/data/leadEnhancements'

interface LeadCardProps {
  lead: Lead
  rank: number
  enhancement?: LeadEnhancement
  onEngage?: (leadId: string) => void
  onMoreDetails?: (leadId: string) => void
  onViewSimilarWins?: (leadId: string) => void
}

type CtaVariant = 'top-pick' | 'engage' | 'plan'

export default function LeadCard({
  lead,
  rank,
  enhancement,
  onEngage,
  onMoreDetails,
  onViewSimilarWins,
}: LeadCardProps) {
  const intentScore = lead.intentScore ?? 0
  const priority = intentScore >= 85 ? 'high' : intentScore >= 70 ? 'medium' : 'low'

  const priorityColors = {
    high: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    low: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  }

  const colors = priorityColors[priority as keyof typeof priorityColors]

  const signalTrail = parseSignalTrail(lead.signalTrail)
  const scoreDrivers = enhancement?.scoreDrivers ?? []
  const signalFreshness = computeSignalFreshness(lead.updatedAt)
  const signalTiming = enhancement?.signalTiming
  const prepCompleteness = computePrepCompleteness(lead)
  const aiConfidence = intentScore >= 85 ? 'High confidence' : intentScore >= 70 ? 'Good confidence' : 'Emerging signals'
  const tagGroups = enhancement?.tagGroups ?? []
  const similarWins = enhancement?.similarWins

  const rankLabel = enhancement?.rankContext
    ? `Ranked #${rank} - ${enhancement.rankContext}`
    : `Ranked #${rank} Today`

  const workReadyStatus = enhancement?.workReadyStatus ?? 'review-first'
  const workReadyConfig = getWorkReadyConfig(workReadyStatus)
  const { label: workReadyLabel, classes: workReadyClasses, Icon: WorkReadyIcon } = workReadyConfig
  const workReadyReason = enhancement?.workReadyReason

  const ctaVariant: CtaVariant = rank === 1 ? 'top-pick' : priority === 'low' ? 'plan' : 'engage'
  const { label: ctaLabel, Icon: CtaIcon } = getCtaConfig(ctaVariant)

  return (
    <div
      className={`group bg-white border-l-4 ${colors.border} rounded-xl p-5 mb-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer`}
      onClick={() => onMoreDetails?.(lead.id)}
    >
      <div className="flex flex-col gap-5">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center rounded-full bg-[var(--color-blue-10)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-blue-80)]">
                {rankLabel}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {lead.company || 'Unknown Company'}
                </h3>
                <span className={`px-2 py-0.5 rounded text-sm font-medium ${colors.bg} ${colors.text}`}>
                  {priority.toUpperCase()}
                </span>
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-sm font-medium ${workReadyClasses}`}>
                <WorkReadyIcon className="h-4 w-4" />
                {workReadyLabel}
              </span>
              <p className="text-base text-[var(--text-secondary)]">
                {lead.name}
                {lead.contactTitle && ` – ${lead.contactTitle}`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[var(--text-primary)]">{intentScore}</div>
              <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">Intent Score</div>
            </div>
          </div>
          {workReadyReason && (
            <p className="text-sm text-[var(--text-secondary)]">{workReadyReason}</p>
          )}
        </header>

        {scoreDrivers.length > 0 && (
          <section className="rounded-xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-4">
            <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)] font-semibold">
              Score Breakdown
            </div>
            <div className="mt-3 space-y-2">
              {scoreDrivers.map((driver, idx) => (
                <div key={`${driver.label}-${idx}`} className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <div className="text-sm font-medium text-[var(--text-primary)]">{driver.label}</div>
                  <div className={`text-sm font-semibold ${driver.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatDriverDelta(driver.delta)}
                  </div>
                  {driver.context && (
                    <div className="text-xs text-[var(--text-secondary)] md:ml-auto">{driver.context}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-3 text-base text-[var(--text-secondary)]">
          <p>
            <span className="font-medium">Source:</span> {getSourceLabel(lead.sourceType, lead.source)}
          </p>
          {signalTrail.length > 0 && (
            <div>
              <p className="text-base font-medium text-[var(--text-secondary)] mb-1">Signal Trail:</p>
              <ul className="list-disc list-inside space-y-1">
                {signalTrail.map((signal, idx) => (
                  <li key={idx}>&ldquo;{signal}&rdquo;</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <ReadinessScorecard
          signalFreshness={signalFreshness}
          signalTiming={signalTiming}
          aiConfidence={aiConfidence}
          prepCompleteness={prepCompleteness}
        />

        {lead.aiInsight && (
          <section className="rounded-xl bg-[var(--color-blue-10)] p-4">
            <p className="text-base font-medium text-[var(--text-primary)] mb-1">AI Insight Summary</p>
            <p className="text-base text-[var(--text-secondary)] italic">&ldquo;{lead.aiInsight}&rdquo;</p>
          </section>
        )}

        {tagGroups.length > 0 && (
          <section className="grid gap-3 md:grid-cols-2">
            {tagGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-xl border border-[var(--border-subtle)] bg-white p-3 shadow-sm"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-blue-10)] text-[var(--color-blue-80)]">
                    {renderTagIcon(group.icon)}
                  </span>
                  {group.label}
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-[var(--text-secondary)]">
                  {group.items.map((item, idx) => (
                    <li key={`${group.id}-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {similarWins && (
          <section className="rounded-xl border border-[var(--color-blue-20)] bg-[var(--color-blue-10)]/60 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                  <Sparkle className="h-4 w-4 text-[var(--color-blue-80)]" />
                  Similar Wins
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{similarWins.summary}</p>
              </div>
              {similarWins.detail && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewSimilarWins?.(lead.id)
                  }}
                  className="inline-flex items-center gap-2 rounded border border-[var(--color-blue-40)] px-3 py-2 text-sm font-medium text-[var(--color-blue-90)] transition-colors hover:bg-[var(--color-blue-10)]"
                >
                  View Similar Wins
                  <Link2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>
        )}

        <footer className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEngage?.(lead.id)
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded bg-[var(--color-blue-90)] px-3 py-2 text-base font-medium text-white transition-colors hover:bg-[var(--color-blue-80)]"
          >
            <CtaIcon className="h-4 w-4" />
            {ctaLabel}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMoreDetails?.(lead.id)
            }}
            className="inline-flex items-center gap-2 rounded border border-[var(--border-subtle)] px-3 py-2 text-base font-medium transition-colors hover:bg-[var(--background-hover)]"
          >
            More Details
            <ExternalLink className="h-4 w-4" />
          </button>
        </footer>
      </div>
    </div>
  )
}

function ReadinessScorecard({
  signalFreshness,
  signalTiming,
  aiConfidence,
  prepCompleteness,
}: {
  signalFreshness: string
  signalTiming?: SignalTiming
  aiConfidence: string
  prepCompleteness: string
}) {
  const items = [
    {
      icon: <Zap className="h-4 w-4 text-[var(--color-blue-80)]" />,
      label: 'Signal freshness',
      value: signalFreshness,
      meta: signalTiming
        ? [signalTiming.event, signalTiming.decayWarning].filter(Boolean)
        : undefined,
    },
    {
      icon: <BrainCircuit className="h-4 w-4 text-[var(--color-blue-80)]" />,
      label: 'AI confidence',
      value: aiConfidence,
    },
    {
      icon: <Lightbulb className="h-4 w-4 text-[var(--color-blue-80)]" />,
      label: 'Prep completeness',
      value: prepCompleteness,
    },
  ]

  return (
    <div className="mt-2 grid gap-3 rounded-xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border-subtle)]/50 bg-white shadow-sm">
            {item.icon}
          </span>
          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{item.label}</div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</div>
            {item.meta?.map((meta, idx) => (
              <div key={`${item.label}-meta-${idx}`} className="text-xs text-[var(--text-secondary)]">
                {meta}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatDriverDelta(delta: number) {
  if (delta === 0) return '0'
  return delta > 0 ? `+${delta}` : `${delta}`
}

function parseSignalTrail(signalTrail: string | null | undefined) {
  if (!signalTrail) return []
  try {
    const parsed = JSON.parse(signalTrail)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function computeSignalFreshness(updatedAt: Date | string | null) {
  if (!updatedAt) return 'Unknown'
  const updated = new Date(updatedAt).getTime()
  const now = Date.now()
  const diffHours = Math.round((now - updated) / (1000 * 60 * 60))
  if (diffHours < 2) return 'Signals <2h old'
  if (diffHours < 24) return `Updated ${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `Signals ${diffDays}d old`
}

function computePrepCompleteness(lead: Lead) {
  const totalFactors = 3
  let score = 0
  if (lead.aiInsight) score += 1
  if (parseSignalTrail(lead.signalTrail).length > 0) score += 1
  if (lead.notes && lead.notes.trim().length > 0) score += 1

  if (score === totalFactors) return 'Ready to engage'
  if (score === 2) return 'Needs quick review'
  return 'Prep recommended'
}

function getSourceLabel(sourceType: string | null | undefined, fallbackSource?: string | null) {
  if (!sourceType) return fallbackSource || 'Unknown'
  const labels: Record<string, string> = {
    TRIAL: 'Azure Trial',
    WEBINAR: 'Signal Webinar',
    CAMPAIGN_DOWNLOAD: 'Campaign Download',
    SQL: 'SQL (Field referral)',
    CAMPAIGN_EMAIL: 'Campaign Email',
  }
  return labels[sourceType] || sourceType
}

function getWorkReadyConfig(status: WorkReadyStatus) {
  if (status === 'work-ready') {
    return {
      label: 'Work-Ready',
      Icon: CheckCircle2,
      classes: 'border-green-200 bg-green-50 text-green-700',
    }
  }

  return {
    label: 'Review First',
    Icon: Clock3,
    classes: 'border-amber-200 bg-amber-50 text-amber-700',
  }
}

function getCtaConfig(variant: CtaVariant) {
  switch (variant) {
    case 'top-pick':
      return { label: 'Top Pick: Start Now', Icon: Medal }
    case 'plan':
      return { label: 'Plan Outreach', Icon: Compass }
    default:
      return { label: 'Engage Lead', Icon: Rocket }
  }
}

function renderTagIcon(icon: TagGroup['icon']) {
  const classes = 'h-4 w-4'
  switch (icon) {
    case 'behavior':
      return <BrainCircuit className={classes} />
    case 'signal':
      return <Radar className={classes} />
    case 'objection':
      return <ShieldAlert className={classes} />
    case 'pattern':
    default:
      return <Sparkle className={classes} />
  }
}
