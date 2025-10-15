import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const scans = await prisma.scan.findMany({
      include: {
        user: { select: { email: true } },
        model: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(scans)
  } catch (error) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { scanId } = await request.json()
    
    await prisma.scan.delete({ where: { id: scanId } })
    
    return NextResponse.json({ message: 'Scan deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
}