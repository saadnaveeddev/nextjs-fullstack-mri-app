import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const user = await prisma.user.findFirst()
    const models = await prisma.model.findMany({ take: 3 })
    
    if (!user || models.length === 0) {
      return NextResponse.json({ error: 'Need users and models first' }, { status: 400 })
    }

    const sampleScans = [
      {
        filename: "brain_scan_001.nii",
        originalUrl: "/placeholder.jpg",
        size: 2048576,
        userId: user.id,
        modelId: models[0].id,
        status: "COMPLETED",
        accuracy: 0.94,
        processingTime: 45
      },
      {
        filename: "mri_patient_002.dcm",
        originalUrl: "/placeholder.jpg", 
        size: 1536000,
        userId: user.id,
        modelId: models[1].id,
        status: "COMPLETED",
        accuracy: 0.89,
        processingTime: 38
      }
    ]

    for (const scanData of sampleScans) {
      await prisma.scan.create({ data: scanData })
    }

    return NextResponse.json({ message: 'Sample scans created', count: sampleScans.length })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed scans' }, { status: 500 })
  }
}