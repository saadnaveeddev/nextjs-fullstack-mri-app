import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: {
          gt: new Date()
        }
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }
    
    const hashedPassword = await bcrypt.hash(password, 12)
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetExpires: null
      }
    })
    
    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset confirm error:', error)
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 })
  }
}