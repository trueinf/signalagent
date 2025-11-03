'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Lead } from '@prisma/client'
import LeadCard from '@/components/LeadCard'
import LeadFilters from '@/components/LeadFilters'
import SidebarSummary from '@/components/SidebarSummary'
import { Search, RefreshCw, Clock } from 'lucide-react'
import { getFilteredLeads, getLeadStats, hardcodedLeads } from '@/lib/data/leads'
import { leadEnhancements } from '@/lib/data/leadEnhancements'
import SimilarWinsPanel from '@/components/SimilarWinsPanel'

interface Stats {
  priority: {
    high: number
    medium: number
    low: number
  }
  sources: Record<string, number>
}

export default function PrioritizedLeadsPage() {
  const [lastSynced, setLastSynced] = useState<string>('22 mins ago')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    sourceType: 'ALL',
    industry: 'ALL',
    buyerRole: 'ALL',
    age: 'ALL',
  })
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const router = useRouter()

  const leads = useMemo(() => {
    return getFilteredLeads({
      sourceType: filters.sourceType !== 'ALL' ? filters.sourceType : undefined,
      industry: filters.industry !== 'ALL' ? filters.industry : undefined,
      buyerRole: filters.buyerRole !== 'ALL' ? filters.buyerRole : undefined,
      search: searchQuery || undefined,
    })
  }, [filters, searchQuery])

  const stats = useMemo(() => {
    return getLeadStats()
  }, [])

  const handleRefresh = () => {
    setLastSynced('Just now')
    setTimeout(() => setLastSynced('22 mins ago'), 1000)
  }

  const handleEngage = (leadId: string) => {
    console.log('Engage lead:', leadId)
  }

  const handleViewSimilarWins = (leadId: string) => {
    setSelectedLeadId(leadId)
  }

  const handleMoreDetails = (leadId: string) => {
    router.push(`/leads/${leadId}`)
  }

  const handleCloseSimilarWins = () => {
    setSelectedLeadId(null)
  }

  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null
    return (
      leads.find((lead) => lead.id === selectedLeadId) ||
      hardcodedLeads.find((lead) => lead.id === selectedLeadId) ||
      null
    )
  }, [selectedLeadId, leads])

  const selectedEnhancement = selectedLeadId ? leadEnhancements[selectedLeadId] : undefined

  return (
    <div className="min-h-screen bg-[var(--background-secondary)]">
      <div className="bg-[var(--color-blue-90)] text-white">
        <div className="mx-auto max-w-6xl px-6 py-8 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Today&apos;s Prioritized Leads</h1>
              <p className="text-[var(--color-blue-20)]">
                Signal ranks every lead each morning so you focus first on the contacts most likely to convert.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[var(--color-blue-10)]">
              <Clock className="h-4 w-4" />
              Synced {lastSynced} via Dynamics 365
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        <div>
          <LeadFilters
            filters={filters}
            onFilterChange={(key, value) => {
              setFilters(prev => ({ ...prev, [key]: value }))
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-placeholder)]" />
            <input
              type="text"
              placeholder="Search by company or contact name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-white pl-10 pr-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-80)]"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 rounded bg-[var(--color-blue-90)] px-4 py-2 text-base font-medium text-white hover:bg-[var(--color-blue-80)]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh prioritization
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {leads.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-secondary)]">
                No leads found matching your filters.
              </div>
            ) : (
              <div className="space-y-0">
                {leads.map((lead, index) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    rank={index + 1}
                    enhancement={leadEnhancements[lead.id]}
                    onEngage={handleEngage}
                    onMoreDetails={handleMoreDetails}
                    onViewSimilarWins={handleViewSimilarWins}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <SidebarSummary stats={stats} />
          </div>
        </div>
      </div>
      <SimilarWinsPanel
        open={Boolean(selectedLeadId)}
        lead={selectedLead}
        detail={selectedEnhancement?.similarWins?.detail}
        onClose={handleCloseSimilarWins}
      />
    </div>
  )
}
