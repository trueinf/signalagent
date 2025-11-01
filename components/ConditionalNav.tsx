'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

import TopNav from '@/components/TopNav'

export default function ConditionalNav() {
  const pathname = usePathname()
  const showNav = useMemo(() => pathname !== '/', [pathname])

  if (!showNav) return null

  return <TopNav />
}
