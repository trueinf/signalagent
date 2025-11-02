import { Lead, SourceType, Industry, BuyerRole, LeadStatus } from '@prisma/client'

export const hardcodedLeads: Lead[] = [
  {
    id: 'cmhgkg87p0000s4rv2gh3w3z7',
    name: 'Amanda Brady',
    email: 'amanda.brady@lakeshore.com',
    phone: null,
    company: 'Lakeshore Retail',
    contactTitle: 'VP of IT',
    status: LeadStatus.NEW,
    source: 'Azure Trial started 2 days ago',
    sourceType: SourceType.TRIAL,
    industry: Industry.RETAIL,
    buyerRole: BuyerRole.IT_ADMIN,
    intentScore: 91,
    signalTrail: JSON.stringify([
      'Deployed 3 Azure VMs',
      'Opened Azure pricing page twice in 48 hours',
    ]),
    aiInsight: 'High fit and strong signal velocity. Retail profile. Matches 3 recent Azure closes.',
    notes: null,
    lastSyncedAt: null,
    createdAt: new Date('2025-11-01T17:38:38.101Z'),
    updatedAt: new Date('2025-11-01T17:38:38.101Z'),
  },
  {
    id: 'cmhgkg87u0003s4rvu8waf98e',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.com',
    phone: null,
    company: 'TechCorp Solutions',
    contactTitle: 'Finance Head',
    status: LeadStatus.NEW,
    source: 'Azure Trial started 1 day ago',
    sourceType: SourceType.TRIAL,
    industry: Industry.FINANCE,
    buyerRole: BuyerRole.FINANCE_HEAD,
    intentScore: 88,
    signalTrail: JSON.stringify([
      'Created Azure subscription',
      'Deployed production workload',
      'Accessed cost management dashboard',
    ]),
    aiInsight: 'Strong Azure engagement with financial oversight. High conversion probability.',
    notes: null,
    lastSyncedAt: null,
    createdAt: new Date('2025-11-01T17:38:38.107Z'),
    updatedAt: new Date('2025-11-01T17:38:38.107Z'),
  },
  {
    id: 'cmhgkg87t0001s4rvo19bz9f0',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@medisoft.com',
    phone: null,
    company: 'Medisoft Diagnostics',
    contactTitle: 'IT Admin',
    status: LeadStatus.NEW,
    source: 'Downloaded "Copilot for Healthcare" guide',
    sourceType: SourceType.CAMPAIGN_DOWNLOAD,
    industry: Industry.HEALTHCARE,
    buyerRole: BuyerRole.IT_ADMIN,
    intentScore: 76,
    signalTrail: JSON.stringify([
      'Attended 46 minutes of Copilot webinar, no form filled',
    ]),
    aiInsight: 'Passive interest from IT buyer. Suggest email first, then assess intent.',
    notes: null,
    lastSyncedAt: null,
    createdAt: new Date('2025-11-01T17:38:38.107Z'),
    updatedAt: new Date('2025-11-01T17:38:38.107Z'),
  },
  {
    id: 'cmhgkg87u0002s4rvpok7i9mm',
    name: 'Jordan Smith',
    email: 'jordan.smith@pathbridge.com',
    phone: null,
    company: 'PathBridge Logistics',
    contactTitle: 'CFO',
    status: LeadStatus.NEW,
    source: 'Microsoft campaign email open',
    sourceType: SourceType.CAMPAIGN_EMAIL,
    industry: Industry.LOGISTICS,
    buyerRole: BuyerRole.CEO,
    intentScore: 65,
    signalTrail: JSON.stringify([
      'Opened 1 campaign email; clicked case study but no download',
    ]),
    aiInsight: 'Finance contact, no strong signal. Recommends nurture track unless new activity observed.',
    notes: null,
    lastSyncedAt: null,
    createdAt: new Date('2025-11-01T17:38:38.107Z'),
    updatedAt: new Date('2025-11-01T17:38:38.107Z'),
  },
  {
    id: 'cmhgkg87v0004s4rvjey2xi9o',
    name: 'Michael Torres',
    email: 'michael.torres@eduflow.com',
    phone: null,
    company: 'EduFlow Academy',
    contactTitle: 'Procurement',
    status: LeadStatus.NEW,
    source: 'Attended "Education Solutions" webinar',
    sourceType: SourceType.WEBINAR,
    industry: Industry.EDUCATION,
    buyerRole: BuyerRole.PROCUREMENT,
    intentScore: 72,
    signalTrail: JSON.stringify([
      'Watched full 60-minute webinar',
      'Downloaded education pricing sheet',
    ]),
    aiInsight: 'Procurement contact showing budget interest. Follow up with educational pricing.',
    notes: null,
    lastSyncedAt: null,
    createdAt: new Date('2025-11-01T17:38:38.107Z'),
    updatedAt: new Date('2025-11-01T17:38:38.107Z'),
  },
]

export function getFilteredLeads(filters: {
  sourceType?: string
  industry?: string
  buyerRole?: string
  search?: string
}): Lead[] {
  let filtered = [...hardcodedLeads]

  if (filters.sourceType && filters.sourceType !== 'ALL') {
    filtered = filtered.filter(lead => lead.sourceType === filters.sourceType)
  }

  if (filters.industry && filters.industry !== 'ALL') {
    filtered = filtered.filter(lead => lead.industry === filters.industry)
  }

  if (filters.buyerRole && filters.buyerRole !== 'ALL') {
    filtered = filtered.filter(lead => lead.buyerRole === filters.buyerRole)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      lead =>
        lead.company?.toLowerCase().includes(searchLower) ||
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower)
    )
  }

  return filtered.sort((a, b) => {
    const scoreA = a.intentScore ?? 0
    const scoreB = b.intentScore ?? 0
    if (scoreA !== scoreB) {
      return scoreB - scoreA
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }) as Lead[]
}

export function getLeadStats() {
  const leads = hardcodedLeads
  
  const high = leads.filter(l => (l.intentScore ?? 0) >= 85).length
  const medium = leads.filter(l => {
    const score = l.intentScore ?? 0
    return score >= 70 && score < 85
  }).length
  const low = leads.filter(l => (l.intentScore ?? 0) < 70).length

  const sourceBreakdown: Record<string, number> = {}
  leads.forEach(lead => {
    const source = lead.sourceType || 'UNCLASSIFIED'
    sourceBreakdown[source] = (sourceBreakdown[source] || 0) + 1
  })

  return {
    priority: { high, medium, low },
    sources: sourceBreakdown,
  }
}

