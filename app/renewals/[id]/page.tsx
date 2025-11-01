import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays, GaugeCircle, Sparkles, TrendingDown } from 'lucide-react'

import RenewalWorkspace from '@/components/renewals/RenewalWorkspace'
import { getRenewalAccountById } from '@/lib/data/renewals'

interface RenewalDetailPageProps {
  params: {
    id: string
  }
}

export default function RenewalDetailPage({ params }: RenewalDetailPageProps) {
  const account = getRenewalAccountById(params.id)

  if (!account) {
    notFound()
  }

  const arrFormatted = formatCurrency(account.arr)

  const quickActions = [
    {
      id: 'engage-session',
      label: 'Launch renewal call companion',
      description: 'Open the guided workspace to run the executive save conversation.',
      href: `/renewals/${account.id}/engage/call`,
    },
    {
      id: 'send-brief',
      label: 'Send executive brief',
      description: 'Package the ROI summary and usage story for finance sponsors.',
      href: `/renewals/${account.id}/engage/brief`,
    },
    {
      id: 'update-quote',
      label: 'Update quote offer',
      description: 'Apply the recommended incentive and sync with Deal Desk.',
      href: `/renewals/${account.id}/engage/quote`,
    },
  ]

  const negotiationLevers = [account.talkTrack.negotiation, 'Document commitments in CRM before proposing concessions.']

  const outcomeOptions = [
    'Renewed – verbal commit',
    'Pending signature – follow-up scheduled',
    'At risk – executive escalation needed',
    'Stalled – pricing in review',
  ]

  const workspaceProps = {
    account: {
      id: account.id,
      company: account.company,
      arr: arrFormatted,
      renewalDate: account.renewalDate,
      daysToRenewal: account.daysToRenewal,
      owner: account.owner,
      riskLevel: account.riskLevel,
      healthScore: account.healthScore,
      execSummary: account.execSummary,
      primaryProduct: account.primaryProduct,
      region: account.region,
      lastTouchDays: account.lastTouchDays,
    },
    usage: {
      summary: account.usageTrend.summary,
      coverage: account.usageTrend.coverage,
      highlights: account.usageHighlights,
      signals: account.signals,
    },
    recommendedActions: account.recommendedActions,
    talkTrack: account.talkTrack,
    objectionHandling: account.objectionHandling,
    readiness: account.readiness,
    checklist: account.checklist,
    caseStudies: account.caseStudies,
    quickActions,
    negotiationLevers,
    outcomeOptions,
    postCallPrompt: `Capture what changed for ${account.company} during the latest renewal touchpoint. Include commitments, risks, and follow-up items so Signal can adjust prioritization.`,
  }

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/renewals"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-20)] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to renewals command
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[var(--color-blue-10)]">
              <Sparkles className="h-4 w-4" />
              Signal insights active
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="space-y-1">
                <h1 className="text-3xl font-semibold">{account.company}</h1>
                <p className="text-[var(--color-blue-20)] text-lg">
                  {account.primaryProduct} • {account.region}
                </p>
              </div>
              <p className="text-sm text-[var(--color-blue-20)] leading-relaxed max-w-2xl">
                {account.execSummary}
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 text-sm text-[var(--color-blue-10)] lg:items-end">
              <span className="rounded-full bg-white/15 px-3 py-1 font-medium text-white">
                {arrFormatted} ARR
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Renewal in {account.daysToRenewal} days • {account.renewalDate}
              </span>
              <span className="inline-flex items-center gap-2">
                <GaugeCircle className="h-4 w-4" />
                Health score {account.healthScore}/100 • Owner {account.owner}
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl bg-white/10 p-5 space-y-2 text-sm text-[var(--color-blue-20)]">
              <div className="flex items-center gap-2 text-white">
                <TrendingDown className="h-4 w-4" />
                Usage signal
              </div>
              <p>{account.usageTrend.summary}</p>
              <p className="text-xs text-[var(--color-blue-20)]">{account.usageTrend.coverage}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-5 space-y-3 text-sm text-[var(--color-blue-20)]">
              <div className="text-white">Top recommended actions</div>
              <ul className="space-y-2">
                {account.recommendedActions.slice(0, 2).map((action, idx) => (
                  <li key={`${account.id}-hero-action-${idx}`}>• {action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <RenewalWorkspace {...workspaceProps} />
      </div>
    </div>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount >= 1000000 ? 1 : 0,
  }).format(amount)
}
