export interface ObjectionCluster {
  id: string
  title: string
  severity: 'high' | 'medium' | 'emerging'
  frequency: number
  changePct: number
  personas: string[]
  motions: Array<'Leads' | 'Renewals'>
  summary: string
  signals: string[]
  recommendedActions: string[]
  playbook: {
    opener: string
    framing: string
    proofPoints: string[]
    close: string
  }
  assets: string[]
  winStories: {
    customer: string
    takeaway: string
    details?: string
  }[]
  metrics: {
    adoptionRate: number
    winRateLift: number
    averageDuration: string
  }
  quickActions: {
    id: string
    label: string
    description: string
    href: string
  }[]
  learningPrompts: string[]
}

export const objectionClusters: ObjectionCluster[] = [
  {
    id: 'pricing-value',
    title: '“Signal is too expensive for current usage”',
    severity: 'high',
    frequency: 86,
    changePct: 18,
    personas: ['CFO', 'Procurement'],
    motions: ['Leads', 'Renewals'],
    summary:
      'Finance stakeholders question Signal ROI when adoption is early or telemetry shows dips. They push for discounts before agreeing to next steps.',
    signals: [
      'Usage telemetry down 20% month over month',
      'Finance requests detailed ROI benchmarks',
      'Budget review triggered before renewal',
    ],
    recommendedActions: [
      'Lead with hybrid benefit calculator to show net savings',
      'Offer service credits tied to adoption milestones instead of discounts',
      'Share executive case study where loyalty incentives preserved ARR',
    ],
    playbook: {
      opener: 'Acknowledge the cost pressure and align on business outcomes before talking concession.',
      framing:
        'Reframe cost as a value exchange: productivity gains, hybrid benefit savings, and upcoming features that finance cares about.',
      proofPoints: [
        'Contoso Manufacturing reduced forecast time by 30% and offset Signal spend via hybrid benefit.',
        'Service credits worth 5% accelerated adoption and preserved list pricing.',
      ],
      close:
        'Propose service credits tied to mutually agreed metrics; schedule executive checkpoint to track value realization.',
    },
    assets: ['Hybrid benefit ROI calculator', 'Executive finance brief deck', 'Service credit incentive template'],
    winStories: [
      {
        customer: 'Contoso Manufacturing',
        takeaway: 'Won renewal with service credits + ROI narrative in 18 days.',
        details: 'Rep acknowledged CFO concerns, shared hybrid benefit calculator on the call, then offered 5% service credits tied to adoption milestones. Executives signed at list price after reviewing the ROI sheet.',
      },
      {
        customer: 'Fabrikam Finance',
        takeaway: 'Kept list price by sharing CFO productivity benchmarks.',
        details: 'Finance leader requested proof; rep delivered productivity dashboard and executive brief, then scheduled an architect review. Pricing stayed intact with added service credits for upcoming security modules.',
      },
    ],
    metrics: {
      adoptionRate: 0.72,
      winRateLift: 0.14,
      averageDuration: '21 days',
    },
    quickActions: [
      {
        id: 'tailor-rebuttal',
        label: 'Generate tailored rebuttal',
        description: 'Craft finance-friendly response with ROI and incentive framing.',
        href: `/objection-tree/pricing-value/actions/rebuttal`,
      },
      {
        id: 'share-evidence',
        label: 'Share evidence pack',
        description: 'Compile ROI calculator, case study, and adoption roadmap into an email.',
        href: `/objection-tree/pricing-value/actions/evidence`,
      },
      {
        id: 'log-variant',
        label: 'Log new variant',
        description: 'Capture a new phrasing or nuance from your conversation.',
        href: `/objection-tree/pricing-value/actions/log`,
      },
    ],
    learningPrompts: [
      'What ROI metric finally resonated?',
      'Did finance accept service credits or ask for discount?',
      'Which stakeholder drove the decision?',
    ],
  },
  {
    id: 'usage-drop',
    title: '“Usage dropped after pilot — we’re not seeing value”',
    severity: 'high',
    frequency: 71,
    changePct: 9,
    personas: ['Line of Business', 'Adoption Lead'],
    motions: ['Renewals'],
    summary:
      'Adoption champions report usage decline after initial excitement. They fear renewing without a revitalised adoption plan.',
    signals: [
      'Telemetry drop >15% in past 4 weeks',
      'FastTrack engagement paused midstream',
      'Champion moved roles or left the company',
    ],
    recommendedActions: [
      'Spin up adoption sprint with FastTrack and new champion',
      'Highlight similar customer who recovered usage via structured play',
      'Bundle adoption workshop into renewal offer',
    ],
    playbook: {
      opener: 'Empathise with the drop and outline what “good” looks like.',
      framing: 'Position usage recovery as a co-owned sprint with Microsoft resources.',
      proofPoints: [
        'Northwind Traders recovered 30% usage after re-onboarding with FastTrack.',
        'Adoption workshop paired with executive sponsor re-established momentum.',
      ],
      close: 'Agree on three-week adoption sprint, book weekly checkpoints, tie renewal milestone to improved metrics.',
    },
    assets: ['FastTrack adoption sprint plan', 'Usage recovery dashboard template', 'Champion enablement checklist'],
    winStories: [
      {
        customer: 'Northwind Traders',
        takeaway: 'Adoption sprint regained 30% usage; renewal signed at list price.',
        details: 'Rep re-engaged FastTrack, mapped a 3-week sprint, and secured executive checkpoints. Usage recovered 30% and renewal closed without discount.',
      },
      {
        customer: 'Tailwind Retail',
        takeaway: 'Executive sponsor workshop reversed declining metrics in 2 weeks.',
        details: 'Champion workshop aligned leadership, resulting in immediate onboarding for frontline teams and a 22% usage lift ahead of renewal.',
      },
    ],
    metrics: {
      adoptionRate: 0.65,
      winRateLift: 0.11,
      averageDuration: '24 days',
    },
    quickActions: [
      {
        id: 'launch-sprint',
        label: 'Launch adoption sprint plan',
        description: 'Customise the 3-week recovery play and send to customer champions.',
        href: `/objection-tree/usage-drop/actions/sprint`,
      },
      {
        id: 'schedule-workshop',
        label: 'Schedule champion workshop',
        description: 'Trigger invite workflow with FastTrack and executive sponsor.',
        href: `/objection-tree/usage-drop/actions/workshop`,
      },
      {
        id: 'share-dashboard',
        label: 'Share usage dashboard',
        description: 'Generate export showing before/after metrics tied to the sprint.',
        href: `/objection-tree/usage-drop/actions/dashboard`,
      },
    ],
    learningPrompts: [
      'Which workloads saw the biggest drop?',
      'Who championed the recovery plan?',
      'Was FastTrack re-engaged?',
    ],
  },
  {
    id: 'security-concerns',
    title: '“Security/compliance risk is too high”',
    severity: 'medium',
    frequency: 54,
    changePct: -5,
    personas: ['CISO', 'Security Architect'],
    motions: ['Leads', 'Renewals'],
    summary:
      'Security teams need assurance about data handling, compliance, and remediation plans before moving forward.',
    signals: [
      'Recent security incident or audit pending',
      'Customer lacks clarity on Signal data boundaries',
      'Compliance officer requesting additional documentation',
    ],
    recommendedActions: [
      'Bring FastTrack security specialist for remediation walkthrough',
      'Share secure score improvement roadmap and customer story',
      'Offer phased pricing tied to secure score milestones',
    ],
    playbook: {
      opener: 'Acknowledge the risk and align on regulatory obligations.',
      framing: 'Detail Microsoft compliance posture and remediation partnership.',
      proofPoints: [
        'Adventure Works improved secure score by 18 points in 6 weeks with Microsoft.',
        'FastTrack security squad co-owned remediation until audit passed.',
      ],
      close: 'Agree on remediation milestones, pair with phased commercial plan, schedule compliance review.',
    },
    assets: ['Security remediation playbook', 'Compliance assurance letter', 'Secure score roadmap deck'],
    winStories: [
      {
        customer: 'Adventure Works',
        takeaway: 'Renewal saved after remediation plan tied to phased pricing.',
        details: 'Security specialist co-authored remediation milestones; pricing phased against secure score improvements. CISO signed before audit.',
      },
      {
        customer: 'Fabrikam APAC',
        takeaway: 'Audit cleared with Microsoft co-ownership of controls.',
        details: 'Rep looped FastTrack security, delivered compliance dossier, and provided weekly progress updates, which satisfied regulators.',
      },
    ],
    metrics: {
      adoptionRate: 0.58,
      winRateLift: 0.09,
      averageDuration: '28 days',
    },
    quickActions: [
      {
        id: 'launch-remediation',
        label: 'Launch remediation plan',
        description: 'Customise the security play and align tasks with the CISO.',
        href: `/objection-tree/security-concerns/actions/remediation`,
      },
      {
        id: 'share-compliance',
        label: 'Share compliance dossier',
        description: 'Send assurance letter, certifications, and secure score outline.',
        href: `/objection-tree/security-concerns/actions/compliance`,
      },
      {
        id: 'loop-specialist',
        label: 'Loop in security specialist',
        description: 'Request FastTrack security engagement with context.',
        href: `/objection-tree/security-concerns/actions/specialist`,
      },
    ],
    learningPrompts: ['Which controls are blocking approval?', 'Any regulatory deadlines?', 'Is FastTrack engaged?'],
  },
  {
    id: 'competing-priority',
    title: '“Other priorities outrank this project right now”',
    severity: 'emerging',
    frequency: 32,
    changePct: 22,
    personas: ['COO', 'Transformation Lead'],
    motions: ['Leads'],
    summary:
      'Decision makers postpone Signal because transformation roadmap is crowded. Need to re-anchor urgency and fit the project into existing initiatives.',
    signals: [
      'Budget reallocated to other initiatives',
      'Sponsor bandwidth limited',
      'Leadership wants proof of quick wins',
    ],
    recommendedActions: [
      'Connect Signal to active initiatives (e.g., cost reduction, productivity OKRs)',
      'Propose scoped pilot aligned to those objectives',
      'Secure executive sponsor by highlighting similar success stories',
    ],
    playbook: {
      opener: 'Acknowledge competing priorities; ask which initiatives are top of mind.',
      framing: 'Demonstrate how Signal accelerates the existing roadmap rather than adds new work.',
      proofPoints: [
        'Tailwind Traders embedded Signal in customer support, delivering 19% faster resolution within current program.',
        'Executive sponsor saw measurable value in 30-day scoped pilot tied to OKRs.',
      ],
      close: 'Propose a 30-day pilot with clear checkpoints and minimal lift, then revisit broader rollout.',
    },
    assets: ['30-day pilot plan template', 'Executive alignment deck', 'ROI impact calculator'],
    winStories: [
      {
        customer: 'Tailwind Traders',
        takeaway: 'Scoped pilot kept program on track and unlocked full deployment.',
        details: 'Rep reframed Signal as part of an existing support initiative, ran a 30-day pilot with clear metrics, and leadership approved expansion afterwards.',
      },
    ],
    metrics: {
      adoptionRate: 0.63,
      winRateLift: 0.07,
      averageDuration: '18 days',
    },
    quickActions: [
      {
        id: 'build-pilot',
        label: 'Build 30-day pilot plan',
        description: 'Customise tasks and milestones aligned to customer OKRs.',
        href: `/objection-tree/competing-priority/actions/pilot`,
      },
      {
        id: 'draft-exec-mail',
        label: 'Draft executive email',
        description: 'Compose outreach from the sponsor emphasising urgency and impact.',
        href: `/objection-tree/competing-priority/actions/email`,
      },
      {
        id: 'share-success',
        label: 'Share success story',
        description: 'Send curated case study aligning Signal with current priority.',
        href: `/objection-tree/competing-priority/actions/success`,
      },
    ],
    learningPrompts: ['Which initiative outranks Signal?', 'Who can become executive sponsor?', 'What is the near-term win?'],
  },
]

export function getObjectionClusters() {
  return objectionClusters
}

export function getObjectionClusterById(id: string) {
  return objectionClusters.find((cluster) => cluster.id === id)
}
