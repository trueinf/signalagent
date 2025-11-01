import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AlertTriangle, ArrowLeft, Calculator, Sparkles } from 'lucide-react'

import { getRenewalAccountById } from '@/lib/data/renewals'

interface EngageQuotePageProps {
  params: {
    id: string
  }
}

export default function EngageQuotePage({ params }: EngageQuotePageProps) {
  const account = getRenewalAccountById(params.id)

  if (!account) {
    notFound()
  }

  const baseArr = account.arr
  const loyaltyIncentive = baseArr * 0.05
  const phasedOffer = baseArr * 0.45

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-4xl px-6 py-8 space-y-4">
          <Link
            href={`/renewals/${account.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-20)] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to renewal brief
          </Link>
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-semibold">Quote Builder</h1>
              <p className="text-[var(--color-blue-20)]">
                Craft Signal-recommended offers before submitting to Deal Desk.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-blue-10)] px-3 py-1 text-sm font-medium text-[var(--color-blue-80)]">
            <Sparkles className="h-4 w-4" />
            Signal recommendation
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Pair value narrative with loyalty incentive tied to adoption milestones. Offer service credits instead of a flat discount to preserve ARR.
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Offer options</h2>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <div className="rounded-xl bg-[var(--color-blue-10)]/40 px-4 py-3">
              <div className="font-semibold text-[var(--text-primary)]">Option A: Loyalty incentive</div>
              <p>5% service credits applied to adoption workshops (≈ {formatCurrency(loyaltyIncentive)}).</p>
            </div>
            <div className="rounded-xl bg-[var(--color-blue-10)]/40 px-4 py-3">
              <div className="font-semibold text-[var(--text-primary)]">Option B: Phased pricing</div>
              <p>
                Phase 1 at {formatCurrency(phasedOffer)} tied to remediation milestones, remaining value on completion. Keeps margin while rewarding progress.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3 text-sm text-[var(--text-secondary)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Approval checklist</h2>
          <ul className="space-y-2">
            <li>• Confirm executive alignment: {account.readiness.execAlignment}</li>
            <li>• Attach ROI benchmark sheet for finance review.</li>
            <li>• Log concession rationale in Dynamics before submitting to Deal Desk.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Risk call-outs</h2>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            <AlertTriangle className="h-3 w-3" />
            Usage drop
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {account.usageTrend.summary}. Ensure adoption plan is signed in parallel with the quote to de-risk churn.
          </p>
        </section>
      </div>
    </div>
  )
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}
