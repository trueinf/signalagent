import { PrismaClient, SourceType, Industry, BuyerRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const leads = [
    {
      name: 'Amanda Brady',
      email: 'amanda.brady@lakeshore.com',
      company: 'Lakeshore Retail',
      contactTitle: 'VP of IT',
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
    },
    {
      name: 'Ravi Kumar',
      email: 'ravi.kumar@medisoft.com',
      company: 'Medisoft Diagnostics',
      contactTitle: 'IT Admin',
      source: 'Downloaded "Signal for Healthcare" guide',
      sourceType: SourceType.CAMPAIGN_DOWNLOAD,
      industry: Industry.HEALTHCARE,
      buyerRole: BuyerRole.IT_ADMIN,
      intentScore: 76,
      signalTrail: JSON.stringify([
        'Attended 46 minutes of Signal webinar, no form filled',
      ]),
      aiInsight: 'Passive interest from IT buyer. Suggest email first, then assess intent.',
    },
    {
      name: 'Jordan Smith',
      email: 'jordan.smith@pathbridge.com',
      company: 'PathBridge Logistics',
      contactTitle: 'CFO',
      source: 'Microsoft campaign email open',
      sourceType: SourceType.CAMPAIGN_EMAIL,
      industry: Industry.LOGISTICS,
      buyerRole: BuyerRole.CEO,
      intentScore: 65,
      signalTrail: JSON.stringify([
        'Opened 1 campaign email; clicked case study but no download',
      ]),
      aiInsight: 'Finance contact, no strong signal. Recommends nurture track unless new activity observed.',
    },
    {
      name: 'Sarah Chen',
      email: 'sarah.chen@techcorp.com',
      company: 'TechCorp Solutions',
      contactTitle: 'Finance Head',
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
    },
    {
      name: 'Michael Torres',
      email: 'michael.torres@eduflow.com',
      company: 'EduFlow Academy',
      contactTitle: 'Procurement',
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
    },
  ]

  for (const lead of leads) {
    await prisma.lead.create({
      data: lead,
    })
  }

  console.log('Seeded database with sample leads')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
