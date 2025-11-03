export interface InsightMetric {
  id: string
  title: string
  value: string
  caption: string
  trend: string
}

export interface InsightHighlight {
  id: string
  title: string
  summary: string
  impact: string
  link: string
}

export interface EnablementTask {
  id: string
  title: string
  description: string
  owner: string
  due: string
  status: 'Planned' | 'In Progress' | 'Done'
}

export interface TelemetryCard {
  id: string
  title: string
  metric: string
  change: string
  commentary: string
}

export const metrics: InsightMetric[] = [
  {
    id: 'lead-conversion',
    title: 'Lead conversion velocity',
    value: '2.6x',
    caption: 'Faster vs. last quarter when reps accept Signal guidance',
    trend: '+34% week over week',
  },
  {
    id: 'renewal-save',
    title: 'Renewal save rate',
    value: '78%',
    caption: 'Renewals rescued after Signal recommendations applied',
    trend: '+6 pts vs. baseline',
  },
  {
    id: 'objection-adoption',
    title: 'Objection play adoption',
    value: '68%',
    caption: 'Reps using curated rebuttals in the last 14 days',
    trend: '+11 pts week over week',
  },
  {
    id: 'arr-saved',
    title: 'ARR influenced',
    value: '$4.3M',
    caption: 'Saved or accelerated by Signal-guided motions this month',
    trend: '+$1.1M vs. last month',
  },
]

export const highlights: InsightHighlight[] = [
  {
    id: 'finance-plays',
    title: 'Finance-led pricing plays are sticking',
    summary: 'CFO objections dropped 22% when reps lead with hybrid benefit calculator + service credits.',
    impact: '+18 pts win rate for high-ARR renewals in finance segments.',
    link: '/objection-tree/pricing-value',
  },
  {
    id: 'usage-sprints',
    title: 'Usage recovery sprints drive renewals',
    summary: 'Accounts running the 3-week adoption sprint regained 27% usage within the renewal window.',
    impact: 'Renewal saves improved by +11 pts when sprint launched within 10 days of drop.',
    link: '/renewals',
  },
  {
    id: 'persona-emails',
    title: 'Persona-aligned outreach resonates',
    summary: 'Signal-generated talk tracks targeted at COO personas lifted lead reply rates by 19%.',
    impact: 'Average lead cycle shortened by 3.5 days when persona email was used.',
    link: '/leads/prioritized',
  },
]

export const telemetryCards: TelemetryCard[] = [
  {
    id: 'signal-usage',
    title: 'Signal usage prompts/day',
    metric: '6,200',
    change: '+14% vs. last week',
    commentary: 'Usage lift correlates with adoption sprint play and FastTrack workshops.',
  },
  {
    id: 'secure-score',
    title: 'Average secure score',
    metric: '68',
    change: '+4 pts vs. last month',
    commentary: 'Security remediation playbooks now adopted in 62% of high-risk renewals.',
  },
  {
    id: 'email-engagement',
    title: 'Signal email engagement',
    metric: '43%',
    change: '+7 pts vs. baseline',
    commentary: 'Persona-tailored emails outperform generic nurture by 19%.',
  },
]

export const enablementTasks: EnablementTask[] = [
  {
    id: 'pricing-video',
    title: 'Record pricing objection enablement video',
    description: 'Summarise new finance rebuttal, service credit framing, and when to escalate to Deal Desk.',
    owner: 'Enablement',
    due: 'Due in 4 days',
    status: 'In Progress',
  },
  {
    id: 'security-brief',
    title: 'Update security assurance brief',
    description: 'Include new Signal compliance posture and remediation case study.',
    owner: 'Product Marketing',
    due: 'Due in 7 days',
    status: 'Planned',
  },
  {
    id: 'persona-workshop',
    title: 'Run persona-driven talk track workshop',
    description: 'Focus on COO/COO scripts that drove the 19% reply lift.',
    owner: 'Sales Manager',
    due: 'Due in 2 days',
    status: 'Planned',
  },
]

export const experimentHighlights = [
  {
    id: 'service-credit-test',
    title: 'Service credit vs. 8% discount A/B',
    result: 'Service credits delivered 14 pts higher renewal win rate with 3% better margin.',
    nextStep: 'Roll out service credit template to all high-ARR renewals.',
  },
  {
    id: 'persona-talk-track',
    title: 'COO talk track experiment',
    result: 'COO-targeted script + adoption workshop invite lifted response rate 21%.',
    nextStep: 'Scale script to all manufacturing leads this month.',
  },
]

export const teamSignals = [
  {
    id: 'rep-adoption',
    title: 'Rep adoption of Signal guidance',
    metric: '72%',
    trend: '+9 pts vs. last month',
    notes: 'Teams using the renewal workspace saved 2.3x more ARR.',
  },
  {
    id: 'queue-coverage',
    title: 'Queue coverage (leads touched in last 48h)',
    metric: '64%',
    trend: '-5 pts vs. target',
    notes: 'Prioritise high-risk finance leads flagged today.',
  },
  {
    id: 'manager-alerts',
    title: 'Manager attention alerts',
    metric: '12',
    trend: '+4 vs. last week',
    notes: 'Security renewals without remediation plan logged as highest risk.',
  },
]
