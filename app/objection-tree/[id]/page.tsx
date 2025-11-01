import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Flame, Sparkles, TrendingUp } from 'lucide-react'

import ObjectionWorkspace from '@/components/objections/ObjectionWorkspace'
import { getObjectionClusterById } from '@/lib/data/objections'

interface ObjectionDetailPageProps {
  params: {
    id: string
  }
}

export default function ObjectionDetailPage({ params }: ObjectionDetailPageProps) {
  const cluster = getObjectionClusterById(params.id)

  if (!cluster) {
    notFound()
  }

  const workspaceProps = {
    cluster: {
      id: cluster.id,
      title: cluster.title,
      severity: cluster.severity,
      frequency: cluster.frequency,
      changePct: cluster.changePct,
      personas: cluster.personas,
      motions: cluster.motions,
      summary: cluster.summary,
      signals: cluster.signals,
    },
    recommendedActions: cluster.recommendedActions,
    playbook: cluster.playbook,
    assets: cluster.assets,
    winStories: cluster.winStories,
    metrics: cluster.metrics,
    quickActions: cluster.quickActions,
    learningPrompts: cluster.learningPrompts,
  }

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-5xl px-6 py-8 space-y-4">
          <Link
            href="/objection-tree"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-20)] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to objection radar
          </Link>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[var(--color-blue-20)]">
                {cluster.severity === 'emerging' ? (
                  <Sparkles className="h-3 w-3" />
                ) : (
                  <Flame className="h-3 w-3" />
                )}
                {cluster.severity.toUpperCase()} SEVERITY
              </div>
              <h1 className="text-3xl font-semibold">{cluster.title}</h1>
              <p className="text-[var(--color-blue-20)] max-w-2xl">
                {cluster.summary}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 text-sm text-[var(--color-blue-20)] lg:items-end">
              <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white">
                {cluster.frequency} mentions last 30 days
              </span>
              <span className="inline-flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${cluster.changePct >= 0 ? 'text-red-300' : 'text-[var(--color-blue-20)]'}`} />
                {cluster.changePct >= 0 ? '+' : ''}{cluster.changePct}% trend vs prior
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <ObjectionWorkspace {...workspaceProps} />
      </div>
    </div>
  )
}
