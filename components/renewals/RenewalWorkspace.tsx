'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  GaugeCircle,
  MessageCircle,
  MessageSquare,
  Send,
  Target,
  TrendingDown,
  X,
} from 'lucide-react'

interface CaseStudy {
  title: string
  takeaway: string
}

interface ChecklistItem {
  title: string
  due: string
  owner: string
  status: 'Open' | 'In Progress' | 'Done'
}

interface QuickAction {
  id: string
  label: string
  description: string
  href: string
}

interface ObjectionItem {
  title: string
  response: string
  asset: string
}

interface UsageHighlight {
  label: string
  value: string
  trend: string
}

interface TalkTrack {
  opening: string
  agenda: string[]
  valueStory: string
  negotiation: string
  closing: string
}

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
}

const suggestionKeywords = [
  {
    keyword: 'budget',
    message: 'Anchor the hybrid benefit savings and shift to value-based concessions (service credits over discounts).',
  },
  {
    keyword: 'discount',
    message: 'Frame concessions around adoption milestones; reference loyalty incentive playbook.',
  },
  {
    keyword: 'timeline',
    message: 'Confirm procurement and legal timelines; schedule executive checkpoint before the deadline.',
  },
  {
    keyword: 'stakeholder',
    message: 'Loop in executive sponsor replacement and align on business outcomes before pricing.',
  },
  {
    keyword: 'security',
    message: 'Offer the security remediation + audit roadmap asset to calm compliance concerns.',
  },
]

export interface RenewalWorkspaceProps {
  account: {
    id: string
    company: string
    arr: string
    renewalDate: string
    daysToRenewal: number
    owner: string
    riskLevel: 'high' | 'medium' | 'low'
    healthScore: number
    execSummary: string
    primaryProduct: string
    region: string
    lastTouchDays: number
  }
  usage: {
    summary: string
    coverage: string
    highlights: UsageHighlight[]
    signals: string[]
  }
  recommendedActions: string[]
  talkTrack: TalkTrack
  objectionHandling: ObjectionItem[]
  readiness: {
    execAlignment: string
    adoptionPlan: string
    commercialOffer: string
  }
  checklist: ChecklistItem[]
  caseStudies: CaseStudy[]
  quickActions: QuickAction[]
  negotiationLevers: string[]
  outcomeOptions: string[]
  postCallPrompt: string
}

const tabs = ['Details', 'Engage', 'Learn'] as const

