'use client'

import Link from 'next/link'
import { useMemo, useState, type ReactNode } from 'react'
import {
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Mail,
  MessageSquare,
  Sparkles,
  Target,
} from 'lucide-react'

type RecommendationImpact = 'high' | 'medium' | 'low'
type QuickActionTone = 'primary' | 'secondary'

interface SimilarWin {
  customer: string
  summary: string
  proofPoint: string
}

interface ActivityItem {
  id: string
  channel: string
  timestamp: string
  title: string
  description: string
}

interface RecommendationItem {
  title: string
  summary: string
  nextStep: string
  impact: RecommendationImpact
}

interface QuickAction {
  id: string
  label: string
  helperText: string
  tone: QuickActionTone
}

interface TalkTrack {
  opening: string
  agenda: string[]
  discovery: string[]
  closing: string
}

interface EmailTemplate {
  subject: string
  preview: string
  bodyPoints: string[]
  closing: string
}

interface ObjectionResponse {
  objection: string
  response: string
  proofPoint: string
}

interface TaskItem {
  title: string
  due: string
  owner: string
}

interface PostCallConfig {
  prompt: string
  outcomeOptions: string[]
  tags: string[]
}

interface LearningFeedItem {
  title: string
  description: string
  tag: string
}

export interface LeadWorkspaceProps {
  leadId: string
  firstName: string
  companyName: string
  overview: {
    contact: {
      name: string
      email?: string | null
      phone?: string | null
    }
    company: {
      name: string
      industry: string
      buyerRole: string
      size: string
      sector: string
    }
    source: {
      primary: string
      channel: string
    }
    status: {
      label: string
      createdAt: string
    }
    notes?: string
  }
  insight: {
    whyNow: string
    topSignal: string
    signalTrail: string[]
    similarWins: SimilarWin[]
  }
  activity: ActivityItem[]
  recommendations: RecommendationItem[]
  quickActions: QuickAction[]
  talkTrack: TalkTrack
  emailTemplate: EmailTemplate
  objectionResponses: ObjectionResponse[]
  tasks: TaskItem[]
  postCall: PostCallConfig
  learningFeed: LearningFeedItem[]
  heroMetrics: {
    statusLabel: string
    sourceLabel: string
    syncReference: string
  }
}

const tabs = ['Details', 'Engage', 'Learn'] as const

const impactStyles: Record<RecommendationImpact, string> = {
  high: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-gray-200 text-gray-700',
}

const impactLabels: Record<RecommendationImpact, string> = {
  high: 'High Impact',
  medium: 'Medium Impact',
  low: 'Lower Impact',
}

