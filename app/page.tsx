'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !password) {
      setError('Enter both email and password to continue.')
      return
    }
    router.push('/leads/prioritized')
  }

  return (
    <main className="min-h-screen bg-[var(--background-secondary)]">
      <div className="grid min-h-screen md:grid-cols-2">
        <div className="relative hidden bg-[var(--color-blue-90)] text-white md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue-90)] via-[var(--color-blue-90)] to-[var(--color-blue-80)]" />
          <div className="relative z-10 flex flex-col justify-between p-12">
            <div>
              <div className="text-sm uppercase tracking-wide text-[var(--color-blue-20)]">Signal</div>
              <h1 className="mt-4 text-4xl font-semibold">Lead & Renewal Operating System</h1>
              <p className="mt-4 max-w-md text-[var(--color-blue-20)]">
                Prioritise the right accounts, handle objections with confidence, and rescue renewals faster—all powered by Signal&apos;s agentic AI.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white px-6 py-12 sm:px-10">
          <div className="w-full max-w-sm space-y-8">
            <div className="md:hidden">
              <div className="text-sm uppercase tracking-wide text-[var(--color-blue-80)]">Signal</div>
              <h1 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">Welcome back</h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Sign in to prioritise leads, manage renewals, and control objections.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-base text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[var(--text-primary)]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-lg border border-[var(--border-subtle)] px-3 py-2 text-base text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
                  placeholder="Enter password"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--color-blue-90)] px-4 py-3 text-base font-medium text-white shadow hover:bg-[var(--color-blue-80)]"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
