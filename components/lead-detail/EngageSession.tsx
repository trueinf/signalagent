'use client'

import { useEffect, useMemo, useState, type ReactNode, type Dispatch, type SetStateAction } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ClipboardList, MessageCircle, MessageSquare, Send, Sparkles, X } from 'lucide-react'

interface TalkTrack {
  opening: string
  agenda: string[]
  discovery: string[]
  closing: string
}

interface ObjectionResponse {
  objection: string
  response: string
  proofPoint: string
}

interface EmailTemplate {
  subject: string
  preview: string
  bodyPoints: string[]
  closing: string
}

interface EngageSessionProps {
  lead: {
    id: string
    name: string
    company: string
    intentScore: number
    priorityLabel: string
    industry: string
    buyerRole: string
    size: string
    sector: string
    source: string
    topSignal: string
    aiInsight: string
  }
  talkTrack: TalkTrack
  objectionResponses: ObjectionResponse[]
  emailTemplate: EmailTemplate
  recommendedNextSteps: string[]
  quickPrompts: {
    opening: string[]
    discovery: string[]
    objections: string[]
    commitments: string[]
  }
  outcomeOptions: string[]
}

const keywordSuggestions = [
  {
    keyword: 'budget',
    message: 'Highlight the hybrid benefit savings and share the ROI calculator.',
  },
  {
    keyword: 'timeline',
    message: 'Confirm launch dates and propose the Azure architect review next week.',
  },
  {
    keyword: 'security',
    message: 'Reference Microsoft’s compliance posture and offer a security deep dive.',
  },
  {
    keyword: 'stakeholder',
    message: 'Capture additional stakeholders and offer to co-host the next call with the specialist.',
  },
]

interface ChatMessage {
  id: string
  role: 'assistant' | 'user'
  content: string
}