export default function RenewalWorkspace(props: RenewalWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Details')
  const [selectedOutcome, setSelectedOutcome] = useState(props.outcomeOptions[0] ?? '')
  const [postCallNotes, setPostCallNotes] = useState('')

  const summaryPlaceholder = useMemo(
    () =>
      `Example summary:\n• Alignment: ${props.readiness.execAlignment}.\n• Usage insight: ${props.usage.summary}.\n• Next actions: ${props.recommendedActions.slice(0, 2).join('; ')}`,
    [props.readiness.execAlignment, props.usage.summary, props.recommendedActions]
  )

  return (
    <div className="rounded-xl bg-white shadow-lg">
      <div className="border-b border-[var(--border-subtle)]/60 flex flex-wrap">
        {tabs.map((tab) => {
          const isActive = tab === activeTab
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-base font-medium transition-colors ${
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
        {activeTab === 'Learn' && (
          <LearnTab
            postCallPrompt={props.postCallPrompt}
            postCallNotes={postCallNotes}
            onPostCallNotesChange={setPostCallNotes}
            outcomeOptions={props.outcomeOptions}
            selectedOutcome={selectedOutcome}
            onOutcomeChange={setSelectedOutcome}
            caseStudies={props.caseStudies}
            signals={props.usage.signals}
            summaryPlaceholder={summaryPlaceholder}
          />
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
        )}
      </div>
      <div className="rounded-2xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-5 shadow-sm space-y-5">
        {children}
      </div>
    </section>
  )
}

function DetailsTab(props: RenewalWorkspaceProps) {
  const { account, usage, recommendedActions, talkTrack, objectionHandling, readiness, checklist, caseStudies } = props

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-[var(--border-subtle)]/70 bg-white px-5 py-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{account.company}</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {account.primaryProduct} • {account.region}
            </p>
            <p className="mt-2 text-sm text-[var(--text-primary)]">{account.execSummary}</p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-[var(--text-secondary)] md:items-end">
            <span className="rounded-full bg-[var(--color-blue-10)] px-3 py-1 font-medium text-[var(--color-blue-80)]">
              {account.arr} ARR
            </span>
            <span>Renewal in {account.daysToRenewal} days • {account.renewalDate}</span>
            <span>Owner {account.owner} • Last touch {account.lastTouchDays} days ago</span>
            <RiskBadge level={account.riskLevel} />
          </div>
        </div>
      </div>

      <Section title="Usage & health" description="Telemetry blended with Signal heuristics to explain renewal risk.">
        <div className="flex flex-col gap-4 text-sm text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            {usage.summary}
          </div>
          <div className="flex items-center gap-2">
            <GaugeCircle className="h-4 w-4 text-[var(--color-blue-80)]" />
            {usage.coverage}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {usage.highlights.map((item) => (
              <div key={`${account.id}-highlight-${item.label}`} className="rounded-xl bg-white px-4 py-3 shadow-sm">
                <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{item.label}</div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{item.value}</div>
                <div className="text-xs text-[var(--text-secondary)]">{item.trend}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
            {usage.signals.map((signal, idx) => (
              <span key={`${account.id}-signal-${idx}`} className="rounded-full bg-white px-3 py-1">
                {signal}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Signal guidance" description="Prioritized actions to stabilize the renewal.">
        <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
          {recommendedActions.map((action, idx) => (
            <li key={`${account.id}-action-${idx}`} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--color-blue-80)]" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Talk track" description="Use this structure to guide the executive save conversation.">
        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
          <p className="rounded-lg bg-white px-4 py-3 shadow-sm">
            <span className="font-semibold text-[var(--text-primary)]">Opening:</span> {talkTrack.opening}
          </p>
          <div>
            <span className="font-semibold text-[var(--text-primary)]">Agenda:</span>
            <ul className="list-disc list-inside space-y-1">
              {talkTrack.agenda.map((item, idx) => (
                <li key={`${account.id}-agenda-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Value story:</span> {talkTrack.valueStory}
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Negotiation lever:</span> {talkTrack.negotiation}
          </p>
          <p>
            <span className="font-semibold text-[var(--text-primary)]">Closing:</span> {talkTrack.closing}
          </p>
        </div>
      </Section>

      <Section title="Objection handling" description="Rebuttals sourced from similar saves.">
        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
          {objectionHandling.map((item, idx) => (
            <div key={`${account.id}-obj-${idx}`} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <div className="font-semibold text-[var(--text-primary)]">{item.title}</div>
              <p>{item.response}</p>
              <div className="text-xs text-[var(--text-secondary)] mt-1">Asset: {item.asset}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Readiness checkpoints" description="Track alignment before final offer presentation.">
        <div className="grid gap-3 md:grid-cols-3 text-sm text-[var(--text-secondary)]">
          <ReadinessTile label="Executive alignment" value={readiness.execAlignment} />
          <ReadinessTile label="Adoption plan" value={readiness.adoptionPlan} />
          <ReadinessTile label="Commercial offer" value={readiness.commercialOffer} />
        </div>
      </Section>

      <Section title="Action checklist" description="Must-dos before the renewal date.">
        <div className="space-y-2">
          {checklist.map((item, idx) => (
            <div key={`${account.id}-task-${idx}`} className="rounded-xl bg-white px-4 py-3 shadow-sm text-sm text-[var(--text-secondary)]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--text-primary)]">{item.title}</span>
                <span className="text-xs uppercase tracking-wide text-[var(--color-blue-80)]">{item.status}</span>
              </div>
              <div className="text-xs">
                Due {item.due} • Owner {item.owner}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Case studies" description="Use these proof points to reinforce value.">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-blue-80)]">
          {caseStudies.map((item, idx) => (
            <span key={`${account.id}-case-${idx}`} className="rounded-full bg-white px-3 py-1 shadow-sm">
              {item.title} — {item.takeaway}
            </span>
          ))}
        </div>
      </Section>
    </div>
  )
}

function EngageTab({
  account,
  usage,
  quickActions,
  talkTrack,
  negotiationLevers,
  checklist,
  caseStudies,
}: RenewalWorkspaceProps) {
  const [strategyNotes, setStrategyNotes] = useState('')
  const [pricingNotes, setPricingNotes] = useState('')
  const [stakeholderNotes, setStakeholderNotes] = useState('')
  const [followUpNotes, setFollowUpNotes] = useState('')

  const combinedNotes = useMemo(
    () =>
      [strategyNotes, pricingNotes, stakeholderNotes, followUpNotes]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    [strategyNotes, pricingNotes, stakeholderNotes, followUpNotes]
  )

  const [isChatOpen, setIsChatOpen] = useState(false)
  const [lastSignature, setLastSignature] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    createMessage(
      'assistant',
      `Ready when you can log notes. I’ll suggest next best actions for ${account.company} as you capture updates.`
    ),
  ])

  useEffect(() => {
    if (!combinedNotes) return
    const matched = suggestionKeywords
      .filter(({ keyword }) => combinedNotes.includes(keyword))
      .map(({ keyword }) => keyword)
    if (matched.length === 0) return
    const signature = matched.join('|')
    if (signature === lastSignature) return
    setLastSignature(signature)
    const suggestions = suggestionKeywords
      .filter(({ keyword }) => matched.includes(keyword))
      .map(({ message }) => `• ${message}`)
      .join('\n')
    setChatMessages((prev) => [
      ...prev,
      createMessage(
        'assistant',
        `Heard notes around ${matched.join(', ')}.\n${suggestions}\nNeed proof? Case studies are ready below.`
      ),
    ])
  }, [combinedNotes, lastSignature, account.company])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return
    const userMessage = createMessage('user', text.trim())
    setChatMessages((prev) => [...prev, userMessage])
    const reply = buildAssistantReply({
      text: text.trim(),
      account,
      quickActions,
      negotiationLevers,
      caseStudies,
      combinedNotes,
      usageSummary: usage.summary,
    })
    setChatMessages((prev) => [...prev, createMessage('assistant', reply)])
  }

  return (
    <div className="space-y-10">
      <Section title="Quick actions" description="Trigger the next steps without leaving Signal.">
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <div key={action.id} className="rounded-2xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{action.label}</div>
              <p className="text-sm text-[var(--text-secondary)]">{action.description}</p>
              <Link
                href={action.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-80)] hover:text-[var(--color-blue-90)]"
              >
                Launch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Negotiation plan" description="Talking points and concessions Signal recommends.">
        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
          <div className="rounded-lg bg-white px-4 py-3 shadow-sm">
            <span className="font-semibold text-[var(--text-primary)]">Positioning:</span> {talkTrack.valueStory}
          </div>
          <ul className="space-y-2">
            {negotiationLevers.map((lever, idx) => (
              <li key={`lever-${idx}`} className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 text-[var(--color-blue-80)]" />
                <span>{lever}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section title="Run-of-show" description="Use this to drive the renewal call or executive review.">
        <div className="grid gap-4 md:grid-cols-2 text-sm text-[var(--text-secondary)]">
          <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[var(--color-blue-80)]" />
              <span className="font-semibold text-[var(--text-primary)]">Opening</span>
            </div>
            <p>{talkTrack.opening}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-[var(--color-blue-80)]" />
              <span className="font-semibold text-[var(--text-primary)]">Agenda</span>
            </div>
            <ul className="list-disc list-inside space-y-1">
              {talkTrack.agenda.map((item, idx) => (
                <li key={`agenda-engage-${idx}`}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-[var(--color-blue-80)]" />
              <span className="font-semibold text-[var(--text-primary)]">Negotiation</span>
            </div>
            <p>{talkTrack.negotiation}</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--color-blue-80)]" />
              <span className="font-semibold text-[var(--text-primary)]">Closing</span>
            </div>
            <p>{talkTrack.closing}</p>
          </div>
        </div>
      </Section>

      <Section title="Pre-renewal checklist" description="Stay on top of operational steps.">
        <div className="space-y-2">
          {checklist.map((item, idx) => (
            <div key={`engage-task-${idx}`} className="rounded-xl bg-white px-4 py-3 shadow-sm text-sm text-[var(--text-secondary)]">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--text-primary)]">{item.title}</span>
                <span className="text-xs uppercase tracking-wide text-[var(--color-blue-80)]">{item.status}</span>
              </div>
              <div className="text-xs">Due {item.due} • Owner {item.owner}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Proof points" description="Stories to anchor the renewal.">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-blue-80)]">
          {caseStudies.map((item, idx) => (
            <span key={`case-engage-${idx}`} className="rounded-full bg-white px-3 py-1 shadow-sm">
              {item.title} — {item.takeaway}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Live notes" description="Capture key call highlights so Signal can assist in real time.">
        <div className="grid gap-4 md:grid-cols-2">
          <NoteField
            label="Strategy notes"
            placeholder="Document desired outcomes, ROI commitments, executive asks..."
            value={strategyNotes}
            onChange={setStrategyNotes}
          />
          <NoteField
            label="Commercial & pricing"
            placeholder="Capture discount asks, offer structure, approval blockers..."
            value={pricingNotes}
            onChange={setPricingNotes}
          />
          <NoteField
            label="Stakeholders & alignment"
            placeholder="List sponsors, blockers, next attendees..."
            value={stakeholderNotes}
            onChange={setStakeholderNotes}
          />
          <NoteField
            label="Follow-up actions"
            placeholder="Next meetings, assets to send, internal tasks..."
            value={followUpNotes}
            onChange={setFollowUpNotes}
          />
        </div>
      </Section>

      <FloatingAssistant
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen((prev) => !prev)}
        messages={chatMessages}
        onSend={handleSendMessage}
      />
    </div>
  )
}

function LearnTab({
  postCallPrompt,
  postCallNotes,
  onPostCallNotesChange,
  outcomeOptions,
  selectedOutcome,
  onOutcomeChange,
  caseStudies,
  signals,
  summaryPlaceholder,
}: {
  postCallPrompt: string
  postCallNotes: string
  onPostCallNotesChange: (value: string) => void
  outcomeOptions: string[]
  selectedOutcome: string
  onOutcomeChange: (value: string) => void
  caseStudies: CaseStudy[]
  signals: string[]
  summaryPlaceholder: string
}) {
  return (
    <div className="space-y-10">
      <Section title="Post-call capture" description={postCallPrompt}>
        <textarea
          value={postCallNotes}
          onChange={(event) => onPostCallNotesChange(event.target.value)}
          className="w-full min-h-[160px] rounded-xl border border-[var(--border-subtle)]/70 bg-white p-4 text-base text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
          placeholder={summaryPlaceholder}
        />
      </Section>

      <Section title="Outcome" description="Update Signal so prioritization and manager dashboards stay in sync.">
        <div className="flex flex-wrap gap-3">
          {outcomeOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onOutcomeChange(option)}
              className={`px-3 py-2 rounded-full text-sm transition-colors ${
                selectedOutcome === option
                  ? 'bg-[var(--color-blue-90)] text-white'
                  : 'bg-white text-[var(--color-blue-80)] border border-[var(--border-subtle)]/70'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Signal updates" description="Tag the drivers so Signal learns what saved or stalled the renewal.">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-blue-80)]">
          {signals.map((signal, idx) => (
            <span key={`signal-learn-${idx}`} className="rounded-full bg-white px-3 py-1 shadow-sm">
              #{signal.replace(/\s+/g, '').toLowerCase()}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Reference library" description="Reuse the stories that resonate during follow-up.">
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-blue-80)]">
          {caseStudies.map((item, idx) => (
            <span key={`case-learn-${idx}`} className="rounded-full bg-white px-3 py-1 shadow-sm">
              {item.title}
            </span>
          ))}
        </div>
      </Section>
    </div>
  )
}

function RiskBadge({ level }: { level: RenewalWorkspaceProps['account']['riskLevel'] }) {
  const styles = {
    high: 'bg-red-50 text-red-600 border-red-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    low: 'bg-green-50 text-green-700 border-green-200',
  }[level]

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${styles}`}>
      <AlertTriangle className="h-3 w-3" />
      {level.toUpperCase()} RISK
    </span>
  )
}

function ReadinessTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{label}</div>
      <div className="text-sm font-semibold text-[var(--text-primary)] mt-1">{value}</div>
    </div>
  )
}

function NoteField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  value: string
  onChange: Dispatch<SetStateAction<string>>
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[120px] rounded-xl border border-[var(--border-subtle)]/70 bg-white p-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      />
    </div>
  )
}

function FloatingAssistant({
  isOpen,
  onToggle,
  messages,
  onSend,
}: {
  isOpen: boolean
  onToggle: () => void
  messages: ChatMessage[]
  onSend: (text: string) => void
}) {
  const [draft, setDraft] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSend(draft)
    setDraft('')
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="flex h-96 w-80 max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)]/70 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-[var(--color-blue-90)] px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <MessageCircle className="h-4 w-4" />
              Signal Assist
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-full p-1 hover:bg-white/20"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--color-blue-10)]/40 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                    message.role === 'assistant'
                      ? 'bg-white text-[var(--text-primary)] border border-[var(--border-subtle)]/60'
                      : 'bg-[var(--color-blue-90)] text-white'
                  }`}
                >
                  {message.content.split('\n').map((line, idx) => (
                    <span key={`${message.id}-${idx}`} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-[var(--border-subtle)]/70 bg-white px-3 py-3">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask for next best move…"
              className="flex-1 rounded-full border border-[var(--border-subtle)]/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
            />
            <button
              type="submit"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-blue-90)] text-white hover:bg-[var(--color-blue-80)]"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-blue-90)] px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-[var(--color-blue-80)]"
        >
          <MessageCircle className="h-4 w-4" />
          Signal Assist
        </button>
      )}
    </div>
  )
}

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    role,
    content,
  }
}

function buildAssistantReply({
  text,
  account,
  quickActions,
  negotiationLevers,
  caseStudies,
  combinedNotes,
  usageSummary,
}: {
  text: string
  account: RenewalWorkspaceProps['account']
  quickActions: QuickAction[]
  negotiationLevers: string[]
  caseStudies: CaseStudy[]
  combinedNotes: string
  usageSummary: string
}) {
  const normalized = text.toLowerCase()
  const responses: string[] = []

  if (normalized.includes('case')) {
    responses.push(`Pull a proof point: ${caseStudies[0]?.title ?? 'Contoso win'} — ${caseStudies[0]?.takeaway ?? 'share adoption impact.'}`)
  }

  if (normalized.includes('discount') || combinedNotes.includes('discount')) {
    responses.push('Reframe the ask around service credits or phased pricing tied to adoption milestones.')
  }

  if (normalized.includes('budget') || combinedNotes.includes('budget')) {
    responses.push('Highlight the hybrid benefit savings and align with CFO using the ROI sheet.')
  }

  if (normalized.includes('timeline') || combinedNotes.includes('timeline')) {
    responses.push('Lock the next executive checkpoint and confirm procurement dates before offering concessions.')
  }

  if (normalized.includes('security') || combinedNotes.includes('security')) {
    responses.push('Offer the remediation workshop and secure score roadmap asset to address security concerns.')
  }

  if (normalized.includes('action')) {
    responses.push(`Try launching “${quickActions[0]?.label ?? 'renewal call companion'}” to move faster.`)
  }

  if (responses.length === 0) {
    responses.push(
      `Focus on why this renewal matters: ${usageSummary}. Reinforce ${negotiationLevers[0] ?? 'value-based negotiation'} before discussing pricing.`
    )
  }

  return responses.join('\n')
}
