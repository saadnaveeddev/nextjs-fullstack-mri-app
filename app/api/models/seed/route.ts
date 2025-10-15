import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const models = [
      {
        name: "Tumor Detection Model",
        description: "Advanced deep learning model for detecting and segmenting brain tumors in MRI scans.",
        version: "2.1.0",
        isActive: true
      },
      {
        name: "Stroke Analysis Model",
        description: "Identifies ischemic and hemorrhagic stroke regions with high accuracy.",
        version: "1.8.3",
        isActive: true
      },
      {
        name: "Tissue Segmentation Model",
        description: "Segments white matter, gray matter, and cerebrospinal fluid regions.",
        version: "3.0.1",
        isActive: true
      },
      {
        name: "Alzheimer's Detection Model",
        description: "Detects early signs of Alzheimer's disease through structural analysis.",
        version: "1.5.2",
        isActive: true
      },
      {
        name: "Lesion Detection Model",
        description: "Identifies and classifies various types of brain lesions and abnormalities.",
        version: "2.3.0",
        isActive: true
      },
      {
        name: "Volumetric Analysis Model",
        description: "Provides detailed volumetric measurements of brain structures.",
        version: "1.9.1",
        isActive: true
      }
    ]

    for (const modelData of models) {
      await prisma.model.upsert({
        where: { name: modelData.name },
        update: modelData,
        create: modelData
      })
    }

    return NextResponse.json({ message: 'Models seeded successfully', count: models.length })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to seed models' }, { status: 500 })
  }
}