import { NextRequest, NextResponse } from 'next/server'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    console.log('Reset request for:', email)
        const { PrismaClient } = require('@prisma/client')
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      console.log('User not found:', email)
      return NextResponse.json({ message: 'If email exists, reset link sent' })
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetExpires = new Date(Date.now() + 3600000)
    
    console.log('Updating user with reset token')
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetExpires
      }
    })
    
    console.log('Sending email to:', email)
    await sendPasswordResetEmail(email, resetToken)
    console.log('Email sent successfully')
    
    return NextResponse.json({ message: 'If email exists, reset link sent' })
  } catch (error) {
    console.error('Reset error details:', error)
    return NextResponse.json({ message: 'If email exists, reset link sent' })
  }
}