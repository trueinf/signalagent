import { notFound } from 'next/navigation'
import { hardcodedLeads } from '@/lib/data/leads'
import EngageSession from '@/components/lead-detail/EngageSession'

const formatEnumValue = (value: string | null | undefined) => {
  if (!value) return 'Not specified'
  return value
    .toLowerCase()
    .split('_')
    .map(token => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

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

interface EngagePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EngagePage({ params }: EngagePageProps) {
  const { id } = await params
  const lead = hardcodedLeads.find(l => l.id === id)

  if (!lead) {
    notFound()
  }

  const intentScore = lead.intentScore ?? 0
  const priorityLabel = intentScore >= 85 ? 'High priority' : intentScore >= 70 ? 'Medium priority' : 'Low priority'
  const industryValue = formatEnumValue(lead.industry)
  const buyerRoleValue = formatEnumValue(lead.buyerRole)
  const aiInsight =
    lead.aiInsight ||
    `${lead.name.split(' ')[0] || lead.name} engaged with Azure Copilot content in the last day, signalling readiness to align on pilot scope.`
  const topSignal = lead.signalTrail ? JSON.parse(lead.signalTrail)[0] ?? 'Azure AI workload spiked in the trial environment' : 'Azure AI workload spiked in the trial environment'

  const companySize = inferCompanySize(lead.industry)
  const companySector = inferCompanySector(lead.industry)
  const primaryTouchpoint = lead.sourceType || 'Digital campaign'

  const firstName = lead.name.split(' ')[0] || lead.name
  const industryDescriptor = industryValue === 'Not specified' ? 'their industry' : `${industryValue.toLowerCase()} space`
  const roleDescriptor = buyerRoleValue === 'Not specified' ? 'buying team' : buyerRoleValue.toLowerCase()

  const talkTrack = {
    opening: `Hi ${firstName}, appreciate you taking the time. I wanted to align quickly on what prompted you to pull the Azure cost estimate after the ${primaryTouchpoint.toLowerCase()} touchpoint, and make sure we cover the scenario you’re evaluating.`,
    agenda: [
      'Confirm the model you explored and anything that stood out.',
      `Share how similar ${industryDescriptor} customers accelerated pilots and unlocked ROI.`,
      'Agree on next steps, stakeholders, and technical checkpoints for the trial.',
    ],
    discovery: [
      'What success metrics are you targeting for this Copilot pilot?',
      `Which parts of the ${roleDescriptor} will be involved in evaluation and approval?`,
      'What timeline are you working against for deployment or proof of value?',
    ],
    closing: `Based on where you are, I’d like to schedule a 30-minute architecture review with our Azure AI specialist next week. Does Tuesday or Wednesday afternoon work to explore that?`,
  }

  const objectionResponses = [
    {
      objection: '“Azure Copilot seems expensive for our team size.”',
      response: `Totally understand. When ${lead.company || 'Contoso Finance'} modelled the hybrid benefit scenario, they identified a 32% cost reduction versus legacy tooling in the first 60 days.`,
      proofPoint: 'Share the hybrid benefit calculator and the finance one-pager.',
    },
    {
      objection: '“We have limited engineering bandwidth for deployment.”',
      response: 'We partner with FastTrack so your engineers stay focused on core work. Northwind Traders had a five-person crew and still went live in under three weeks.',
      proofPoint: 'Position FastTrack as the deployment safety net.',
    },
  ]

  const emailTemplate = {
    subject: `Recap & next step on Azure Copilot for ${lead.company || 'your team'}`,
    preview: `${firstName}, following up with the architecture review invite and proof points we discussed.`,
    bodyPoints: [
      'Summarise the scenario they modelled and key success metrics shared.',
      `Attach the relevant ${industryDescriptor} case study to reinforce outcomes.`,
      'Offer two slots for the Azure architect review next week.',
    ],
    closing: 'Let me know which time works best or if someone else should join the session.',
  }

  const recommendedNextSteps = [
    'Confirm evaluation success criteria and any blockers before diving deeper.',
    'Position the Azure architect review as the natural next step to accelerate the pilot.',
    'Document commitments live—Signal will reuse them for follow-up assets.',
  ]

  const quickPrompts = {
    opening: [
      'Acknowledged their recent pricing export and aligned on desired outcomes.',
      'Revisited “why now” and set a clear agenda for today’s call.',
    ],
    discovery: [
      'Asked about KPIs driving approval (productivity, cost, compliance).',
      'Identified additional stakeholders and decision timeline.',
      'Captured current tooling or process they want to improve.',
    ],
    objections: [
      'Budget concern – referenced hybrid benefit savings.',
      'Bandwidth risk – proposed FastTrack deployment support.',
      'Security/compliance questions to loop in specialist.',
    ],
    commitments: [
      'Send architecture review invite with Azure specialist.',
      'Share ROI calculator and relevant case study.',
      'Follow up with summary email and attach requested materials.',
    ],
  }

  const outcomeOptions = ['Advanced – scheduled next step', 'Stalled – needs follow-up', 'Disqualified – poor fit', 'No response/voicemail']

  return (
    <main className="min-h-screen bg-[var(--background-secondary)] px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <EngageSession
          lead={{
            id: lead.id,
            name: lead.name,
            company: lead.company || 'Unknown company',
            intentScore,
            priorityLabel,
            industry: industryValue,
            buyerRole: buyerRoleValue,
            size: companySize,
            sector: companySector,
            source: primaryTouchpoint,
            topSignal,
            aiInsight,
          }}
          talkTrack={talkTrack}
          objectionResponses={objectionResponses}
          emailTemplate={emailTemplate}
          recommendedNextSteps={recommendedNextSteps}
          quickPrompts={quickPrompts}
          outcomeOptions={outcomeOptions}
        />
      </div>
    </main>
  )
}
