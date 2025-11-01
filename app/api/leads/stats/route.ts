import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      select: {
        intentScore: true,
        sourceType: true,
      },
    })

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

    return NextResponse.json({
      priority: { high, medium, low },
      sources: sourceBreakdown,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

