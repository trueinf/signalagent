import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import LeadWorkspace, { LeadWorkspaceProps } from '@/components/lead-detail/LeadWorkspace'

interface LeadDetailPageProps {
  params: {
    id: string
  }
}

const priorityStyles = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-200 text-gray-800',
}

const sourceLabels: Record<string, string> = {
  TRIAL: 'Azure Trial',
  WEBINAR: 'Copilot Webinar',
  CAMPAIGN_DOWNLOAD: 'Campaign Download',
  SQL: 'SQL (Field referral)',
  CAMPAIGN_EMAIL: 'Campaign Email',
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
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
  })

  if (!lead) {
    notFound()
  }

  const intentScore = lead.intentScore ?? 0
  const priority = intentScore >= 85 ? 'high' : intentScore >= 70 ? 'medium' : 'low'
  const priorityBadge = priorityStyles[priority as keyof typeof priorityStyles]
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
      title: 'Opened nurture email: "Activate Azure AI Copilot"',
      timestamp: subtractMs(referenceTimestamp, 18 * 60 * 60 * 1000),
      channel: 'email',
      description: `${firstName} clicked through to the Copilot customer story and reviewed the adoption steps for four minutes.`,
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
      title: 'Capture decision timeline in Dynamics 365',
      impact: 'medium',
      summary: `Lead status is ${statusLabel}. Document milestones so hand-offs remain tight across marketing, inside sales, and the field team.`,
      nextStep: `Log budget guardrails, target launch dates, and stakeholders before ${syncReference}.`,
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
      proofPoint: 'CFO signed off after sharing Copilot ROI benchmarks.',
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
      label: 'Engage Lead',
      tone: 'primary',
      helperText: `Reference the pricing export from the ${primaryTouchpoint} touchpoint and confirm ${firstName}'s success criteria.`,
    },
    {
      id: 'assign',
      label: 'Assign Owner',
      tone: 'secondary',
      helperText: `Route the opportunity to the specialist covering ${industryDescriptor} to stay aligned with the ${roleDescriptor}.`,
    },
    {
      id: 'schedule',
      label: 'Schedule Outreach',
      tone: 'secondary',
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
      'Who else should weigh in before you green-light the Azure Copilot rollout?',
    ],
    closing: `If we align on the success criteria, I can bring our Azure AI architect to a 30-minute design review next week. Does Tuesday or Wednesday afternoon work?`,
  }

  const emailTemplate = {
    subject: `Next step on Azure Copilot evaluation for ${companyName}`,
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
      objection: '“Azure Copilot seems expensive for our team size.”',
      response: `Understood. When ${companyName} modelled the hybrid benefit scenario, the cost dropped by 32%, aligning with how Contoso Finance rolled out Copilot to a leaner workforce.`,
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
      title: 'Copilot Pricing ROI narrative resonated with CFOs',
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
    prompt: `Summarize key takeaways, blockers, and commitments from your conversation with ${firstName}. Copilot will use this to tune prioritization and messaging.`,
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
        `${firstName} engaged heavily with Azure Copilot content in the last 24 hours, signalling a readiness to scope pilots.`,
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

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityBadge}`}>
                  {priority.toUpperCase()} PRIORITY
                </span>
                <span className="text-sm text-[var(--color-blue-20)]">
                  Intent score calculated from AI signal trail insights
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold">{lead.company || 'Unknown Company'}</h1>
                <p className="text-lg text-[var(--color-blue-20)]">
                  {lead.name}
                  {lead.contactTitle ? ` — ${lead.contactTitle}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 rounded-lg px-6 py-4">
              <div className="text-sm uppercase tracking-wide text-[var(--color-blue-20)]">Intent Score</div>
              <div className="text-4xl font-semibold">{intentScore}</div>
              <div className="text-sm text-[var(--color-blue-20)]">/ 100</div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div className="bg-white/10 rounded-lg p-5 space-y-3">
              <div className="text-sm uppercase tracking-wide text-[var(--color-blue-20)]">Why now</div>
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
