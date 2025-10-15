import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    
    const scan = await prisma.scan.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      },
      include: { model: true, user: { select: { email: true } } }
    })
    
    if (!scan) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
    }
    
    return NextResponse.json(scan)
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    const { status, resultUrl, processingTime, accuracy } = await request.json()
    
    const scan = await prisma.scan.updateMany({
      where: {
        id: params.id,
        userId: user.userId
      },
      data: {
        status,
        resultUrl,
        processingTime,
        accuracy
      }
    })
    
    if (scan.count === 0) {
      return NextResponse.json({ error: 'Scan not found' }, { status: 404 })
    }
    
    return NextResponse.json({ message: 'Scan updated successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}