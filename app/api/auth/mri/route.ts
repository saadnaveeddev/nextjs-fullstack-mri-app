import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    const scans = await prisma.scan.findMany({
      where: { userId: user.userId },
      include: { model: true },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(scans)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { filename, originalUrl, size, modelId } = await request.json()
    
    const scan = await prisma.scan.create({
      data: {
        filename,
        originalUrl,
        size,
        userId: user.userId,
        modelId
      },
      include: { model: true }
    })
    
    return NextResponse.json(scan)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
