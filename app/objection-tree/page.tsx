'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Filter,
  Flame,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

import { getObjectionClusters, type ObjectionCluster } from '@/lib/data/objections'

type PersonaFilter = 'ALL' | string
type MotionFilter = 'ALL' | 'Leads' | 'Renewals'

export default function ObjectionTreePage() {
  const clusters = useMemo(() => getObjectionClusters(), [])
  const [personaFilter, setPersonaFilter] = useState<PersonaFilter>('ALL')
  const [motionFilter, setMotionFilter] = useState<MotionFilter>('ALL')

  const personas = useMemo(
    () => ['ALL', ...new Set(clusters.flatMap((cluster) => cluster.personas))],
    [clusters]
  )

  const filteredClusters = useMemo(() => {
    return clusters.filter((cluster) => {
      if (personaFilter !== 'ALL' && !cluster.personas.includes(personaFilter)) return false
      if (motionFilter !== 'ALL' && !cluster.motions.includes(motionFilter)) return false
      return true
    })
  }, [clusters, personaFilter, motionFilter])

  const metrics = useMemo(() => {
    const total = filteredClusters.length
    const highSeverity = filteredClusters.filter((cluster) => cluster.severity === 'high').length
    const emerging = filteredClusters.filter((cluster) => cluster.severity === 'emerging').length
    const rising = filteredClusters.filter((cluster) => cluster.changePct > 10).length
    return { total, highSeverity, emerging, rising }
  }, [filteredClusters])

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-8 space-y-4">
          <h1 className="text-3xl font-semibold">Objection Tree Command</h1>
          <p className="text-[var(--color-blue-20)]">
            Track what customers push back on, see what’s winning, and launch the right playbook instantly.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <SummaryStrip metrics={metrics} />

        <FiltersBar
          personaFilter={personaFilter}
          motionFilter={motionFilter}
          personas={personas}
          onPersonaChange={setPersonaFilter}
          onMotionChange={setMotionFilter}
        />

        <ObjectionRadar clusters={filteredClusters} />
      </div>
    </div>
  )
}

function SummaryStrip({
  metrics,
}: {
  metrics: { total: number; highSeverity: number; emerging: number; rising: number }
}) {
  const items = [
    {
      title: 'Active clusters',
      value: metrics.total.toString(),
      caption: 'Across filters',
      icon: <Flame className="h-5 w-5 text-[var(--color-blue-80)]" />,
    },
    {
      title: 'High severity',
      value: metrics.highSeverity.toString(),
      caption: 'Immediate prep needed',
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
    },
    {
      title: 'Emerging',
      value: metrics.emerging.toString(),
      caption: 'Watch list',
      icon: <Sparkles className="h-5 w-5 text-[var(--color-blue-80)]" />,
    },
    {
      title: 'Trending up',
      value: metrics.rising.toString(),
      caption: '>10% increase week over week',
      icon: <TrendingUp className="h-5 w-5 text-[var(--color-blue-80)]" />,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
            {item.icon}
            {item.caption}
          </div>
          <div className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">{item.value}</div>
          <div className="text-sm text-[var(--text-secondary)]">{item.title}</div>
        </div>
      ))}
    </div>
  )
}

function FiltersBar({
  personaFilter,
  motionFilter,
  personas,
  onPersonaChange,
  onMotionChange,
}: {
  personaFilter: PersonaFilter
  motionFilter: MotionFilter
  personas: string[]
  onPersonaChange: (value: PersonaFilter) => void
  onMotionChange: (value: MotionFilter) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-4 shadow-sm">
      <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
        <Filter className="h-4 w-4" />
        Filters
      </div>
      <select
        value={personaFilter}
        onChange={(event) => onPersonaChange(event.target.value)}
        className="rounded border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      >
        {personas.map((persona) => (
          <option key={persona} value={persona}>
            {persona === 'ALL' ? 'All personas' : persona}
          </option>
        ))}
      </select>
      <select
        value={motionFilter}
        onChange={(event) => onMotionChange(event.target.value as MotionFilter)}
        className="rounded border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      >
        <option value="ALL">All motions</option>
        <option value="Leads">Leads</option>
        <option value="Renewals">Renewals</option>
      </select>
    </div>
  )
}

function ObjectionRadar({ clusters }: { clusters: ObjectionCluster[] }) {
  if (clusters.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border-subtle)]/70 bg-white p-6 text-sm text-[var(--text-secondary)] shadow-sm">
        No objection clusters match your filters right now.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {clusters.map((cluster) => (
        <Link
          key={cluster.id}
          href={`/objection-tree/${cluster.id}`}
          className="block rounded-2xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{cluster.title}</h2>
                <SeverityBadge level={cluster.severity} />
              </div>
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
            </div>
            <div className="flex flex-col items-start gap-2 text-sm text-[var(--text-secondary)] md:items-end">
              <span className="rounded-full bg-[var(--color-blue-10)] px-3 py-1 font-medium text-[var(--color-blue-80)]">
                {cluster.frequency} mentions
              </span>
              <span className={`inline-flex items-center gap-1 text-xs uppercase tracking-wide ${cluster.changePct >= 0 ? 'text-red-600' : 'text-[var(--color-blue-80)]'}`}>
                {cluster.changePct >= 0 ? '+' : ''}{cluster.changePct}% vs last 30d
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function SeverityBadge({ level }: { level: ObjectionCluster['severity'] }) {
  const styles = {
    high: 'bg-red-50 text-red-600 border-red-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    emerging: 'bg-[var(--color-blue-10)] text-[var(--color-blue-80)] border-[var(--color-blue-20)]',
  }[level]

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${styles}`}>
      {level === 'emerging' ? <Sparkles className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
      {level.toUpperCase()}
    </span>
  )
}
