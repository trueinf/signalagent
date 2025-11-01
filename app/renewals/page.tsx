'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  CalendarDays,
  Filter,
  GaugeCircle,
  Sparkles,
  TrendingDown,
  Users,
} from 'lucide-react'

import { getRenewalAccounts, type RenewalAccount } from '@/lib/data/renewals'

type RiskFilter = 'ALL' | 'high' | 'medium' | 'low'

export default function RenewalsPage() {
  const accounts = useMemo(() => getRenewalAccounts(), [])
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('ALL')
  const [ownerFilter, setOwnerFilter] = useState<string>('ALL')

  const owners = useMemo(
    () => ['ALL', ...new Set(accounts.map((account) => account.owner))],
    [accounts]
  )

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      if (riskFilter !== 'ALL' && account.riskLevel !== riskFilter) return false
      if (ownerFilter !== 'ALL' && account.owner !== ownerFilter) return false
      return true
    })
  }, [accounts, riskFilter, ownerFilter])

  const metrics = useMemo(() => {
    const totalArr = filteredAccounts.reduce((sum, account) => sum + account.arr, 0)
    const arrAtRisk = filteredAccounts
      .filter((account) => account.riskLevel === 'high')
      .reduce((sum, account) => sum + account.arr, 0)
    const nearTerm = filteredAccounts.filter((account) => account.daysToRenewal <= 30).length
    const touchGaps = filteredAccounts.filter((account) => account.lastTouchDays > 7).length
    return {
      totalArr,
      arrAtRisk,
      nearTerm,
      touchGaps,
    }
  }, [filteredAccounts])

  const groupedAccounts = useMemo(() => {
    return {
      near: filteredAccounts.filter((account) => account.daysToRenewal <= 30),
      mid: filteredAccounts.filter(
        (account) => account.daysToRenewal > 30 && account.daysToRenewal <= 60
      ),
      future: filteredAccounts.filter((account) => account.daysToRenewal > 60),
    }
  }, [filteredAccounts])

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-8 space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Renewals Command</h1>
              <p className="text-[var(--color-blue-20)]">
                Signal fuses Microsoft telemetry with renewal best practices to keep saves on track.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[var(--color-blue-10)]">
              <Sparkles className="h-4 w-4" />
              Agentic guidance active
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
        <SummaryStrip metrics={metrics} />

        <FiltersBar
          riskFilter={riskFilter}
          ownerFilter={ownerFilter}
          owners={owners}
          onRiskChange={setRiskFilter}
          onOwnerChange={setOwnerFilter}
        />

        <RenewalRadar grouped={groupedAccounts} />
      </div>
    </div>
  )
}

function SummaryStrip({
  metrics,
}: {
  metrics: {
    totalArr: number
    arrAtRisk: number
    nearTerm: number
    touchGaps: number
  }
}) {
  const items = [
    {
      title: 'ARR in scope',
      value: formatCurrency(metrics.totalArr),
      icon: <GaugeCircle className="h-5 w-5 text-[var(--color-blue-80)]" />,
      caption: 'Filtered renewals',
    },
    {
      title: 'ARR at risk',
      value: formatCurrency(metrics.arrAtRisk),
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      caption: 'High-risk accounts',
    },
    {
      title: 'Renewing < 30 days',
      value: metrics.nearTerm.toString(),
      icon: <CalendarDays className="h-5 w-5 text-[var(--color-blue-80)]" />,
      caption: 'Near-term saves',
    },
    {
      title: 'Needs touch',
      value: metrics.touchGaps.toString(),
      icon: <Users className="h-5 w-5 text-[var(--color-blue-80)]" />,
      caption: '>7 days since last contact',
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
  riskFilter,
  ownerFilter,
  owners,
  onRiskChange,
  onOwnerChange,
}: {
  riskFilter: RiskFilter
  ownerFilter: string
  owners: string[]
  onRiskChange: (value: RiskFilter) => void
  onOwnerChange: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-4 shadow-sm">
      <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
        <Filter className="h-4 w-4" />
        Filters
      </div>
      <select
        value={riskFilter}
        onChange={(event) => onRiskChange(event.target.value as RiskFilter)}
        className="rounded border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      >
        <option value="ALL">All risk levels</option>
        <option value="high">High risk</option>
        <option value="medium">Medium risk</option>
        <option value="low">Low risk</option>
      </select>
      <select
        value={ownerFilter}
        onChange={(event) => onOwnerChange(event.target.value)}
        className="rounded border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
      >
        {owners.map((owner) => (
          <option key={owner} value={owner}>
            {owner === 'ALL' ? 'All owners' : owner}
          </option>
        ))}
      </select>
    </div>
  )
}

function RenewalRadar({
  grouped,
}: {
  grouped: { near: RenewalAccount[]; mid: RenewalAccount[]; future: RenewalAccount[] }
}) {
  const buckets = [
    {
      title: 'Urgent • 0–30 days',
      description: 'High-impact saves that expire within the month.',
      accounts: grouped.near,
    },
    {
      title: 'Upcoming • 31–60 days',
      description: 'Active negotiations and prep tracks underway.',
      accounts: grouped.mid,
    },
    {
      title: 'Future • 60+ days',
      description: 'Pipeline coverage and strategic renewals to line up.',
      accounts: grouped.future,
    },
  ]

  return (
    <div className="space-y-6">
      {buckets.map((bucket) => (
        <section key={bucket.title} className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{bucket.title}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{bucket.description}</p>
          </div>
          <div className="space-y-3">
            {bucket.accounts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-[var(--border-subtle)]/80 bg-white p-4 text-sm text-[var(--text-secondary)]">
                No renewals in this horizon.
              </div>
            ) : (
              bucket.accounts.map((account) => (
                <RenewalCard key={account.id} account={account} />
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

function RenewalCard({ account }: { account: RenewalAccount }) {
  const riskBadge = {
    high: 'bg-red-50 text-red-600 border-red-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    low: 'bg-green-50 text-green-700 border-green-200',
  }[account.riskLevel]

  return (
    <Link
      href={`/renewals/${account.id}`}
      className="block rounded-2xl border border-[var(--border-subtle)]/70 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{account.company}</h3>
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${riskBadge}`}>
              {account.riskLevel.toUpperCase()} RISK
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {account.primaryProduct} • {account.region}
          </p>
          <p className="text-sm text-[var(--text-primary)]">
            {account.execSummary}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 text-sm text-[var(--text-secondary)] md:items-end">
          <div className="rounded-full bg-[var(--color-blue-10)] px-3 py-1 font-medium text-[var(--color-blue-80)]">
            {formatCurrency(account.arr)} ARR
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Renewing in {account.daysToRenewal} days
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            {account.usageTrend.summary}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
        {account.signals.slice(0, 3).map((signal, idx) => (
          <span key={`${account.id}-signal-${idx}`} className="rounded-full bg-[var(--color-blue-10)] px-2 py-1">
            {signal}
          </span>
        ))}
      </div>
    </Link>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: amount >= 1000000 ? 1 : 0,
  }).format(amount)
}
