'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

const navItems = [
  { name: 'Leads', href: '/leads/prioritized' },
  { name: 'Renewals', href: '/renewals' },
  { name: 'Objection Tree', href: '/objection-tree' },
  { name: 'Insights', href: '/insights' },
]

export default function TopNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="bg-[var(--color-blue-90)] border-b border-[var(--color-blue-80)]">
      <div className="max-w-full mx-auto px-6">
        <div className="flex items-center justify-between h-[4.5rem]">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-semibold text-white">
              Signal
            </Link>
            
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-base font-medium text-white transition-colors ${
                    pathname === item.href || pathname?.startsWith(item.href)
                      ? 'text-[var(--color-blue-20)] border-b-2 border-[var(--color-blue-20)]'
                      : 'hover:text-[var(--color-blue-20)]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  )
}