export default function EngageSession({
  lead,
  talkTrack,
  objectionResponses,
  emailTemplate,
  recommendedNextSteps,
  quickPrompts,
  outcomeOptions,
}: EngageSessionProps) {
  const [openingNotes, setOpeningNotes] = useState('')
  const [discoveryNotes, setDiscoveryNotes] = useState('')
  const [objectionNotes, setObjectionNotes] = useState('')
  const [commitmentNotes, setCommitmentNotes] = useState('')
  const [selectedOutcome, setSelectedOutcome] = useState(outcomeOptions[0] ?? '')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [lastSuggestionSignature, setLastSuggestionSignature] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => [
    createMessage(
      'assistant',
      `Ready when you are. Once you start noting details, I’ll surface helpful rebuttals and case studies tailored to ${lead.company}.`
    ),
  ])

  const combinedNotes = useMemo(
    () =>
      [openingNotes, discoveryNotes, objectionNotes, commitmentNotes]
        .join(' ')
        .toLowerCase(),
    [openingNotes, discoveryNotes, objectionNotes, commitmentNotes]
  )

  const contextualSuggestions = useMemo(
    () =>
      keywordSuggestions.filter(({ keyword }) => combinedNotes.includes(keyword)),
    [combinedNotes]
  )

  useEffect(() => {
    if (contextualSuggestions.length === 0) return
    const signature = contextualSuggestions.map(({ keyword }) => keyword).join('|')
    if (signature === lastSuggestionSignature) return
    setLastSuggestionSignature(signature)
    const suggestionBullets = contextualSuggestions
      .map(({ message }) => `• ${message}`)
      .join('\n')
    const content = `Noticed notes around ${contextualSuggestions
      .map(({ keyword }) => keyword)
      .join(', ')}.\n${suggestionBullets}\nNeed proof points? Open case studies: /leads/${lead.id}/case-studies`
    setChatMessages((prev) => [...prev, createMessage('assistant', content)])
  }, [contextualSuggestions, lastSuggestionSignature, lead.id])

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return
    setChatMessages((prev) => [...prev, createMessage('user', text.trim())])
    const reply = buildAssistantReply({
      text: text.trim(),
      combinedNotes,
      lead,
      contextualSuggestions,
    })
    setChatMessages((prev) => [...prev, createMessage('assistant', reply)])
  }

  const structuredSummary = useMemo(() => {
    const pieces: string[] = []
    if (openingNotes.trim()) pieces.push(`Intro: ${openingNotes.trim()}`)
    if (discoveryNotes.trim()) pieces.push(`Discovery: ${discoveryNotes.trim()}`)
    if (objectionNotes.trim()) pieces.push(`Objections: ${objectionNotes.trim()}`)
    if (commitmentNotes.trim()) pieces.push(`Next steps: ${commitmentNotes.trim()}`)
    return pieces.join('\n\n') || 'Capture your notes above to build a summary.'
  }, [openingNotes, discoveryNotes, objectionNotes, commitmentNotes])

  const followUpDraft = useMemo(() => {
    const commitments = commitmentNotes.trim()
    return `Hi ${lead.name.split(' ')[0]},\n\nGreat speaking today about the Azure Signal evaluation. ${
      discoveryNotes
        ? `Here’s a quick recap of what we covered: ${discoveryNotes.trim()}\n\n`
        : ''
    }As next steps, ${commitments || 'I’ll follow up with the architecture review invite and supporting materials we discussed.'}\n\nPlease let me know if anything else comes to mind before our next checkpoint.\n\nThanks,\n<Your name>`
  }, [lead.name, discoveryNotes, commitmentNotes])

  const appendPrompt = (section: 'opening' | 'discovery' | 'objections' | 'commitments', value: string) => {
    const append = (setter: Dispatch<SetStateAction<string>>) =>
      setter((prev) => addSnippet(prev, value))

    switch (section) {
      case 'opening':
        append(setOpeningNotes)
        break
      case 'discovery':
        append(setDiscoveryNotes)
        break
      case 'objections':
        append(setObjectionNotes)
        break
      case 'commitments':
        append(setCommitmentNotes)
        break
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-[var(--color-blue-90)] text-white shadow-lg">
        <div className="p-6 lg:p-8 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link
              href={`/leads/${lead.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-20)] hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to lead workspace
            </Link>
            <div className="flex items-center gap-2 text-sm text-[var(--color-blue-20)]">
              <Sparkles className="h-4 w-4" />
              <span>Signal guidance for this live call</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
                {lead.priorityLabel} • Intent {lead.intentScore}
              </span>
              <div>
                <h1 className="text-3xl font-semibold">{lead.company}</h1>
                <p className="text-lg text-[var(--color-blue-20)]">
                  {lead.name} • {lead.industry} · {lead.buyerRole}
                </p>
              </div>
              <p className="text-sm text-[var(--color-blue-10)] leading-relaxed">
                {lead.aiInsight}
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-5 space-y-2 text-sm">
              <div className="font-semibold text-[var(--color-blue-20)] uppercase tracking-wide">
                Call prep snapshot
              </div>
              <div>Company size: {lead.size}</div>
              <div>Sector: {lead.sector}</div>
              <div>Primary signal: {lead.topSignal}</div>
              <div>Source: {lead.source}</div>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-5">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Pre-call Brief</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Revisit key reasons this conversation matters today and align your outcome before dialing.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-3">
            <div className="text-sm uppercase tracking-wide text-[var(--text-secondary)]">Why now</div>
            <p className="text-[var(--text-primary)] leading-relaxed">{lead.aiInsight}</p>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-3">
            <div className="text-sm uppercase tracking-wide text-[var(--text-secondary)]">Plan for the call</div>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-2">
              {recommendedNextSteps.map((step, idx) => (
                <li key={`prep-step-${idx}`}>{step}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-3">
            <div className="text-sm uppercase tracking-wide text-[var(--text-secondary)]">Talk track outline</div>
            <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
              <li><span className="font-semibold text-[var(--text-primary)]">Opening:</span> {talkTrack.opening}</li>
              <li><span className="font-semibold text-[var(--text-primary)]">Agenda:</span> {talkTrack.agenda.join('; ')}</li>
              <li><span className="font-semibold text-[var(--text-primary)]">Closing:</span> {talkTrack.closing}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Call Companion</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Use structured notes and quick prompts to log the conversation in real time. Signal surfaces tips based on what you capture.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <NotePane
            title="Opening"
            value={openingNotes}
            onChange={setOpeningNotes}
            placeholder="Confirm context, align on agenda, restate the trigger."
            prompts={quickPrompts.opening}
            onPromptSelect={(prompt) => appendPrompt('opening', prompt)}
            icon={<MessageSquare className="h-4 w-4 text-[var(--color-blue-80)]" />}
          />
          <NotePane
            title="Discovery"
            value={discoveryNotes}
            onChange={setDiscoveryNotes}
            placeholder="Capture pain points, success criteria, stakeholders, and urgency."
            prompts={quickPrompts.discovery}
            onPromptSelect={(prompt) => appendPrompt('discovery', prompt)}
            icon={<ClipboardList className="h-4 w-4 text-[var(--color-blue-80)]" />}
          />
          <NotePane
            title="Objections & Signals"
            value={objectionNotes}
            onChange={setObjectionNotes}
            placeholder="Note pushbacks, blockers, or signals to revisit later."
            prompts={quickPrompts.objections}
            onPromptSelect={(prompt) => appendPrompt('objections', prompt)}
            icon={<Sparkles className="h-4 w-4 text-[var(--color-blue-80)]" />}
          />
          <NotePane
            title="Commitments & Next Steps"
            value={commitmentNotes}
            onChange={setCommitmentNotes}
            placeholder="Document actions, owners, and timelines agreed."
            prompts={quickPrompts.commitments}
            onPromptSelect={(prompt) => appendPrompt('commitments', prompt)}
            icon={<CheckCircle2 className="h-4 w-4 text-[var(--color-blue-80)]" />}
          />
        </div>

        <SuggestionTray suggestions={contextualSuggestions.map((item) => item.message)} />

        <div className="rounded-xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-3">
          <div className="text-sm font-semibold text-[var(--text-primary)]">Signal Tip</div>
          <p className="text-sm text-[var(--text-secondary)]">
            Drop quick notes as you go—the summary, follow-up email, and CRM log will pull directly from what you capture here.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">Wrap-up & Handoff</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Record the outcome, auto-build your summary, and queue the follow-up assets before you leave the page.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr,1fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Call outcome</div>
              <div className="flex flex-wrap gap-3">
                {outcomeOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSelectedOutcome(option)}
                    className={`px-3 py-2 rounded-full text-sm transition-colors ${
                      selectedOutcome === option
                        ? 'bg-[var(--color-blue-90)] text-white'
                        : 'bg-[var(--color-blue-10)] text-[var(--color-blue-80)] hover:bg-[var(--color-blue-20)]/60'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Selected outcome feeds Signal’s prioritisation and manager dashboards.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Structured summary</div>
              <pre className="whitespace-pre-wrap text-sm text-[var(--text-secondary)] bg-[var(--color-blue-10)]/60 rounded-lg p-4">
{structuredSummary}
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Follow-up email draft</div>
              <pre className="whitespace-pre-wrap text-sm text-[var(--text-secondary)] bg-[var(--color-blue-10)]/60 rounded-lg p-4">
{followUpDraft}
              </pre>
              <p className="text-xs text-[var(--text-secondary)]">
                Copy to Outlook or Teams, personalise, and send before moving to the next lead.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-3">
              <div className="text-sm font-semibold text-[var(--text-primary)]">Objection quick reference</div>
              <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                {objectionResponses.map((item, idx) => (
                  <li key={`wrap-objection-${idx}`}>
                    <span className="font-semibold text-[var(--text-primary)]">{item.objection}</span>
                    <div>{item.response}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FloatingAssistant
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen((prev) => !prev)}
        messages={chatMessages}
        onSend={handleSendMessage}
      />
    </div>
  )
}
function NotePane({
  title,
  value,
  onChange,
  placeholder,
  prompts,
  onPromptSelect,
  icon,
}: {
  title: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  prompts: string[]
  onPromptSelect: (prompt: string) => void
  icon: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <div className="text-sm font-semibold text-[var(--text-primary)]">{title}</div>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[140px] rounded-xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-4 text-base text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      />
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPromptSelect(prompt)}
            className="px-3 py-1 text-xs rounded-full bg-[var(--color-blue-10)] text-[var(--color-blue-80)] hover:bg-[var(--color-blue-20)]/60 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}

function SuggestionTray({ suggestions }: { suggestions: string[] }) {
  if (suggestions.length === 0) return null
  return (
    <div className="rounded-2xl border border-[var(--color-blue-20)]/60 bg-[var(--color-blue-10)] p-4 space-y-2 shadow-sm">
      <div className="text-sm font-semibold text-[var(--color-blue-80)]">Live suggestions</div>
      <ul className="list-disc list-inside text-sm text-[var(--text-secondary)] space-y-1">
        {suggestions.map((suggestion, idx) => (
          <li key={`suggestion-${idx}`}>{suggestion}</li>
        ))}
      </ul>
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
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 max-w-[90vw] rounded-2xl bg-white shadow-2xl border border-[var(--border-subtle)]/70 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between bg-[var(--color-blue-90)] text-white px-4 py-3">
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

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 bg-[var(--color-blue-10)]/40">
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

          <form onSubmit={handleSubmit} className="border-t border-[var(--border-subtle)]/70 bg-white px-3 py-3 flex items-center gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask for next best step…"
              className="flex-1 rounded-full border border-[var(--border-subtle)]/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-blue-90)] text-white h-9 w-9 hover:bg-[var(--color-blue-80)]"
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
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-blue-90)] text-white px-4 py-3 shadow-lg hover:bg-[var(--color-blue-80)]"
        >
          <MessageCircle className="h-5 w-5" />
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
  combinedNotes,
  lead,
  contextualSuggestions,
}: {
  text: string
  combinedNotes: string
  lead: EngageSessionProps['lead']
  contextualSuggestions: { keyword: string; message: string }[]
}) {
  const normalized = text.toLowerCase()
  const responses: string[] = []

  if (normalized.includes('case') || normalized.includes('story')) {
    responses.push(`Open tailored case studies for ${lead.company}: /leads/${lead.id}/case-studies`)
  }

  if (normalized.includes('objection') || combinedNotes.includes('objection')) {
    responses.push('Open the objection quick reference to reinforce proof points and capture the response in notes.')
  }

  if (normalized.includes('email')) {
    responses.push('Use the follow-up email draft on the right pane to confirm next steps before leaving the page.')
  }

  if ((normalized.includes('next step') || normalized.includes('what next')) && contextualSuggestions.length > 0) {
    responses.push(`Recommended action: ${contextualSuggestions[0].message}`)
  }

  if (responses.length === 0) {
    responses.push(
      `Anchor on the latest signal: ${lead.topSignal}. If budget pressure surfaces, reference the hybrid benefit savings and invite the Azure architect.`
    )
  }

  return responses.join('\n')
}

function addSnippet(existing: string, snippet: string) {
  if (!existing) return snippet
  return `${existing}\n${snippet}`
}
