'use client'

import { Lead } from '@prisma/client'
import { BrainCircuit, Flame, Lightbulb, Zap } from 'lucide-react'
import { ArrowRight, ExternalLink } from 'lucide-react'

interface LeadCardProps {
  lead: Lead
  onEngage?: (leadId: string) => void
  onMoreDetails?: (leadId: string) => void
}

export default function LeadCard({ lead, onEngage, onMoreDetails }: LeadCardProps) {
  const intentScore = lead.intentScore ?? 0
  const priority = intentScore >= 85 ? 'high' : intentScore >= 70 ? 'medium' : 'low'
  
  const priorityColors = {
    high: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    low: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
  }

  const colors = priorityColors[priority]
  const signalTrail = lead.signalTrail ? JSON.parse(lead.signalTrail) : []

  const getSourceLabel = (sourceType: string | null) => {
    if (!sourceType) return lead.source || 'Unknown'
    const labels: Record<string, string> = {
      TRIAL: 'Azure Trial',
      WEBINAR: 'Copilot Webinar',
      CAMPAIGN_DOWNLOAD: 'Campaign Download',
      SQL: 'SQL (Field referral)',
      CAMPAIGN_EMAIL: 'Campaign Email',
    }
    return labels[sourceType] || sourceType
  }

  const signalFreshness = computeSignalFreshness(lead.updatedAt)
  const prepCompleteness = computePrepCompleteness(lead)
  const aiConfidence = intentScore >= 85 ? 'High confidence' : intentScore >= 70 ? 'Good confidence' : 'Emerging signals'

  const similarWins = buildSimilarWins(lead)

  return (
    <div
      className={`bg-white border-l-4 ${colors.border} rounded p-4 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
      onClick={() => onMoreDetails?.(lead.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {lead.company || 'Unknown Company'}
            </h3>
            <span className={`px-2 py-0.5 rounded text-base font-medium ${colors.bg} ${colors.text}`}>
              {priority.toUpperCase()}
            </span>
          </div>
          <p className="text-base text-[var(--text-secondary)]">
            {lead.name}
            {lead.contactTitle && ` – ${lead.contactTitle}`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-[var(--text-primary)]">{intentScore}</div>
          <div className="text-xs text-[var(--text-secondary)]">/ 100</div>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-base text-[var(--text-secondary)] mb-1">
          <span className="font-medium">Source:</span> {getSourceLabel(lead.sourceType)}
        </p>
        {signalTrail.length > 0 && (
          <div className="mt-2">
            <p className="text-base font-medium text-[var(--text-secondary)] mb-1">Signal Trail:</p>
            <ul className="list-disc list-inside text-base text-[var(--text-secondary)] space-y-1">
              {signalTrail.map((signal: string, idx: number) => (
                <li key={idx}>&ldquo;{signal}&rdquo;</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ReadinessScorecard
        signalFreshness={signalFreshness}
        aiConfidence={aiConfidence}
        prepCompleteness={prepCompleteness}
      />

      {similarWins.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {similarWins.map((win) => (
            <span
              key={win.id}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-blue-20)]/50 bg-[var(--color-blue-10)] px-3 py-1 text-xs font-medium text-[var(--color-blue-80)]"
            >
              <Flame className="h-3 w-3" />
              {win.label}
            </span>
          ))}
        </div>
      )}

      {lead.aiInsight && (
        <div className="mb-3 p-2 bg-[var(--color-blue-10)] rounded">
          <p className="text-base font-medium text-[var(--text-primary)] mb-1">AI Insight Summary:</p>
          <p className="text-base text-[var(--text-secondary)] italic">&ldquo;{lead.aiInsight}&rdquo;</p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEngage?.(lead.id)
          }}
          className="flex-1 px-3 py-2 bg-[var(--color-blue-90)] text-white text-base font-medium rounded hover:bg-[var(--color-blue-80)] transition-colors flex items-center justify-center gap-2"
        >
          Engage Lead
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onMoreDetails?.(lead.id)
          }}
          className="px-3 py-2 border border-[var(--border-subtle)] text-base font-medium rounded hover:bg-[var(--background-hover)] transition-colors flex items-center gap-2"
        >
          More Details
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
function ReadinessScorecard({
  signalFreshness,
  aiConfidence,
  prepCompleteness,
}: {
  signalFreshness: string
  aiConfidence: string
  prepCompleteness: string
}) {
  const items = [
    {
      icon: <Zap className="h-4 w-4 text-[var(--color-blue-80)]" />,
      label: 'Signal freshness',
      value: signalFreshness,
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
    <div className="rounded-xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-4 grid gap-3 md:grid-cols-3 mt-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="rounded-full bg-white shadow-sm border border-[var(--border-subtle)]/50 p-2 flex items-center justify-center">
            {item.icon}
          </span>
          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{item.label}</div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
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
  if ((lead.signalTrail ? JSON.parse(lead.signalTrail) : []).length > 0) score += 1
  if (lead.notes && lead.notes.trim().length > 0) score += 1

  if (score === totalFactors) return 'Ready to engage'
  if (score === 2) return 'Needs quick review'
  return 'Prep recommended'
}

function buildSimilarWins(lead: Lead) {
  const industry = lead.industry || undefined
  const sourceType = lead.sourceType || undefined

  const tags: { id: string; label: string }[] = []

  if (industry) {
    const industryLabel = industryMappings[industry] || industry
    tags.push({ id: `industry-${industry}`, label: `${industryLabel} win pattern` })
  }

  if (sourceType) {
    const sourceLabel = sourceMappings[sourceType] || sourceType
    tags.push({ id: `source-${sourceType}`, label: `${sourceLabel} conversions` })
  }

  if ((lead.signalTrail ? JSON.parse(lead.signalTrail) : []).some((signal: string) => /pricing|cost/i.test(signal))) {
    tags.push({ id: 'pricing', label: 'Pricing objections handled' })
  }

  if (lead.aiInsight && /architecture|pilot/i.test(lead.aiInsight)) {
    tags.push({ id: 'architecture', label: 'Architecture review converts' })
  }

  return tags.slice(0, 3)
}

const industryMappings: Record<string, string> = {
  RETAIL: 'Retail',
  HEALTHCARE: 'Healthcare',
  FINANCE: 'Finance',
  EDUCATION: 'Education',
  LOGISTICS: 'Logistics',
  OTHER: 'Diversified',
}

const sourceMappings: Record<string, string> = {
  TRIAL: 'Trial accounts',
  WEBINAR: 'Webinar follow-ups',
  CAMPAIGN_DOWNLOAD: 'Campaign downloads',
  SQL: 'SQL referrals',
  CAMPAIGN_EMAIL: 'Campaign nurtures',
}
