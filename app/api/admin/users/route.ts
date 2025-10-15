import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { scans: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request)
    const { userId } = await request.json()
    
    await prisma.user.delete({ where: { id: userId } })
    
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }
}