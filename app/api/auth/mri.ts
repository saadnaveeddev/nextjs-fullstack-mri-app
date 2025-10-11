import type { NextApiRequest, NextApiResponse } from "next"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const files = await prisma.mRIFile.findMany()
      return res.status(200).json(files)
    }

    if (req.method === "POST") {
      const data = req.body
      const newFile = await prisma.mRIFile.create({ data })
      return res.status(201).json(newFile)
    }

    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
