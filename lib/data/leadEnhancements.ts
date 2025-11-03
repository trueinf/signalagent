export type WorkReadyStatus = 'work-ready' | 'review-first'

export interface ScoreDriver {
  label: string
  delta: number
  context?: string
}

export interface SignalTiming {
  event: string
  decayWarning?: string
}

export interface TagGroup {
  id: string
  label: string
  icon: 'behavior' | 'signal' | 'objection' | 'pattern'
  items: string[]
}

export interface MatchConfidence {
  level: 'High' | 'Medium' | 'Low'
  percent: number
}

export interface SimilarLeadSnapshot {
  id: string
  customer: string
  contact: string
  contactTitle?: string
  source: string
  closedDate: string
  closedBy: string
  keySignals: string[]
  actions: string[]
  outcome: string
  objection?: string
  rebuttal?: string
}

export interface PatternInsight {
  summary: string
  actions?: Array<{
    id: string
    label: string
    intent?: 'primary' | 'secondary'
    note?: string
  }>
}

export interface SimilarWinsDetail {
  matchSummary: string
  matchConfidence?: MatchConfidence
  wins: SimilarLeadSnapshot[]
  patternInsight: PatternInsight
}

export interface SimilarWinsOverview {
  summary: string
  detail?: SimilarWinsDetail
}

export interface LeadEnhancement {
  rankContext?: string
  scoreDrivers: ScoreDriver[]
  workReadyStatus: WorkReadyStatus
  workReadyReason?: string
  signalTiming?: SignalTiming
  tagGroups: TagGroup[]
  similarWins?: SimilarWinsOverview
}

