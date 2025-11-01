'use client'

import Link from 'next/link'
import {
  AlertTriangle,
  ClipboardPen,
  Filter,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import {
  enablementTasks,
  experimentHighlights,
  highlights,
  metrics,
  telemetryCards,
  teamSignals,
} from '@/lib/data/insights'

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-8 space-y-4">
          <h1 className="text-3xl font-semibold">Signal Insights</h1>
          <p className="text-[var(--color-blue-20)]">
            Real-time learnings from leads, renewals, and objections—so the team knows what’s working and what to fix next.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <SummaryStrip />

        <HighlightsSection />

        <TelemetrySection />

        <EnablementSection />

        <ExperimentsSection />

        <TeamSignalsSection />
      </div>
    </div>
  )
}

function SummaryStrip() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.id} className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-5 shadow-sm">
          <div className="text-sm text-[var(--text-secondary)]">{metric.title}</div>
          <div className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{metric.value}</div>
          <div className="text-xs uppercase tracking-wide text-[var(--color-blue-80)]">{metric.caption}</div>
          <div className="mt-1 text-xs text-[var(--text-secondary)]">{metric.trend}</div>
        </div>
      ))}
    </div>
  )
}

function HighlightsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <Sparkles className="h-4 w-4 text-[var(--color-blue-80)]" />
        What Signal is learning
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((highlight) => (
          <Link
            key={highlight.id}
            href={highlight.link}
            className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <div className="text-sm font-semibold text-[var(--text-primary)]">{highlight.title}</div>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{highlight.summary}</p>
            <div className="mt-3 text-xs uppercase tracking-wide text-[var(--color-blue-80)]">Impact</div>
            <p className="text-sm text-[var(--text-secondary)]">{highlight.impact}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

function TelemetrySection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <Filter className="h-4 w-4 text-[var(--color-blue-80)]" />
        Telemetry deep dives
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {telemetryCards.map((card) => (
          <div key={card.id} className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-5 shadow-sm space-y-2">
            <div className="text-sm font-semibold text-[var(--text-primary)]">{card.title}</div>
            <div className="text-2xl font-semibold text-[var(--text-primary)]">{card.metric}</div>
            <div className="text-xs text-[var(--color-blue-80)]">{card.change}</div>
            <p className="text-sm text-[var(--text-secondary)]">{card.commentary}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function EnablementSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <ClipboardPen className="h-4 w-4 text-[var(--color-blue-80)]" />
        Enablement backlog
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {enablementTasks.map((task) => (
          <div key={task.id} className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{task.title}</div>
              <span className={`text-xs uppercase tracking-wide ${task.status === 'Done' ? 'text-green-600' : 'text-[var(--color-blue-80)]'}`}>
                {task.status}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{task.description}</p>
            <div className="text-xs text-[var(--text-secondary)]">Owner: {task.owner}</div>
            <div className="text-xs text-[var(--text-secondary)]">{task.due}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ExperimentsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <TrendingUp className="h-4 w-4 text-[var(--color-blue-80)]" />
        Experiment outcomes
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {experimentHighlights.map((experiment) => (
          <div key={experiment.id} className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-5 shadow-sm space-y-2">
            <div className="text-sm font-semibold text-[var(--text-primary)]">{experiment.title}</div>
            <p className="text-sm text-[var(--text-secondary)]">{experiment.result}</p>
            <div className="text-xs uppercase tracking-wide text-[var(--color-blue-80)]">Next step</div>
            <p className="text-sm text-[var(--text-secondary)]">{experiment.nextStep}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function TeamSignalsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        Team signals
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {teamSignals.map((signal) => (
          <div key={signal.id} className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-5 shadow-sm space-y-2">
            <div className="text-sm font-semibold text-[var(--text-primary)]">{signal.title}</div>
            <div className="text-2xl font-semibold text-[var(--text-primary)]">{signal.metric}</div>
            <div className="text-xs text-[var(--color-blue-80)]">{signal.trend}</div>
            <p className="text-sm text-[var(--text-secondary)]">{signal.notes}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
