'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Lightbulb,
  MessageCircle,
  MessageSquare,
  Send,
  Sparkles,
  Target,
  X,
} from 'lucide-react'

interface WinStory {
  customer: string
  takeaway: string
  details?: string
}

interface QuickAction {
  id: string
  label: string
  description: string
  href: string
}

interface ObjectionWorkspaceProps {
  cluster: {
    id: string
    title: string
    severity: 'high' | 'medium' | 'emerging'
    frequency: number
    changePct: number
    personas: string[]
    motions: string[]
    summary: string
    signals: string[]
  }
  recommendedActions: string[]
  playbook: {
    opener: string
    framing: string
    proofPoints: string[]
    close: string
  }
  assets: string[]
  winStories: WinStory[]
  metrics: {
    adoptionRate: number
    winRateLift: number
    averageDuration: string
  }
  quickActions: QuickAction[]
  learningPrompts: string[]
}

const tabs = ['Details', 'Responses', 'Learn'] as const

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
}

const keywordSuggestions = [
  { keyword: 'budget', message: 'Lead with the ROI calculator and loyalty incentive framing.' },
  { keyword: 'usage', message: 'Offer the adoption sprint plan and champion workshop to recover usage.' },
  { keyword: 'security', message: 'Share the remediation playbook and align FastTrack security resources.' },
  { keyword: 'priority', message: 'Tie Copilot to existing OKRs with a 30-day pilot to maintain momentum.' },
]

export default function ObjectionWorkspace(props: ObjectionWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Details')
  const [notes, setNotes] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    createMessage(
      'assistant',
      `I’m ready to help counter “${props.cluster.title}”. Drop notes or ask for assets and I’ll bring what works.`
    ),
  ])
  const [lastSignature, setLastSignature] = useState('')

  const combinedNotes = useMemo(() => notes.toLowerCase(), [notes])

  useEffect(() => {
    if (!combinedNotes) return
    const matched = keywordSuggestions
      .filter(({ keyword }) => combinedNotes.includes(keyword))
      .map(({ keyword }) => keyword)
    if (matched.length === 0) return
    const signature = matched.join('|')
    if (signature === lastSignature) return
    setLastSignature(signature)
    const suggestionText = keywordSuggestions
      .filter(({ keyword }) => matched.includes(keyword))
      .map(({ message }) => `• ${message}`)
      .join('\n')
    setChatMessages((prev) => [
      ...prev,
      createMessage(
        'assistant',
        `Heard cues around ${matched.join(', ')}.\n${suggestionText}\nNeed more? Ask for assets or a tailored rebuttal.`
      ),
    ])
  }, [combinedNotes, lastSignature, props.cluster.title])

  const handleSend = (text: string) => {
    if (!text.trim()) return
    setChatMessages((prev) => [...prev, createMessage('user', text.trim())])
    const reply = buildAssistantReply({
      text: text.trim(),
      cluster: props.cluster,
      quickActions: props.quickActions,
      assets: props.assets,
      winStories: props.winStories,
      combinedNotes,
    })
    setChatMessages((prev) => [...prev, createMessage('assistant', reply)])
  }

  return (
    <div className="rounded-xl bg-white shadow-lg">
      <div className="border-b border-[var(--border-subtle)]/60 flex flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-base font-medium transition-colors ${
              activeTab === tab
                ? 'text-[var(--color-blue-90)] border-b-2 border-[var(--color-blue-90)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--color-blue-90)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 lg:p-8 space-y-10">
        {activeTab === 'Details' && <DetailsTab {...props} />}
        {activeTab === 'Responses' && (
          <ResponsesTab
            {...props}
            notes={notes}
            onNotesChange={setNotes}
            chatMessages={chatMessages}
            isChatOpen={isChatOpen}
            onToggleChat={() => setIsChatOpen((prev) => !prev)}
            onSendMessage={handleSend}
          />
        )}
        {activeTab === 'Learn' && <LearnTab {...props} />}
      </div>
    </div>
  )
}

