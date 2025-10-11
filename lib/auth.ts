import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export async function verifyToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) return null

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
    return decoded
  } catch {
    return null
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await verifyToken(request)
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireAuth(request)
  if (user.role !== 'ADMIN') {
    throw new Error('Admin access required')
  }
  return user
}