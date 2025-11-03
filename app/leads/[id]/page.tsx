import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Clock3,
  Compass,
  Medal,
  Rocket,
  Sparkles,
} from 'lucide-react'
import { hardcodedLeads } from '@/lib/data/leads'
import { leadEnhancements, type WorkReadyStatus } from '@/lib/data/leadEnhancements'
import LeadWorkspace, { LeadWorkspaceProps } from '@/components/lead-detail/LeadWorkspace'

interface LeadDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const priorityStyles = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-200 text-gray-800',
}

const sourceLabels: Record<string, string> = {
  TRIAL: 'Azure Trial',
  WEBINAR: 'Signal Webinar',
  CAMPAIGN_DOWNLOAD: 'Campaign Download',
  SQL: 'SQL (Field referral)',
  CAMPAIGN_EMAIL: 'Campaign Email',
}

type CtaVariant = 'top-pick' | 'engage' | 'plan'

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

const formatEnumValue = (value: string | null | undefined) => {
  if (!value) return 'Not specified'
  return value
    .toLowerCase()
    .split('_')
    .map(token => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

const formatDateTime = (value: Date | null | undefined) => {
  if (!value) return 'Not synced yet'
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value)
}

type ActivityChannel = 'email' | 'web' | 'crm'

interface ActivityEntry {
  title: string
  description: string
  timestamp: Date
  channel: ActivityChannel
}

type RecommendationImpact = 'high' | 'medium' | 'low'

interface Recommendation {
  title: string
  summary: string
  nextStep: string
  impact: RecommendationImpact
}

const subtractMs = (date: Date, ms: number) => new Date(date.getTime() - ms)

const industrySizeMap: Record<string, string> = {
  RETAIL: '5,000+ employees (global retail footprint)',
  HEALTHCARE: '2,500 employees (multi-site network)',
  FINANCE: '1,800 employees (regional operations)',
  EDUCATION: '900 employees (district-wide)',
  LOGISTICS: '3,200 employees (hub-and-spoke model)',
  OTHER: '1,200 employees',
}

const industrySectorMap: Record<string, string> = {
  RETAIL: 'Consumer & Retail Operations',
  HEALTHCARE: 'Healthcare & Life Sciences',
  FINANCE: 'Financial Services',
  EDUCATION: 'Education & Public Sector',
  LOGISTICS: 'Supply Chain & Logistics',
  OTHER: 'Diversified Industries',
}

const inferCompanySize = (industry: string | null | undefined) => {
  if (!industry) return '1,500 employees (growing operation)'
  return industrySizeMap[industry] ?? '1,500 employees (growing operation)'
}

const inferCompanySector = (industry: string | null | undefined) => {
  if (!industry) return 'Technology & Innovation'
  return industrySectorMap[industry] ?? 'Technology & Innovation'
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params
  const lead = hardcodedLeads.find(l => l.id === id)

  if (!lead) {
    notFound()
  }

  const sortedLeads = [...hardcodedLeads].sort((a, b) => {
    const scoreA = a.intentScore ?? 0
    const scoreB = b.intentScore ?? 0
    if (scoreA !== scoreB) {
      return scoreB - scoreA
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
  const rankIndex = sortedLeads.findIndex(item => item.id === lead.id)
  const rank = rankIndex >= 0 ? rankIndex + 1 : null
  const enhancement = leadEnhancements[lead.id]

  const intentScore = lead.intentScore ?? 0
  const priority = intentScore >= 85 ? 'high' : intentScore >= 70 ? 'medium' : 'low'
  const priorityBadge = priorityStyles[priority as keyof typeof priorityStyles]
  const displayRank = rank ?? '?'
  const rankLabel = enhancement?.rankContext
    ? `Ranked #${displayRank} – ${enhancement.rankContext}`
    : `Ranked #${displayRank} Today`
  const workReadyStatus: WorkReadyStatus = enhancement?.workReadyStatus ?? 'review-first'
  const { label: workReadyLabel, Icon: WorkReadyIcon, classes: workReadyClasses } = getWorkReadyConfig(workReadyStatus)
  const workReadyReason = enhancement?.workReadyReason
  const signalTiming = enhancement?.signalTiming
  const similarWinsSummary = enhancement?.similarWins?.summary
  const ctaVariant: CtaVariant = rank === 1 ? 'top-pick' : priority === 'low' ? 'plan' : 'engage'
  const { label: ctaLabel, Icon: CtaIcon } = getCtaConfig(ctaVariant)
  const signalTrail: string[] = lead.signalTrail ? JSON.parse(lead.signalTrail) : []
  const lastSynced = formatDateTime(lead.lastSyncedAt)
  const firstName = lead.name.split(' ')[0] || lead.name
  const companyName = lead.company || 'this account'
  const primaryTouchpoint = sourceLabels[lead.sourceType ?? ''] || lead.sourceType || 'Digital campaign'
  const industryValue = formatEnumValue(lead.industry)
  const buyerRoleValue = formatEnumValue(lead.buyerRole)
  const industryDescriptor = industryValue === 'Not specified' ? 'their industry' : `${industryValue.toLowerCase()} space`
  const roleDescriptor = buyerRoleValue === 'Not specified' ? 'buying team' : buyerRoleValue.toLowerCase()
  const statusLabel = formatEnumValue(lead.status)
  const referenceTimestamp = lead.updatedAt ? new Date(lead.updatedAt) : new Date()
  const syncTimestamp = lead.lastSyncedAt ? new Date(lead.lastSyncedAt) : referenceTimestamp
  const topSignal = signalTrail[0] ?? 'Azure AI workload spiked in the trial environment'
  const syncReference = lastSynced === 'Not synced yet' ? 'the first CRM sync window' : `the next CRM sync (${lastSynced})`
  const companySize = inferCompanySize(lead.industry)
  const companySector = inferCompanySector(lead.industry)

  const activityEntries: ActivityEntry[] = [
    {
      title: `${firstName} exported an Azure cost estimate`,
      timestamp: subtractMs(referenceTimestamp, 2 * 60 * 60 * 1000),
      channel: 'web',
      description: `${firstName} downloaded the hybrid benefit worksheet after exploring pricing guidance from the ${primaryTouchpoint} touchpoint.`,
    },
    {
      title: 'Opened nurture email: "Activate Azure AI Signal"',
      timestamp: subtractMs(referenceTimestamp, 18 * 60 * 60 * 1000),
      channel: 'email',
      description: `${firstName} clicked through to the Signal customer story and reviewed the adoption steps for four minutes.`,
    },
    {
      title: 'Dynamics 365 note logged by field seller',
      timestamp: subtractMs(syncTimestamp, 3 * 24 * 60 * 60 * 1000),
      channel: 'crm',
      description: `${companyName} requested an architecture deep dive and shared evaluation criteria with the ${roleDescriptor}.`,
    },
  ]

  const recommendations: Recommendation[] = [
    {
      title: 'Book Azure architecture review',
      impact: 'high',
      summary: `${companyName} engaged with pricing guidance within the last day and surfaced the signal "${topSignal}".`,
      nextStep: `Send ${firstName} two 30-minute slots next week and invite the Azure AI specialist.`,
    },
    {
      title: industryValue === 'Not specified'
        ? 'Share industry-aligned customer evidence'
        : `Share ${industryValue} customer evidence`,
      impact: 'medium',
      summary: `Reinforce value with a story tailored to ${industryDescriptor} and address objections from the ${roleDescriptor}.`,
      nextStep: `Attach the most relevant case study and highlight outcomes comparable to ${companyName}.`,
    },
    {
      title: 'Lock the buying path in your call notes',
      impact: 'medium',
      summary: `Lead status is ${statusLabel}. Make sure you know who approves budget and timing before your next touch.`,
      nextStep: `Jot down budget guardrails, target launch window, and the decision-maker directly in this workspace before your next outreach.`,
    },
  ]

  const similarWins = [
    {
      customer: 'Fabrikam Retail',
      summary: 'Won in 21 days after AI-led cost modelling session.',
      proofPoint: 'Hybrid benefit scenario reduced projected spend by 32%.',
    },
    {
      customer: 'Northwind Traders',
      summary: 'Converted webinar attendee with role-aligned talk track.',
      proofPoint: 'CFO signed off after sharing Signal ROI benchmarks.',
    },
  ]

  const activityTimeline = activityEntries.map((activity, index) => ({
    id: `activity-${index}`,
    channel: activity.channel.toUpperCase(),
    timestamp: formatDateTime(activity.timestamp),
    title: activity.title,
    description: activity.description,
  }))

  const quickActions = [
    {
      id: 'engage',
      label: ctaLabel,
      tone: 'primary' as const,
      helperText: `Reference the pricing export from the ${primaryTouchpoint} touchpoint and confirm ${firstName}'s success criteria.`,
    },
    {
      id: 'assign',
      label: 'Assign Owner',
      tone: 'secondary' as const,
      helperText: `Route the opportunity to the specialist covering ${industryDescriptor} to stay aligned with the ${roleDescriptor}.`,
    },
    {
      id: 'schedule',
      label: 'Schedule Outreach',
      tone: 'secondary' as const,
      helperText: `Offer ${firstName} two 30-minute slots next week, aligning on outcomes ahead of the architecture review.`,
    },
  ]

  const talkTrack = {
    opening: `Hi ${firstName}, this is your Microsoft tele-sales partner. I saw you pulled the Azure cost estimate this morning after exploring ${primaryTouchpoint.toLowerCase()} resources, so I wanted to align quickly on what you’re evaluating.`,
    agenda: [
      'Confirm the scenario you modelled and any blockers the team surfaced.',
      `Share how similar ${industryDescriptor} customers accelerated pilots.`,
      'Agree on the next technical checkpoint and stakeholder lineup.',
    ],
    discovery: [
      'What prompted the cost analysis today versus earlier in the evaluation?',
      `How is the ${roleDescriptor} measuring success for this pilot?`,
      'Who else should weigh in before you green-light the Azure Signal rollout?',
    ],
    closing: `If we align on the success criteria, I can bring our Azure AI architect to a 30-minute design review next week. Does Tuesday or Wednesday afternoon work?`,
  }

  const emailTemplate = {
    subject: `Next step on Azure Signal evaluation for ${companyName}`,
    preview: `${firstName}, looping back with the architecture review slots we discussed.`,
    bodyPoints: [
      `Recapped the ${primaryTouchpoint.toLowerCase()} session and pricing export from earlier today.`,
      `Attached the ${industryDescriptor} case study highlighting the ROI the ${roleDescriptor} cares about.`,
      'Included two architecture review slots with our Azure AI specialist next week.',
    ],
    closing: `Let me know which time works or if someone else from the team should join the call.`,
  }

  const objectionResponses = [
    {
      objection: '“Azure Signal seems expensive for our team size.”',
      response: `Understood. When ${companyName} modelled the hybrid benefit scenario, the cost dropped by 32%, aligning with how Contoso Finance rolled out Signal to a leaner workforce.`,
      proofPoint: 'Sharing the cost benchmark sheet the CFO used to approve their pilot.',
    },
    {
      objection: '“We have limited engineering cycles for deployment.”',
      response: `We’d bring in the FastTrack crew so your engineers stay focused. Northwind Traders had the same concern and we got them live in under three weeks.`,
      proofPoint: 'Include the playbook outlining the step-by-step deployment path.',
    },
  ]

  const tasks = [
    {
      title: 'Send architecture review invite',
      due: 'Due tomorrow',
      owner: 'You',
    },
    {
      title: 'Prep ROI proof points for finance review',
      due: 'Due in 3 days',
      owner: 'Azure AI specialist',
    },
  ]

  const learningFeed = [
    {
      title: 'Signal Pricing ROI narrative resonated with CFOs',
      description: 'Teams closing in under 30 days led with the hybrid benefit worksheet and quantified savings in the first call.',
      tag: 'Playbook insight',
    },
    {
      title: 'Webinar leads convert faster after architecture demo',
      description: 'Win-rate jumped 18% when the Azure architect joined within 5 days of the first nurture response.',
      tag: 'Win pattern',
    },
  ]

  const postCall = {
    prompt: `Summarize key takeaways, blockers, and commitments from your conversation with ${firstName}. Signal will use this to tune prioritization and messaging.`,
    outcomeOptions: ['Advanced to technical review', 'Stalled – budget review', 'Disqualified – poor fit', 'No response'],
    tags: ['Pricing', 'Deployment', 'Security', 'Timeline', 'Success Criteria'],
  }

  const workspaceProps: LeadWorkspaceProps = {
    leadId: lead.id,
    firstName,
    companyName,
    overview: {
      contact: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
      },
      company: {
        name: lead.company || 'Unknown',
        industry: industryValue,
        buyerRole: buyerRoleValue,
        size: companySize,
        sector: companySector,
      },
      source: {
        primary: lead.source || 'Not specified',
        channel: primaryTouchpoint,
      },
      status: {
        label: statusLabel,
        createdAt: formatDateTime(lead.createdAt),
      },
      notes: lead.notes || '',
    },
    insight: {
      whyNow:
        lead.aiInsight ||
        `${firstName} engaged heavily with Azure Signal content in the last 24 hours, signalling a readiness to scope pilots.`,
      topSignal,
      signalTrail,
      similarWins,
    },
    activity: activityTimeline,
    recommendations,
    quickActions,
    talkTrack,
    emailTemplate,
    objectionResponses,
    tasks,
    postCall,
    learningFeed,
    heroMetrics: {
      statusLabel,
      sourceLabel: primaryTouchpoint,
      syncReference,
    },
    enhancement,
  }

  const { insight, heroMetrics } = workspaceProps

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/leads/prioritized"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-20)] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to prioritized leads
            </Link>
            <div className="text-sm text-[var(--color-blue-20)] flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Last synced: {lastSynced}</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-blue-10)]">
                <Sparkles className="h-3 w-3" />
                {rankLabel}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold">{lead.company || 'Unknown Company'}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityBadge}`}>
                  {priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <p className="text-lg text-[var(--color-blue-20)]">
                {lead.name}
                {lead.contactTitle ? ` — ${lead.contactTitle}` : ''}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-semibold ${workReadyClasses}`}>
                  <WorkReadyIcon className="h-4 w-4" />
                  {workReadyLabel}
                </span>
                <span className="text-[var(--color-blue-20)]">
                  Log updates before {heroMetrics.syncReference}.
                </span>
              </div>
              {workReadyReason && (
                <p className="text-sm text-[var(--color-blue-10)]">{workReadyReason}</p>
              )}
              {similarWinsSummary && (
                <p className="text-sm text-[var(--color-blue-10)]">{similarWinsSummary}</p>
              )}
              {signalTiming && (
                <div className="text-xs text-[var(--color-blue-20)] space-y-1">
                  <div>{signalTiming.event}</div>
                  {signalTiming.decayWarning && <div>{signalTiming.decayWarning}</div>}
                </div>
              )}
            </div>

            <div className="rounded-lg bg-white/10 p-6 space-y-5">
              <div className="flex items-baseline gap-3">
                <div className="text-sm uppercase tracking-wide text-[var(--color-blue-20)]">Intent score</div>
                <div className="text-4xl font-semibold">{intentScore}</div>
                <div className="text-sm text-[var(--color-blue-20)]">/ 100</div>
              </div>
              <Link
                href={`/leads/${lead.id}/engage`}
                className="inline-flex items-center justify-center gap-2 rounded bg-white px-4 py-3 text-sm font-semibold text-[var(--color-blue-90)] shadow-sm transition hover:bg-[var(--color-blue-20)]/30"
              >
                <CtaIcon className="h-4 w-4" />
                {ctaLabel}
              </Link>
              <div className="grid gap-2 text-sm text-[var(--color-blue-20)]">
                <div>
                  <span className="text-white font-semibold">Lead status:</span> {statusLabel}
                </div>
                <div>
                  <span className="text-white font-semibold">Source:</span> {primaryTouchpoint}
                </div>
                <div>
                  <span className="text-white font-semibold">Synced:</span> {lastSynced}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div className="bg-white/10 rounded-lg p-5 space-y-3">
              <div className="text-sm uppercase tracking-wide text-[var(--color-blue-20)]">AI briefing</div>
              <p className="text-base leading-relaxed text-white">
                {insight.whyNow}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-5 space-y-3">
              <div className="text-sm uppercase tracking-wide text-[var(--color-blue-20)]">Signal snapshot</div>
              <div className="space-y-2 text-sm text-[var(--color-blue-10)]">
                <div>
                  <span className="font-semibold text-white">Primary trigger:</span>{' '}
                  {insight.topSignal}
                </div>
                <div>
                  <span className="font-semibold text-white">Lead status:</span>{' '}
                  {heroMetrics.statusLabel}
                </div>
                <div>
                  <span className="font-semibold text-white">Source:</span>{' '}
                  {heroMetrics.sourceLabel}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <LeadWorkspace {...workspaceProps} />
      </div>
    </div>
  )
}