export const leadEnhancements: Record<string, LeadEnhancement> = {
  cmhgkg87p0000s4rv2gh3w3z7: {
    rankContext: 'Highest Azure momentum today',
    scoreDrivers: [
      { label: 'Fresh trial activity (VMs deployed)', delta: 10, context: '3 Azure VMs online and cost alerts configured' },
      { label: 'Viewed pricing page twice', delta: 6 },
      { label: 'Matches retail win pattern', delta: 5, context: 'Nearly identical to October retail closes' },
      { label: 'No form fill captured', delta: -2 },
    ],
    workReadyStatus: 'work-ready',
    workReadyReason: 'Draft outreach email and call script already suggested by Signal.',
    signalTiming: {
      event: 'Trial activated 2 days ago',
      decayWarning: 'Signal drops in value in 48 hrs',
    },
    tagGroups: [
      {
        id: 'lakeshore-behavior',
        label: 'Behavior Pattern',
        icon: 'behavior',
        items: ['Retail win pattern match', 'High trial depth with infrastructure workloads'],
      },
      {
        id: 'lakeshore-signal',
        label: 'Signal Type',
        icon: 'signal',
        items: ['Trial activity', 'Pricing engagement'],
      },
      {
        id: 'lakeshore-objection',
        label: 'Objection Class',
        icon: 'objection',
        items: ['Known objection cluster: Too expensive'],
      },
    ],
    similarWins: {
      summary: 'Matches 3 retail wins closed in under 5 days with pricing-first pitch.',
      detail: {
        matchSummary:
          '3 leads closed in the past 30 days match this one closely: same segment (Retail), similar signal trail (Azure Trial + pricing activity), similar contact role (VP of IT).',
        matchConfidence: { level: 'High', percent: 89 },
        wins: [
          {
            id: 'midtown-retail',
            customer: 'Midtown Retail Group',
            contact: 'Samir Patel',
            contactTitle: 'IT Director',
            source: 'Azure Trial',
            closedDate: 'Oct 15',
            closedBy: 'R. Shah',
            keySignals: [
              'Trial started with 2 VMs',
              'Pricing page + comparison guide opened',
            ],
            actions: [
              'Sent email using “Azure ROI Calculator”',
              'Call scheduled 2 days later',
              'Quote included 15-seat Signal pilot',
            ],
            outcome: 'Closed in 5 days',
            objection: '“Too expensive”',
            rebuttal: 'Responded with “Start with 15-seat Signal pilot, no commitment”',
          },
          {
            id: 'retail-coast',
            customer: 'Retail Coast Collective',
            contact: 'Dana Lee',
            contactTitle: 'VP Technology',
            source: 'Azure Trial',
            closedDate: 'Oct 22',
            closedBy: 'M. Green',
            keySignals: [
              'Scaled trial to 4 VMs within 24 hrs',
              'Downloaded Azure savings plan guide',
            ],
            actions: [
              'Used pricing-first talk track',
              'Shared Signal retail case study',
              'Hosted quick budget workshop',
            ],
            outcome: 'Closed in 6 days',
            objection: '“Budget freeze this quarter”',
            rebuttal: 'Positioned phased rollout with cost-neutral first month',
          },
          {
            id: 'urban-market',
            customer: 'Urban Market Concepts',
            contact: 'Lisa Hernandez',
            contactTitle: 'Director of IT',
            source: 'Azure Trial',
            closedDate: 'Nov 1',
            closedBy: 'C. Patel',
            keySignals: [
              'Trial activated with analytics workload',
              'Pricing emails opened 3 times',
            ],
            actions: [
              'Sent Signal ROI deck',
              'Coordinated follow-up call 36 hrs post trial start',
              'Provided tailored cost projection spreadsheet',
            ],
            outcome: 'Closed in 4 days',
            objection: '“Need proof of ROI”',
            rebuttal: 'Shared 30-day ROI comparison + testimonial',
          },
        ],
        patternInsight: {
          summary:
            'These wins used a pricing-first angle and responded well to follow-ups between 1–2 days post trial activation.',
          actions: [
            { id: 'promote-playbook', label: 'Promote to Playbook', intent: 'secondary', note: 'Manager only' },
            { id: 'apply-current', label: 'Apply to Current Lead', intent: 'primary' },
          ],
        },
      },
    },
  },
  cmhgkg87u0003s4rvu8waf98e: {
    rankContext: 'Finance buyer with sustained cost analysis',
    scoreDrivers: [
      { label: 'Cost management dashboard usage', delta: 9 },
      { label: 'Deployed production workload', delta: 7, context: 'Signals readiness for migration conversation' },
      { label: 'Matches finance win archetype', delta: 5 },
      { label: 'No executive reply yet', delta: -3 },
    ],
    workReadyStatus: 'work-ready',
    workReadyReason: 'Pitch deck and ROI calculator pre-populated in workspace.',
    signalTiming: {
      event: 'Production workload live 18 hrs ago',
      decayWarning: 'Signal optimal for next 36 hrs',
    },
    tagGroups: [
      {
        id: 'techcorp-behavior',
        label: 'Behavior Pattern',
        icon: 'behavior',
        items: ['Finance champion researching budgets', 'Usage spike in cost tooling'],
      },
      {
        id: 'techcorp-signal',
        label: 'Signal Type',
        icon: 'signal',
        items: ['Trial engagement', 'Cost optimization research'],
      },
      {
        id: 'techcorp-objection',
        label: 'Objection Class',
        icon: 'objection',
        items: ['Known objection cluster: Spend governance'],
      },
    ],
    similarWins: {
      summary: 'Aligned with 2 finance-led migrations that converted after cost workshops.',
      detail: {
        matchSummary:
          '2 finance champions closed recently with the same trial + cost governance pattern you’re seeing here.',
        matchConfidence: { level: 'High', percent: 86 },
        wins: [
          {
            id: 'northwind-fin',
            customer: 'Northwind Finance Ops',
            contact: 'Elena Marquez',
            contactTitle: 'Finance Director',
            source: 'Azure Trial',
            closedDate: 'Oct 18',
            closedBy: 'P. Bryant',
            keySignals: [
              'Trial run with cost alerts enabled',
              'Viewed cost optimization webinar replay',
            ],
            actions: [
              'Delivered ROI calculator walk-through',
              'Held joint finance + IT call within 24 hrs',
              'Shared migration savings scenario',
            ],
            outcome: 'Closed in 7 days',
            objection: '“Concerned about budget overrun”',
            rebuttal: 'Provided stepwise migration to cap spend',
          },
          {
            id: 'ledgerline',
            customer: 'LedgerLine Partners',
            contact: 'Marcus Osei',
            contactTitle: 'VP of Finance',
            source: 'Azure Trial',
            closedDate: 'Nov 2',
            closedBy: 'G. Wilkes',
            keySignals: [
              'Production workload deployed',
              'Multiple sessions in cost management dashboard',
            ],
            actions: [
              'Sent tailored cost governance guide',
              'Scheduled finance council review',
              'Provided Signal ROI scenario calculator',
            ],
            outcome: 'Closed in 5 days',
            objection: '“Need CFO sign-off first”',
            rebuttal: 'Framed quick win pilot with capped investment',
          },
        ],
        patternInsight: {
          summary:
            'Finance-led wins accelerate when you anchor on spend visibility and provide a ready-to-run ROI calculator.',
          actions: [
            { id: 'share-playbook', label: 'Promote to Playbook', intent: 'secondary', note: 'Manager only' },
            { id: 'apply-finance-sequence', label: 'Apply to Current Lead', intent: 'primary' },
          ],
        },
      },
    },
  },
  cmhgkg87t0001s4rvo19bz9f0: {
    rankContext: 'Signals decaying without direct follow-up',
    scoreDrivers: [
      { label: 'Attended healthcare Signal webinar', delta: 6 },
      { label: 'Downloaded enablement asset', delta: 5 },
      { label: 'IT admin persona fit', delta: 4 },
      { label: 'No form fill completed', delta: -4, context: 'Requires proactive outreach' },
    ],
    workReadyStatus: 'review-first',
    workReadyReason: 'AI draft needs personalization before sending.',
    signalTiming: {
      event: 'Webinar viewed 3 days ago',
      decayWarning: 'Engagement window closes in 24 hrs',
    },
    tagGroups: [
      {
        id: 'medisoft-pattern',
        label: 'Behavior Pattern',
        icon: 'pattern',
        items: ['Healthcare content consumption', 'Passive webinar participation'],
      },
      {
        id: 'medisoft-signal',
        label: 'Signal Type',
        icon: 'signal',
        items: ['Campaign download', 'Webinar attendance'],
      },
      {
        id: 'medisoft-objection',
        label: 'Objection Class',
        icon: 'objection',
        items: ['Known objection cluster: Adoption risk'],
      },
    ],
    similarWins: {
      summary: 'Mirrors 2 healthcare leads that converted after nurse champion intro.',
      detail: {
        matchSummary:
          '2 healthcare orgs with webinar-first engagement converted once a clinical champion was looped in.',
        matchConfidence: { level: 'Medium', percent: 74 },
        wins: [
          {
            id: 'healthfirst',
            customer: 'HealthFirst Diagnostics',
            contact: 'Priya Nayar',
            contactTitle: 'Infrastructure Manager',
            source: 'Signal Webinar',
            closedDate: 'Oct 12',
            closedBy: 'A. Barton',
            keySignals: [
              'Watched 50-minute webinar replay',
              'Engaged with healthcare case study email',
            ],
            actions: [
              'Introduced nurse champion reference',
              'Provided compliance FAQ sheet',
              'Scheduled clinical workshop',
            ],
            outcome: 'Closed in 9 days',
            objection: '“Clinicians won’t adopt quickly”',
            rebuttal: 'Shared 2 fast adoption stories + pilot plan',
          },
          {
            id: 'medlink',
            customer: 'MedLink Services',
            contact: 'Carlos Ruiz',
            contactTitle: 'IT Administrator',
            source: 'Campaign Download',
            closedDate: 'Oct 28',
            closedBy: 'S. Chou',
            keySignals: [
              'Downloaded Signal playbook',
              'Opened nurture emails 3 times',
            ],
            actions: [
              'Sent clinical enablement guide',
              'Offered co-selling session with partner',
              'Followed up 24 hrs after asset download',
            ],
            outcome: 'Closed in 8 days',
            objection: '“Need clinical validation”',
            rebuttal: 'Supplied nurse-lead testimonial and trial plan',
          },
        ],
        patternInsight: {
          summary:
            'Healthcare webinar leads progress when you introduce a clinical voice and respond within 24 hrs of content engagement.',
          actions: [
            { id: 'promote-healthcare', label: 'Promote to Playbook', intent: 'secondary', note: 'Manager only' },
            { id: 'apply-healthcare', label: 'Apply to Current Lead', intent: 'primary' },
          ],
        },
      },
    },
  },
  cmhgkg87u0002s4rvpok7i9mm: {
    rankContext: 'Maintains visibility but lacks decisive action',
    scoreDrivers: [
      { label: 'Engaged with campaign email', delta: 4 },
      { label: 'Clicked logistics case study', delta: 3 },
      { label: 'Executive persona', delta: 3 },
      { label: 'Low recency signals', delta: -5, context: 'Requires nurture cadence' },
      { label: 'No trial footprint yet', delta: -3 },
    ],
    workReadyStatus: 'review-first',
    workReadyReason: 'Recommend plan outreach first, then escalate.',
    signalTiming: {
      event: 'Campaign touch 5 days ago',
      decayWarning: 'Will recycle in 3 days without new movement',
    },
    tagGroups: [
      {
        id: 'pathbridge-pattern',
        label: 'Behavior Pattern',
        icon: 'behavior',
        items: ['Executive browsing thought leadership', 'Low hands-on engagement'],
      },
      {
        id: 'pathbridge-signal',
        label: 'Signal Type',
        icon: 'signal',
        items: ['Campaign email open', 'Case study interest'],
      },
      {
        id: 'pathbridge-objection',
        label: 'Objection Class',
        icon: 'objection',
        items: ['Known objection cluster: Value proof'],
      },
    ],
    similarWins: {
      summary: 'Looks like 4 logistics exec leads that converted after product tour invite.',
      detail: {
        matchSummary:
          '4 logistics exec leads closed after product tour invites paired with quick executive follow-up.',
        matchConfidence: { level: 'Medium', percent: 71 },
        wins: [
          {
            id: 'swiftlogix',
            customer: 'SwiftLogix Freight',
            contact: 'Hannah Kim',
            contactTitle: 'COO',
            source: 'Campaign Email',
            closedDate: 'Oct 8',
            closedBy: 'T. Gardner',
            keySignals: [
              'Clicked on logistics case study',
              'Visited pricing comparison page',
            ],
            actions: [
              'Invited to logistics product tour',
              'Sent executive briefing deck',
              'Followed up 48 hrs later with ROI snippet',
            ],
            outcome: 'Closed in 11 days',
            objection: '“Need to see operational ROI”',
            rebuttal: 'Shared operations case study + KPI dashboard',
          },
          {
            id: 'cargoone',
            customer: 'CargoOne Distribution',
            contact: 'Noah Price',
            contactTitle: 'CFO',
            source: 'Campaign Email',
            closedDate: 'Oct 25',
            closedBy: 'L. Morgan',
            keySignals: [
              'Opened pricing email twice',
              'Downloaded logistics ROI calculator',
            ],
            actions: [
              'Coordinated executive product tour',
              'Added finance ROI highlights',
              'Set 1-week check-in',
            ],
            outcome: 'Closed in 10 days',
            objection: '“Is this scalable?”',
            rebuttal: 'Provided scalability proof points from peers',
          },
          {
            id: 'pathhauler',
            customer: 'PathHauler Networks',
            contact: 'Eva Santos',
            contactTitle: 'VP Operations',
            source: 'Campaign Download',
            closedDate: 'Nov 3',
            closedBy: 'A. Fuller',
            keySignals: [
              'Downloaded operations playbook',
              'Watched 30-minute product walkthrough',
            ],
            actions: [
              'Invited to tailored logistics tour',
              'Shared operations KPI benchmarks',
              'Sent nurture email for buying committee',
            ],
            outcome: 'Closed in 9 days',
            objection: '“Need stakeholder alignment”',
            rebuttal: 'Outlined multi-phase rollout with exec sponsor',
          },
        ],
        patternInsight: {
          summary:
            'Logistics exec wins accelerate after a product tour + executive recap email within 48 hrs.',
          actions: [
            { id: 'promote-logistics', label: 'Promote to Playbook', intent: 'secondary', note: 'Manager only' },
            { id: 'apply-logistics-plan', label: 'Apply to Current Lead', intent: 'primary' },
          ],
        },
      },
    },
  },
  cmhgkg87v0004s4rvjey2xi9o: {
    rankContext: 'Education buyer exploring pricing details',
    scoreDrivers: [
      { label: 'Completed education webinar', delta: 5 },
      { label: 'Downloaded pricing sheet', delta: 5 },
      { label: 'Procurement persona fit', delta: 4 },
      { label: 'No follow-up engagement yet', delta: -4 },
    ],
    workReadyStatus: 'review-first',
    workReadyReason: 'Recommended to tailor pricing before outreach.',
    signalTiming: {
      event: 'Pricing sheet downloaded yesterday',
      decayWarning: 'Schedule outreach within 48 hrs',
    },
    tagGroups: [
      {
        id: 'eduflow-pattern',
        label: 'Behavior Pattern',
        icon: 'pattern',
        items: ['Procurement-led research', 'Education solution interest'],
      },
      {
        id: 'eduflow-signal',
        label: 'Signal Type',
        icon: 'signal',
        items: ['Webinar attendance', 'Pricing engagement'],
      },
      {
        id: 'eduflow-objection',
        label: 'Objection Class',
        icon: 'objection',
        items: ['Known objection cluster: Budget cycle timing'],
      },
    ],
    similarWins: {
      summary: 'Matches 2 education leads that converted after pricing workshop invite.',
      detail: {
        matchSummary:
          '2 education procurement teams with similar pricing research converted after a fast workshop invite.',
        matchConfidence: { level: 'Medium', percent: 76 },
        wins: [
          {
            id: 'campusone',
            customer: 'CampusOne Academy',
            contact: 'Olivia Brooks',
            contactTitle: 'Procurement Manager',
            source: 'Education Webinar',
            closedDate: 'Oct 11',
            closedBy: 'Z. Khan',
            keySignals: [
              'Watched full webinar',
              'Downloaded pricing comparison sheet',
            ],
            actions: [
              'Scheduled pricing workshop within 48 hrs',
              'Shared education discount matrix',
              'Provided tailored Signal syllabus',
            ],
            outcome: 'Closed in 6 days',
            objection: '“Need board approval”',
            rebuttal: 'Equipped sponsor with board-ready deck',
          },
          {
            id: 'learnforward',
            customer: 'LearnForward Charter',
            contact: 'James Walker',
            contactTitle: 'Procurement Lead',
            source: 'Pricing Asset Download',
            closedDate: 'Oct 30',
            closedBy: 'M. Ibarra',
            keySignals: [
              'Pricing sheet downloaded twice',
              'Engaged with education ROI calculator',
            ],
            actions: [
              'Invited to pricing walk-through with finance',
              'Shared buy-in email template',
              'Followed up 36 hrs later with case study',
            ],
            outcome: 'Closed in 7 days',
            objection: '“Budget cycle starts next quarter”',
            rebuttal: 'Positioned early adopter discount for immediate start',
          },
        ],
        patternInsight: {
          summary:
            'Education leads commit faster when you move them into a pricing workshop within 2 days.',
          actions: [
            { id: 'promote-education', label: 'Promote to Playbook', intent: 'secondary', note: 'Manager only' },
            { id: 'apply-education', label: 'Apply to Current Lead', intent: 'primary' },
          ],
        },
      },
    },
  },
}
