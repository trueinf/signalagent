import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, Sparkles } from 'lucide-react'
import { hardcodedLeads } from '@/lib/data/leads'

interface LeadCaseStudiesPageProps {
  params: Promise<{
    id: string
  }>
}

const formatEnumValue = (value: string | null | undefined) => {
  if (!value) return 'Not specified'
  return value
    .toLowerCase()
    .split('_')
    .map(token => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

export default async function LeadCaseStudiesPage({ params }: LeadCaseStudiesPageProps) {
  const { id } = await params
  const lead = hardcodedLeads.find(l => l.id === id)

  if (!lead) {
    notFound()
  }

  const firstName = lead.name.split(' ')[0] || lead.name
  const companyName = lead.company || 'this customer'
  const industryLabel = formatEnumValue(lead.industry)
  const buyerRoleLabel = formatEnumValue(lead.buyerRole)

  const heroIndustryDescriptor = industryLabel === 'Not specified' ? 'their industry' : `${industryLabel.toLowerCase()} focus`
  const heroBuyerDescriptor = buyerRoleLabel === 'Not specified' ? 'buying team' : buyerRoleLabel.toLowerCase()

  const caseStudies = buildCaseStudies({
    companyName,
    industryLabel,
    buyerRoleLabel,
    source: lead.source || 'Microsoft campaign',
  })

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <Link
              href={`/leads/${lead.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-20)] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to lead workspace
            </Link>
            <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--color-blue-20)]">
              <Sparkles className="h-4 w-4" />
              <span>Curated quick wins for {firstName}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-semibold">Case Studies Library</h1>
            <p className="text-[var(--color-blue-20)] text-lg max-w-3xl">
              Use these proof points to reinforce your conversation with {companyName}. Each summary highlights why the story matters based on their {heroIndustryDescriptor} and {heroBuyerDescriptor} priorities.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((study) => (
            <article
              key={study.id}
              className="rounded-2xl bg-white shadow-md border border-[var(--border-subtle)]/70 p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-blue-10)] text-[var(--color-blue-80)]">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">{study.title}</h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {study.industry} · {study.location}
                  </p>
                </div>
              </div>

              <p className="text-[var(--text-primary)] leading-relaxed">{study.summary}</p>

              <div className="rounded-xl bg-[var(--color-blue-10)] border border-[var(--color-blue-20)]/50 p-4 space-y-2">
                <div className="text-sm font-semibold text-[var(--text-primary)]">Why it matters here</div>
                <p className="text-sm text-[var(--text-secondary)]">{study.relevance}</p>
              </div>

              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                {study.highlights.map((highlight, idx) => (
                  <li key={`${study.id}-highlight-${idx}`} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--color-blue-80)]" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <div className="text-sm text-[var(--color-blue-80)] font-medium">
                {study.callToAction}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function buildCaseStudies({
  companyName,
  industryLabel,
  buyerRoleLabel,
  source,
}: {
  companyName: string
  industryLabel: string
  buyerRoleLabel: string
  source: string
}) {
  const industryDescriptor = industryLabel === 'Not specified' ? 'their industry' : industryLabel.toLowerCase()
  const buyerDescriptor = buyerRoleLabel === 'Not specified' ? 'leadership team' : buyerRoleLabel.toLowerCase()

  return [
    {
      id: 'case-1',
      title: 'Contoso Retail transforms store operations with Azure Copilot',
      industry: 'Retail',
      location: 'North America',
      summary:
        'Contoso unified merchandising and finance workflows across 240 stores, using Copilot to automate forecasting and cost planning within Dynamics 365.',
      relevance: `Great companion story for ${companyName}: similar ${industryDescriptor} organization accelerated time-to-insight by 28%.`,
      highlights: [
        'Automated cost benchmarking reduced quarterly planning cycles from four weeks to five days.',
        'Finance leadership praised the hybrid benefit pricing model used to justify investment.',
      ],
      callToAction: 'Share the cost benchmarking slide to reinforce ROI when financial stakeholders join the conversation.',
    },
    {
      id: 'case-2',
      title: 'Northwind Traders pilots Copilot with Lean Engineering',
      industry: 'Manufacturing',
      location: 'Europe',
      summary:
        'Northwind deployed Azure Copilot for supply chain planning with a five-person engineering crew, leveraging FastTrack to stay within resource limits.',
      relevance:
        'Use this when “limited engineering bandwidth” surfaces—the customer delivered production value in three weeks with Microsoft FastTrack support.',
      highlights: [
        'FastTrack-led deployment freed internal engineers to focus on critical integrations.',
        'Stakeholder alignment achieved via a 30-minute architecture review, matching the proposed next step for your call.',
      ],
      callToAction: 'Position FastTrack as the safety net so the team can adopt Copilot without adding headcount.',
    },
    {
      id: 'case-3',
      title: 'Fabrikam Finance secures executive sponsorship with ROI modeling',
      industry: 'Financial Services',
      location: 'Asia Pacific',
      summary:
        'Fabrikam’s CFO approved a Copilot rollout after validating hybrid benefit savings and productivity lift in the first 60 days.',
      relevance: `Ideal when the ${buyerDescriptor} presses on cost. Mirrors the ROI conversation sparked by the pricing export ${source.toLowerCase()} delivered.`,
      highlights: [
        'Hybrid benefit calculator identified a 32% cost reduction versus legacy tooling.',
        'CFO endorsement secured by mapping ROI to audit-readiness improvements.',
      ],
      callToAction: 'Walk finance leaders through the ROI calculator and share the executive one-pager attached in the asset pack.',
    },
    {
      id: 'case-4',
      title: 'Adventure Works scales customer agents with Copilot playbooks',
      industry: 'Customer Service',
      location: 'Latin America',
      summary:
        'Adventure Works used Copilot-guided workflows to boost first-call resolution by 19% across distributed contact centers.',
      relevance:
        'Highlights Copilot assisting frontline teams—useful if the conversation touches customer or support teams adjacent to your champion.',
      highlights: [
        'Playbook automation shortened onboarding timelines by 40%.',
        'Telemetry insights informed weekly stand-ups to refine messaging and objection handling.',
      ],
      callToAction: 'Share the operations dashboard screenshot to show how teams coach agents in near real time.',
    },
    {
      id: 'case-5',
      title: 'Tailwind Traders accelerates adoption via webinar-to-pilot motion',
      industry: 'Technology',
      location: 'Global',
      summary:
        'Tailwind converted webinar leads into active Copilot pilots by following a 14-day engagement sequence with targeted messaging.',
      relevance: `Perfect for this opportunity sourced from ${source}. Reinforces that webinar engagement can close rapidly with the right follow-up cadence.`,
      highlights: [
        'AI-personalised nurture sequence delivered 36% click-through on technical deep dives.',
        'Architecture review secured within five days of the first nurture interaction.',
      ],
      callToAction: 'Borrow the 14-day cadence to structure your outreach if scheduling slips or additional stakeholders surface.',
    },
  ]
}
