import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const models = await prisma.model.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(models)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching models' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { name, description, version } = await request.json()
    
    const model = await prisma.model.create({
      data: { name, description, version }
    })
    
    return NextResponse.json(model)
  } catch (error) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
}