function DetailsTab(props: ObjectionWorkspaceProps) {
  const { cluster, recommendedActions, playbook, assets, winStories, metrics } = props

  return (
    <div className="space-y-10">
      <InfoSection title="Cluster overview">
        <p className="text-sm text-[var(--text-secondary)]">{cluster.summary}</p>
        <div className="flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
          {cluster.personas.map((persona) => (
            <span key={`${cluster.id}-persona-${persona}`} className="rounded-full bg-[var(--color-blue-10)] px-3 py-1">
              {persona}
            </span>
          ))}
          {cluster.motions.map((motion) => (
            <span key={`${cluster.id}-motion-${motion}`} className="rounded-full bg-[var(--color-blue-10)] px-3 py-1">
              {motion}
            </span>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Signals to watch" description="Microsoft telemetry and rep notes that typically trigger this objection.">
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {cluster.signals.map((signal, idx) => (
            <li key={`${cluster.id}-signal-${idx}`}>• {signal}</li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Recommended focus" description="Signal suggests leading with these moves.">
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {recommendedActions.map((action, idx) => (
            <li key={`${cluster.id}-action-${idx}`} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--color-blue-80)]" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </InfoSection>

      <InfoSection title="Performance" description="Impact when this playbook is used.">
        <div className="grid gap-4 md:grid-cols-3 text-sm text-[var(--text-secondary)]">
          <MetricTile label="Play adoption" value={`${Math.round(metrics.adoptionRate * 100)}%`} />
          <MetricTile label="Win-rate lift" value={`+${Math.round(metrics.winRateLift * 100)} pts`} />
          <MetricTile label="Average duration" value={metrics.averageDuration} />
        </div>
      </InfoSection>

      <InfoSection title="Win stories" description="See how other reps overcame this objection.">
        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
          {winStories.map((story, idx) => (
            <div key={`${cluster.id}-story-${idx}`} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{story.customer}</div>
              <p>{story.takeaway}</p>
              {story.details && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">How it was won: {story.details}</p>
              )}
            </div>
          ))}
        </div>
      </InfoSection>
    </div>
  )
}

function ResponsesTab({
  cluster,
  playbook,
  assets,
  winStories,
  quickActions,
  notes,
  onNotesChange,
  chatMessages,
  isChatOpen,
  onToggleChat,
  onSendMessage,
}: ObjectionWorkspaceProps & {
  notes: string
  onNotesChange: (value: string) => void
  chatMessages: ChatMessage[]
  isChatOpen: boolean
  onToggleChat: () => void
  onSendMessage: (text: string) => void
}) {
  return (
    <div className="space-y-10">
      <InfoSection title="Playbook" description="Signal suggests guiding the conversation like this.">
        <div className="space-y-3 text-sm text-[var(--text-secondary)]">
          <Block title="Opener" icon={<MessageSquare className="h-4 w-4 text-[var(--color-blue-80)]" />}>
            {playbook.opener}
          </Block>
          <Block title="Frame" icon={<Lightbulb className="h-4 w-4 text-[var(--color-blue-80)]" />}>
            {playbook.framing}
          </Block>
          <Block title="Proof" icon={<Sparkles className="h-4 w-4 text-[var(--color-blue-80)]" />}>
            <ul className="list-disc list-inside space-y-1">
              {playbook.proofPoints.map((point, idx) => (
                <li key={`${cluster.id}-proof-${idx}`}>{point}</li>
              ))}
            </ul>
          </Block>
          <Block title="Close" icon={<Target className="h-4 w-4 text-[var(--color-blue-80)]" />}>
            {playbook.close}
          </Block>
          {winStories.length > 0 && (
            <Block title="Example win" icon={<CheckCircle2 className="h-4 w-4 text-[var(--color-blue-80)]" />}>
              <div className="space-y-1">
                <div className="font-semibold text-[var(--text-primary)]">{winStories[0].customer}</div>
                <p>{winStories[0].takeaway}</p>
                {winStories[0].details && (
                  <p className="text-xs text-[var(--text-secondary)]">Playbook in action: {winStories[0].details}</p>
                )}
              </div>
            </Block>
          )}
        </div>
      </InfoSection>

      <InfoSection title="Assets & quick actions" description="Launch the right collateral or workflow in one click.">
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) =>
            action.href ? (
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
            ) : null
          )}
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-[var(--color-blue-80)]">
          {assets.map((asset, idx) => (
            <span key={`${cluster.id}-asset-${idx}`} className="rounded-full bg-[var(--color-blue-10)] px-3 py-1 font-medium">
              {asset}
            </span>
          ))}
        </div>
      </InfoSection>

      <InfoSection title="Live notes" description="Capture what the customer said so Signal Assist adapts in real time.">
        <textarea
          value={notes}
          onChange={(event) => onNotesChange(event.target.value)}
          className="w-full min-h-[140px] rounded-xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
          placeholder="Drop the customer’s exact phrasing or concerns here..."
        />
      </InfoSection>

      <FloatingAssistant
        isOpen={isChatOpen}
        onToggle={onToggleChat}
        messages={chatMessages}
        onSend={onSendMessage}
      />
    </div>
  )
}

function LearnTab(props: ObjectionWorkspaceProps) {
  const { learningPrompts, winStories, cluster } = props

  return (
    <div className="space-y-10">
      <InfoSection title="Capture learnings" description="Log what changed so Signal can refine playbooks.">
        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
          {learningPrompts.map((prompt, idx) => (
            <li key={`${cluster.id}-learning-${idx}`}>• {prompt}</li>
          ))}
        </ul>
        <textarea
          className="w-full min-h-[140px] rounded-xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
          placeholder="Example: CFO accepted service credits after seeing hybrid benefit worksheet. Need follow-up ROI dashboard."
        />
      </InfoSection>

      <InfoSection title="Share a new variant" description="Surface new wording or nuance you just heard.">
        <textarea
          className="w-full min-h-[120px] rounded-xl border border-[var(--border-subtle)]/70 bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
          placeholder="Customer said: “We can’t justify cost because adoption is below 40%.” Recommended response..."
        />
        <button className="inline-flex items-center gap-2 rounded-full bg-[var(--color-blue-90)] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[var(--color-blue-80)]">
          Submit to Signal
          <ArrowRight className="h-4 w-4" />
        </button>
      </InfoSection>

      <InfoSection title="Success feed" description="Remind the team what’s working.">
        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
          {winStories.map((story, idx) => (
            <div key={`${cluster.id}-learn-story-${idx}`} className="rounded-xl bg-white px-4 py-3 shadow-sm">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{story.customer}</div>
              <p>{story.takeaway}</p>
            </div>
          ))}
        </div>
      </InfoSection>
    </div>
  )
}

function InfoSection({
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

function Block({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-[var(--text-primary)]">{title}</span>
      </div>
      <div className="text-sm text-[var(--text-secondary)]">{children}</div>
    </div>
  )
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{label}</div>
      <div className="text-sm font-semibold text-[var(--text-primary)] mt-1">{value}</div>
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
              placeholder="Ask for the next best response…"
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
  cluster,
  quickActions,
  assets,
  winStories,
  combinedNotes,
}: {
  text: string
  cluster: ObjectionWorkspaceProps['cluster']
  quickActions: QuickAction[]
  assets: string[]
  winStories: WinStory[]
  combinedNotes: string
}) {
  const normalized = text.toLowerCase()
  const responses: string[] = []

  if (normalized.includes('asset')) {
    responses.push(`Try sending ${assets[0] ?? 'the ROI calculator'} to reinforce value.`)
  }

  if (normalized.includes('case') || normalized.includes('story')) {
    const story = winStories[0]
    if (story) {
      responses.push(`Share ${story.customer}: ${story.takeaway}`)
    }
  }

  if (normalized.includes('launch') || normalized.includes('action')) {
    responses.push(`Launch “${quickActions[0]?.label ?? 'tailored rebuttal'}” to speed up prep.`)
  }

  if (combinedNotes.includes('security')) {
    responses.push('Highlight the remediation plan and involve FastTrack security before pricing discussion.')
  }

  if (responses.length === 0) {
    responses.push(
      `Align on business outcomes first, then use the playbook framing: ${cluster.summary}. Ask if they saw the ${assets[0] ?? 'supporting asset'}.`
    )
  }

  return responses.join('\n')
}
