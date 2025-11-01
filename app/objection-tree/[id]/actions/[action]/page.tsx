import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ClipboardPen, Sparkles } from 'lucide-react'

import { getObjectionClusterById } from '@/lib/data/objections'

interface ObjectionActionPageProps {
  params: {
    id: string
    action: string
  }
}

const actionTitles: Record<string, string> = {
  rebuttal: 'Tailored Rebuttal Generator',
  evidence: 'Evidence Pack Composer',
  log: 'Log New Variant',
  sprint: 'Adoption Sprint Launch',
  workshop: 'Champion Workshop Scheduler',
  dashboard: 'Usage Dashboard Export',
  remediation: 'Security Remediation Plan',
  compliance: 'Compliance Dossier Builder',
  specialist: 'Engage Security Specialist',
  pilot: '30-day Pilot Plan Builder',
  email: 'Executive Email Draft',
  success: 'Success Story Share',
}

export default function ObjectionActionPage({ params }: ObjectionActionPageProps) {
  const cluster = getObjectionClusterById(params.id)
  if (!cluster) {
    notFound()
  }

  const title = actionTitles[params.action] ?? 'Signal Action'

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-4xl px-6 py-8 space-y-4">
          <Link
            href={`/objection-tree/${cluster.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-blue-20)] hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {cluster.title}
          </Link>
          <div className="flex items-center gap-3">
            <ClipboardPen className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-semibold">{title}</h1>
              <p className="text-[var(--color-blue-20)]">
                Powered by Signal – helping you respond to “{cluster.title}”.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
        <div className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-blue-10)] px-3 py-1 text-sm font-medium text-[var(--color-blue-80)]">
            <Sparkles className="h-4 w-4" />
            Signal guidance
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Capture context from the objection, then tailor the output. When ready, copy to clipboard or send via email/CRM.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Context</h2>
          <textarea
            className="w-full min-h-[140px] rounded-xl border border-[var(--border-subtle)]/70 bg-[var(--color-blue-10)]/40 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
            placeholder="Log customer quotes, stakeholders, and any data mentioned..."
          />
        </div>

        <div className="rounded-2xl border border-[var(--border-subtle)]/60 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Draft output</h2>
          <textarea
            className="w-full min-h-[180px] rounded-xl border border-[var(--border-subtle)]/70 bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
            placeholder="Signal will populate your tailored response or plan here."
          />
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center gap-2 rounded-full bg-[var(--color-blue-90)] px-4 py-2 text-sm font-medium text-white shadow hover:bg-[var(--color-blue-80)]">
              Copy to clipboard
              <ArrowLeft className="hidden" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)]/70 px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--color-blue-10)]/60">
              Export to email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