export default function LeadWorkspace(props: LeadWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Details')

  const summaryPlaceholder = useMemo(
    () =>
      `Example: Confirmed ${props.firstName} will involve the ${props.overview.company.buyerRole.toLowerCase()} and CFO in next week’s architecture review. Agreed to evaluate Copilot ROI model before ${props.heroMetrics.syncReference}.`,
    [props.firstName, props.heroMetrics.syncReference, props.overview.company.buyerRole]
  )

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white via-white to-[var(--color-blue-10)]">
      <div className="border-b border-[var(--border-subtle)]/60 flex flex-wrap bg-white/80 backdrop-blur">
        {tabs.map((tab) => {
          const isActive = tab === activeTab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-base font-medium focus:outline-none transition-colors ${
                isActive
                  ? 'text-[var(--color-blue-90)] border-b-2 border-[var(--color-blue-90)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--color-blue-90)]'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      <div className="p-6 lg:p-8 space-y-10">
        {activeTab === 'Details' && <DetailsTab {...props} />}
        {activeTab === 'Engage' && <EngageTab {...props} />}
        {activeTab === 'Learn' && <LearnTab {...props} summaryPlaceholder={summaryPlaceholder} />}
      </div>
    </div>
  )
}

function Section({
  title,
  description,
  actions,
  children,
}: {
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 text-sm text-[var(--color-blue-70)] md:pl-4">
            {actions}
          </div>
        )}
      </div>
      <div className="bg-white/90 border border-[var(--border-subtle)] rounded-2xl shadow-sm p-6 space-y-5">
        {children}
      </div>
    </section>
  )
}

function DetailsTab(props: LeadWorkspaceProps) {
  const { overview, insight, activity, recommendations } = props

  return (
    <div className="space-y-10">
      <Section title="Lead Overview" description="Key context pulled from Dynamics 365 and Copilot signals.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[var(--text-secondary)]">
          <InfoBlock
            title="Contact"
            lines={[
              overview.contact.name,
              overview.contact.email ? (
                <a key="email" href={`mailto:${overview.contact.email}`} className="text-[var(--color-blue-70)] hover:underline">
                  {overview.contact.email}
                </a>
              ) : null,
              overview.contact.phone,
            ]}
          />
          <InfoBlock
            title="Company"
            lines={[
              overview.company.name,
              `${overview.company.industry} · ${overview.company.buyerRole}`,
            ]}
          />
          <InfoBlock
            title="Company Size"
            lines={[overview.company.size]}
          />
          <InfoBlock
            title="Company Sector"
            lines={[overview.company.sector]}
          />
          <InfoBlock
            title="Source & Channel"
            lines={[
              overview.source.primary,
              `Latest trigger: ${overview.source.channel}`,
            ]}
          />
          <InfoBlock
            title="Status"
            lines={[
              overview.status.label,
              `Created ${overview.status.createdAt}`,
            ]}
          />
        </div>
        {overview.notes && overview.notes.trim().length > 0 && (
          <div className="p-4 rounded-xl bg-[var(--color-blue-10)] border border-[var(--color-blue-20)]/60">
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              Internal Notes
            </div>
            <p className="text-[var(--text-secondary)] whitespace-pre-line">{overview.notes}</p>
          </div>
        )}
      </Section>

      <Section
        title="Signals"
        description="Intent drivers and contextual cues powering SiGNAL’s prioritisation."
      >
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-xl bg-gradient-to-br from-[var(--color-blue-10)] to-white shadow-inner p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--text-secondary)]">
              <Sparkles className="h-4 w-4" />
              Copilot Insight
            </div>
            <p className="text-base text-[var(--text-primary)] leading-relaxed">
              {insight.whyNow}
            </p>
          </div>
          <div className="rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 p-6 space-y-3">
            <div className="text-sm uppercase tracking-wide text-[var(--text-secondary)]">
              Primary Signal
            </div>
            <p className="text-sm text-[var(--text-primary)]">{insight.topSignal}</p>
            <div className="text-xs text-[var(--text-secondary)]">
              Additional signals feed adaptive prioritisation and playbook tuning.
            </div>
          </div>
        </div>
        {insight.signalTrail.length > 0 && (
          <div className="rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 p-6">
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Signal trail
            </div>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              {insight.signalTrail.map((signal, idx) => (
                <li key={`${signal}-${idx}`}>&ldquo;{signal}&rdquo;</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section title="Recommendations" description="Next best actions aligned to recent behaviour.">
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.title}
              className="border border-[var(--border-subtle)] rounded-xl p-5 space-y-3 bg-white shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {recommendation.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold uppercase tracking-wide rounded ${impactStyles[recommendation.impact]}`}
                >
                  {impactLabels[recommendation.impact]}
                </span>
              </div>
              <p className="text-[var(--text-secondary)]">
                {recommendation.summary}
              </p>
              <p className="text-sm text-[var(--text-primary)]">
                Next step:{' '}
                <span className="text-[var(--text-secondary)]">
                  {recommendation.nextStep}
                </span>
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Activity Timeline" description="Recent engagement captured across channels.">
        <ul className="space-y-6">
          {activity.map((item, index) => (
            <li key={item.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="mt-1 h-3 w-3 rounded-full bg-[var(--color-blue-90)]"></span>
                {index !== activity.length - 1 && (
                  <span className="w-px flex-1 bg-[var(--border-subtle)]"></span>
                )}
              </div>
              <div className="flex-1 pt-0.5">
                <div className="rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 p-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <span className="uppercase tracking-wide font-semibold">
                      {item.channel}
                    </span>
                    <span>•</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Similar Wins" description="Playbooks sourced from recent Microsoft wins.">
        <div className="grid gap-4 md:grid-cols-2">
          {insight.similarWins.map((win, idx) => (
            <div key={`${win.customer}-${idx}`} className="border border-[var(--border-subtle)] rounded-xl p-5 space-y-2 bg-white shadow-sm">
              <div className="text-sm uppercase tracking-wide text-[var(--text-secondary)]">
                {win.customer}
              </div>
              <p className="text-[var(--text-primary)]">{win.summary}</p>
              <p className="text-sm text-[var(--text-secondary)]">{win.proofPoint}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function EngageTab(props: LeadWorkspaceProps) {
  const { leadId, quickActions, talkTrack, emailTemplate, objectionResponses, tasks } = props

  return (
    <div className="space-y-10">
      <Section title="Quick Actions" description="Trigger the next execution step without leaving SiGNAL.">
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <div key={action.id} className="rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 p-5 space-y-3">
              {action.id === 'engage' ? (
                <Link
                  href={`/leads/${props.leadId}/engage`}
                  className={`w-full px-4 py-3 text-base font-medium rounded transition-colors flex items-center justify-center gap-2 ${
                    action.tone === 'primary'
                      ? 'bg-[var(--color-blue-90)] text-white hover:bg-[var(--color-blue-80)]'
                      : 'bg-[var(--color-blue-10)] text-[var(--color-blue-80)] hover:bg-[var(--color-blue-20)]/60'
                  }`}
                >
                  {action.label}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  className={`w-full px-4 py-3 text-base font-medium rounded transition-colors flex items-center justify-center gap-2 ${
                    action.tone === 'primary'
                      ? 'bg-[var(--color-blue-90)] text-white hover:bg-[var(--color-blue-80)]'
                      : 'bg-[var(--color-blue-10)] text-[var(--color-blue-80)] hover:bg-[var(--color-blue-20)]/60'
                  }`}
                >
                  {action.label}
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
              <p className="text-sm text-[var(--text-secondary)]">{action.helperText}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Talk Track" description="Signal-generated structure tailored to this lead and role.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-gradient-to-br from-[var(--color-blue-10)] to-white border border-[var(--color-blue-20)]/50 p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--text-secondary)]">
              <MessageSquare className="h-4 w-4" />
              Opening
            </div>
            <p className="text-[var(--text-primary)] leading-relaxed">{talkTrack.opening}</p>
          </div>
          <div className="rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--text-secondary)]">
              <ClipboardList className="h-4 w-4" />
              Agenda
            </div>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              {talkTrack.agenda.map((item, idx) => (
                <li key={`agenda-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--text-secondary)]">
              <Target className="h-4 w-4" />
              Discovery Questions
            </div>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
              {talkTrack.discovery.map((item, idx) => (
                <li key={`discovery-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-white to-[var(--color-blue-10)] border border-[var(--color-blue-20)]/50 p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-[var(--text-secondary)]">
              <CheckCircle2 className="h-4 w-4" />
              Closing
            </div>
            <p className="text-[var(--text-primary)] leading-relaxed">{talkTrack.closing}</p>
          </div>
        </div>
      </Section>

      <Section title="Follow-up Email" description="Drop-in-ready template aligned to the conversation.">
        <div className="rounded-xl bg-gradient-to-br from-[var(--color-blue-10)] via-white to-white border border-[var(--color-blue-20)]/40 p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Mail className="h-4 w-4" />
            <span className="font-semibold text-[var(--text-primary)]">Subject:</span>
            <span>{emailTemplate.subject}</span>
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            {emailTemplate.preview}
          </div>
          <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
            {emailTemplate.bodyPoints.map((point, idx) => (
              <li key={`email-${idx}`}>{point}</li>
            ))}
          </ul>
          <div className="text-sm text-[var(--text-primary)]">
            Closing:{' '}
            <span className="text-[var(--text-secondary)]">
              {emailTemplate.closing}
            </span>
          </div>
        </div>
      </Section>

      <Section
        title="Objection Handling"
        description="Responses sourced from wins with similar personas."
        actions={
          <Link
            href={`/leads/${leadId}/case-studies`}
            className="inline-flex items-center gap-1 font-semibold text-[var(--color-blue-80)] hover:text-[var(--color-blue-90)] hover:underline"
          >
            View case studies
          </Link>
        }
      >
        <div className="space-y-4">
          {objectionResponses.map((item, idx) => (
            <div key={`objection-${idx}`} className="rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 p-5 space-y-3">
              <div className="text-sm uppercase tracking-wide text-[var(--text-secondary)]">
                {item.objection}
              </div>
              <p className="text-[var(--text-primary)]">{item.response}</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Proof point: {item.proofPoint}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Action Checklist" description="Keep work aligned ahead of the next sync.">
        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div key={`task-${idx}`} className="rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 p-4 flex items-center justify-between">
              <div>
                <div className="text-base font-semibold text-[var(--text-primary)]">{task.title}</div>
                <div className="text-sm text-[var(--text-secondary)]">
                  {task.due} • Owner: {task.owner}
                </div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-[var(--color-blue-90)]" />
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function LearnTab(props: LeadWorkspaceProps & { summaryPlaceholder: string }) {
  const { postCall, learningFeed, insight, summaryPlaceholder } = props

  return (
    <div className="space-y-10">
      <Section title="Post-call Summary" description={postCall.prompt}>
        <div className="space-y-3">
          <textarea
            className="w-full min-h-[160px] border border-[var(--border-subtle)]/70 rounded-xl p-4 text-base text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)] bg-white shadow-sm"
            placeholder={summaryPlaceholder}
          />
          <div className="flex flex-wrap gap-2">
            {postCall.outcomeOptions.map((option) => (
              <button
                key={option}
                type="button"
                className="px-3 py-2 rounded-full text-sm text-[var(--color-blue-80)] bg-[var(--color-blue-10)] hover:bg-[var(--color-blue-20)]/60 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-2">
              Tag the interaction
            </div>
            <div className="flex flex-wrap gap-2">
              {postCall.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 text-sm rounded-full bg-white text-[var(--color-blue-80)] border border-[var(--color-blue-20)]/60 shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="Learning Feed" description="Copilot amplifies the patterns that move conversion rates.">
        <div className="grid gap-4 md:grid-cols-2">
          {learningFeed.map((item, idx) => (
            <div key={`learning-${idx}`} className="rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 p-5 space-y-2">
              <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                {item.tag}
              </div>
              <div className="text-base font-semibold text-[var(--text-primary)]">
                {item.title}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Reference Wins" description="Use proven assets to reinforce the pitch.">
        <div className="grid gap-4 md:grid-cols-2">
          {insight.similarWins.map((win, idx) => (
            <div key={`learn-win-${idx}`} className="rounded-xl bg-gradient-to-br from-white to-[var(--color-blue-10)] border border-[var(--color-blue-20)]/50 p-5 space-y-2 shadow-sm">
              <div className="text-sm uppercase tracking-wide text-[var(--text-secondary)]">
                {win.customer}
              </div>
              <div className="text-[var(--text-primary)]">{win.summary}</div>
              <div className="text-sm text-[var(--text-secondary)]">{win.proofPoint}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function InfoBlock({ title, lines }: { title: string; lines: (ReactNode | null | undefined)[] }) {
  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border border-[var(--border-subtle)]/70 space-y-2">
      <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
      <div className="space-y-1 text-[var(--text-secondary)]">
        {lines
          .filter((line): line is ReactNode => Boolean(line))
          .map((line, idx) => (
            <div key={`${title}-${idx}`} className="text-sm">
              {line}
            </div>
          ))}
      </div>
    </div>
  )
}
