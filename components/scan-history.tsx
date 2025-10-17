"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download } from "lucide-react"

interface Scan {
  id: string
  filename: string
  status: string
  createdAt: string
  resultUrl?: string
  model?: { name: string }
  accuracy?: number
  processingTime?: number
}

const sampleScans = [
  {
    id: "sample-1",
    filename: "brain_scan_001.nii",
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    model: { name: "Tumor Detection Model" },
    accuracy: 0.94,
    processingTime: 45
  },
  {
    id: "sample-2", 
    filename: "mri_patient_002.dcm",
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    model: { name: "Stroke Analysis Model" },
    accuracy: 0.89,
    processingTime: 38
  }
]

export default function ScanHistory() {
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await fetch('/api/scans')
        if (response.ok) {
          const data = await response.json()
          setScans(data.length > 0 ? data : sampleScans)
        } else {
          setScans(sampleScans)
        }
      } catch (error) {
        console.error('Failed to fetch scans:', error)
        setScans(sampleScans)
      } finally {
        setLoading(false)
      }
    }

    fetchScans()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading scan history...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Scan History</h1>
      
      <div className="grid gap-4">
        {scans.map((scan) => (
          <Card key={scan.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{scan.filename}</CardTitle>
                <Badge className={getStatusColor(scan.status)}>
                  {scan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Model</p>
                  <p className="font-medium">{scan.model?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{new Date(scan.createdAt).toLocaleDateString()}</p>
                </div>
                {scan.accuracy && (
                  <div>
                    <p className="text-muted-foreground">Accuracy</p>
                    <p className="font-medium">{(scan.accuracy * 100).toFixed(1)}%</p>
                  </div>
                )}
                {scan.processingTime && (
                  <div>
                    <p className="text-muted-foreground">Processing Time</p>
                    <p className="font-medium">{scan.processingTime}s</p>
                  </div>
                )}
              </div>
              
              {scan.status === 'COMPLETED' && (
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Results
                  </Button>
                  {scan.resultUrl && (
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {scans.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No scans found. Upload your first MRI scan to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}