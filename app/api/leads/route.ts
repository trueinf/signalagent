import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sourceType = searchParams.get('sourceType')
    const industry = searchParams.get('industry')
    const buyerRole = searchParams.get('buyerRole')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (sourceType && sourceType !== 'ALL') {
      where.sourceType = sourceType
    }
    if (industry && industry !== 'ALL') {
      where.industry = industry
    }
    if (buyerRole && buyerRole !== 'ALL') {
      where.buyerRole = buyerRole
    }
    if (search) {
      where.OR = [
        { company: { contains: search } },
        { name: { contains: search } },
        { email: { contains: search } },
      ]
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: [
        { intentScore: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const lead = await prisma.lead.create({
      data: body,
    })
    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}

