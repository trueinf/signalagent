export interface RenewalAccount {
  id: string
  company: string
  arr: number
  renewalDate: string
  daysToRenewal: number
  riskLevel: 'high' | 'medium' | 'low'
  healthScore: number
  primaryProduct: string
  region: string
  owner: string
  lastTouchDays: number
  execSummary: string
  usageTrend: {
    changePct: number
    summary: string
    coverage: string
  }
  signals: string[]
  recommendedActions: string[]
  readiness: {
    execAlignment: string
    adoptionPlan: string
    commercialOffer: string
  }
  talkTrack: {
    opening: string
    agenda: string[]
    valueStory: string
    negotiation: string
    closing: string
  }
  objectionHandling: {
    title: string
    response: string
    asset: string
  }[]
  checklist: {
    title: string
    due: string
    owner: string
    status: 'Open' | 'In Progress' | 'Done'
  }[]
  caseStudies: {
    title: string
    takeaway: string
  }[]
  usageHighlights: {
    label: string
    value: string
    trend: string
  }[]
}

export const renewalAccounts: RenewalAccount[] = [
  {
    id: 'contoso-manufacturing',
    company: 'Contoso Manufacturing',
    arr: 1200000,
    renewalDate: '2024-06-15',
    daysToRenewal: 26,
    riskLevel: 'high',
    healthScore: 42,
    primaryProduct: 'Azure AI + Dynamics 365',
    region: 'North America',
    owner: 'Karen Blake',
    lastTouchDays: 9,
    execSummary:
      'CFO wants proof of AI productivity gains before renewing $1.2M contract. Sponsor left in May; usage fell sharply.',
    usageTrend: {
      changePct: -28,
      summary: 'Copilot usage down 28% in last 30 days after sponsor departure.',
      coverage: '42% of licenses active weekly',
    },
    signals: [
      'Executive sponsor left 3 weeks ago',
      'Usage drop flagged by telemetry',
      'Finance team asked for new ROI benchmarks',
    ],
    recommendedActions: [
      'Secure CFO checkpoint with updated ROI model',
      'Invite Azure architect to reframe deployment scope',
      'Share retail-focused adoption plan and success metrics',
    ],
    readiness: {
      execAlignment: 'Need CFO alignment on ROI model',
      adoptionPlan: 'Draft prepared by FastTrack team',
      commercialOffer: 'Awaiting discount approval',
    },
    talkTrack: {
      opening:
        'Hi team, let’s align on the productivity outcomes you expected versus what we’ve seen, then map the playbook to recover usage.',
      agenda: [
        'Review outcome metrics Finance is tracking',
        'Walk through Copilot usage and productivity benchmarks',
        'Propose adoption sprint and sponsorship plan',
      ],
      valueStory:
        'Similar retail customers regained 30% productivity by pairing Copilot with the hybrid benefit pricing model—let’s map that to your workflows.',
      negotiation: 'Offer 5% loyalty incentive tied to adoption milestones and FastTrack-led refresh.',
      closing:
        'Schedule the architecture workshop early next week—Tuesday or Wednesday afternoon—to lock deployment and finalize the renewal.',
    },
    objectionHandling: [
      {
        title: '“Copilot cost is too high for current usage.”',
        response:
          'Hybrid benefit scenario reduces net spend by 28% when we optimize license mix. Let’s review the finance-ready model from Contoso’s renewal.',
        asset: 'ROI calculator + finance one-pager',
      },
      {
        title: '“Engineering can’t restart deployment right now.”',
        response:
          'FastTrack handles the heavy lifting. Northwind Traders had a five-person crew and still went live in under three weeks.',
        asset: 'FastTrack deployment outline',
      },
    ],
    checklist: [
      { title: 'Share ROI benchmarks with CFO', due: 'Due tomorrow', owner: 'Karen Blake', status: 'In Progress' },
      { title: 'Schedule architecture review', due: 'Due in 2 days', owner: 'Azure Architect', status: 'Open' },
      { title: 'Update EA quote with loyalty incentive', due: 'Due in 5 days', owner: 'Deal Desk', status: 'Open' },
    ],
    caseStudies: [
      { title: 'Contoso Retail saved $1.1M via hybrid benefit', takeaway: 'Used ROI sheet + FastTrack sprint to close in 18 days.' },
      { title: 'Northwind Traders regained 30% usage', takeaway: 'Executive alignment + architecture workshop accelerated renewal.' },
    ],
    usageHighlights: [
      { label: 'Seats active', value: '420 / 1,000', trend: 'Down 11% MoM' },
      { label: 'Copilot prompts/day', value: '6,200', trend: '-18% vs. target' },
      { label: 'Support tickets', value: '4 open', trend: 'Need escalation' },
    ],
  },
  {
    id: 'fabrikam-finance',
    company: 'Fabrikam Finance',
    arr: 840000,
    renewalDate: '2024-07-08',
    daysToRenewal: 49,
    riskLevel: 'medium',
    healthScore: 63,
    primaryProduct: 'Microsoft 365 E5 + Copilot',
    region: 'EMEA',
    owner: 'Marisol Chen',
    lastTouchDays: 4,
    execSummary:
      'Usage steady but procurement negotiating price decrease. Need executive story and roadmap to justify current rate.',
    usageTrend: {
      changePct: 6,
      summary: 'Copilot adoption up 6% MoM after enablement sprint.',
      coverage: '68% of Copilot seats active',
    },
    signals: [
      'Procurement requested 10% reduction',
      'CFO attending next business review',
      'New security features rolled out last month',
    ],
    recommendedActions: [
      'Prep executive narrative for CFO review',
      'Bundle security feature roadmap into renewal',
      'Log quantified productivity gains from pilot teams',
    ],
    readiness: {
      execAlignment: 'CFO review scheduled for next Tuesday',
      adoptionPlan: 'Usage success stories documented',
      commercialOffer: 'Counter-proposal drafted',
    },
    talkTrack: {
      opening: 'Thanks for inviting us to Tuesday’s review—let’s align on the impact Copilot has delivered and the roadmap ahead.',
      agenda: ['Recap productivity metrics and security wins', 'Discuss licensing optimization', 'Agree on renewal timeline'],
      valueStory: 'Finance processing time dropped 19% with Copilot; let’s show how the upcoming compliance features expand that impact.',
      negotiation: 'Offer service credits tied to new security modules instead of cash discount.',
      closing: 'Confirm renewal paperwork by June 25 so procurement can finalize terms.',
    },
    objectionHandling: [
      {
        title: '“Need a price reduction to align with budget.”',
        response: 'Suggest value-based trade: keep rate, include service credits and security roadmap to reduce risk costs.',
        asset: 'Executive briefing deck',
      },
      {
        title: '“Unsure if Copilot usage is widespread enough.”',
        response: 'Share the productivity KPI dashboard and highlight departments exceeding targets.',
        asset: 'Copilot KPI dashboard',
      },
    ],
    checklist: [
      { title: 'Finalize executive brief deck', due: 'Due in 1 day', owner: 'Marisol Chen', status: 'In Progress' },
      { title: 'Align with security specialist on roadmap', due: 'Due in 3 days', owner: 'Security Specialist', status: 'Open' },
      { title: 'Update quote with service credits', due: 'Due in 5 days', owner: 'Deal Desk', status: 'Open' },
    ],
    caseStudies: [
      { title: 'Fabrikam APAC renewal', takeaway: 'Secured renewal by pairing M365 with security roadmap deliverables.' },
      { title: 'Contoso Finance renewal', takeaway: 'Executive CFO workshop sealed renewal at list price.' },
    ],
    usageHighlights: [
      { label: 'Copilot adoption', value: '68%', trend: '+6% MoM' },
      { label: 'Security incidents', value: '0 in 90 days', trend: 'Improved' },
      { label: 'Executive sessions', value: '2 completed', trend: 'On track' },
    ],
  },
  {
    id: 'northwind-traders',
    company: 'Northwind Traders',
    arr: 560000,
    renewalDate: '2024-08-20',
    daysToRenewal: 92,
    riskLevel: 'medium',
    healthScore: 58,
    primaryProduct: 'Dynamics 365 + Power Platform',
    region: 'North America',
    owner: 'Ibrahim Nassar',
    lastTouchDays: 14,
    execSummary:
      'Power Platform usage uneven; field teams love it, HQ uncertain. Need multi-LOB case for expansion before renewal.',
    usageTrend: {
      changePct: -5,
      summary: 'Power Platform usage slipped 5% after project wrap-up.',
      coverage: '54% active makers',
    },
    signals: [
      'Business sponsor wants expansion plan',
      'Service desk satisfaction at 91%',
      'Copilot in Dynamics pilot running in sales team',
    ],
    recommendedActions: [
      'Share cross-team success stories and quantify pipeline impact',
      'Extend Copilot pilot to HQ, capture testimonial',
      'Schedule adoption workshop for August leadership offsite',
    ],
    readiness: {
      execAlignment: 'Need HQ buy-in to secure budget',
      adoptionPlan: 'Expansion outline drafted',
      commercialOffer: 'Consider multi-year incentive',
    },
    talkTrack: {
      opening: 'Let’s highlight how field ops scaled with Power Platform and map that to HQ priorities.',
      agenda: ['Review success metrics from field teams', 'Discuss HQ blockers', 'Outline expansion roadmap'],
      valueStory: 'Field teams drove 18% faster case resolution; replicating that for HQ is the renewal unlock.',
      negotiation: 'Offer multi-year price lock if HQ commits to expansion plan.',
      closing: 'Align leadership workshop date and set commitment checkpoint by mid-July.',
    },
    objectionHandling: [
      {
        title: '“HQ hasn’t seen the same value yet.”',
        response: 'Propose a co-led workshop featuring field ops metrics; bring in Microsoft Catalyst resources.',
        asset: 'Catalyst workshop playbook',
      },
    ],
    checklist: [
      { title: 'Gather pipeline impact metrics', due: 'Due in 4 days', owner: 'Ibrahim Nassar', status: 'Open' },
      { title: 'Schedule HQ adoption workshop', due: 'Due in 10 days', owner: 'Customer Success', status: 'Open' },
      { title: 'Draft multi-year incentive proposal', due: 'Due in 12 days', owner: 'Deal Desk', status: 'Open' },
    ],
    caseStudies: [
      { title: 'Northwind LATAM expansion', takeaway: 'Expanded via Catalyst workshop + multi-year lock.' },
    ],
    usageHighlights: [
      { label: 'Power Platform apps built', value: '132', trend: '+12 QoQ' },
      { label: 'Copilot pilot users', value: '85', trend: 'Expanding' },
      { label: 'Support CSAT', value: '91%', trend: '+4 pts' },
    ],
  },
  {
    id: 'adventure-works',
    company: 'Adventure Works',
    arr: 310000,
    renewalDate: '2024-05-30',
    daysToRenewal: 10,
    riskLevel: 'high',
    healthScore: 37,
    primaryProduct: 'Microsoft 365 E3 + Defender',
    region: 'APAC',
    owner: 'Ravi Patel',
    lastTouchDays: 3,
    execSummary:
      'Security incident last quarter triggered compliance review. Renewal hinges on mitigation plan and pricing relief.',
    usageTrend: {
      changePct: -12,
      summary: 'Defender alerts resolved but adoption still lagging.',
      coverage: '61% secure score',
    },
    signals: [
      'Compliance audit pending',
      'CISO wants improved secure score',
      'Finance negotiating short-term relief',
    ],
    recommendedActions: [
      'Deliver security remediation roadmap',
      'Bundle compliance assessment with renewal',
      'Propose phased pricing tied to secure score improvements',
    ],
    readiness: {
      execAlignment: 'CISO aligned; need CFO sign-off',
      adoptionPlan: 'Security remediation tasks tracked',
      commercialOffer: 'Proposal includes phased pricing',
    },
    talkTrack: {
      opening: 'Let’s close the loop on the compliance review and map Defender remediation to your audit timeline.',
      agenda: ['Review remediation progress', 'Align on secure score goals', 'Discuss phased renewal offer'],
      valueStory: 'Similar customers improved secure score by 18 points in 45 days with the paired assessment.',
      negotiation: 'Offer phased pricing tied to secure score improvements.',
      closing: 'Confirm renewal paperwork by May 24 so audit team can certify controls.',
    },
    objectionHandling: [
      {
        title: '“Need pricing relief during remediation.”',
        response: 'Propose phased pricing tied to secure score improvements rather than flat discount.',
        asset: 'Secure score remediation plan',
      },
      {
        title: '“Unsure remediation will finish before audit.”',
        response: 'FastTrack security squad ready to co-own the plan—share the 6-week playbook used for Fabrikam APAC.',
        asset: 'Security remediation playbook',
      },
    ],
    checklist: [
      { title: 'Finalize remediation milestones with CISO', due: 'Due tomorrow', owner: 'Ravi Patel', status: 'In Progress' },
      { title: 'Share phased pricing proposal', due: 'Due in 1 day', owner: 'Deal Desk', status: 'Open' },
      { title: 'Deliver compliance assessment pack', due: 'Due in 3 days', owner: 'FastTrack Security', status: 'Open' },
    ],
    caseStudies: [
      { title: 'Adventure Works EMEA renewal', takeaway: 'Saved renewal by tying pricing to secure score improvements.' },
      { title: 'Tailwind Security turnaround', takeaway: 'Combined remediation roadmap with compliance workshops.' },
    ],
    usageHighlights: [
      { label: 'Secure score', value: '61', trend: '+6 since April' },
      { label: 'High-priority alerts', value: '2 open', trend: 'Down from 7' },
      { label: 'Audit deadline', value: 'June 12', trend: 'Red' },
    ],
  },
]

export function getRenewalAccounts() {
  return renewalAccounts
}

export function getRenewalAccountById(id: string) {
  return renewalAccounts.find((account) => account.id === id)
}
