"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Upload, Brain, BarChart3 } from "lucide-react"
import GlobalNavbar from "@/components/global-navbar"
import { type AuthUser } from "@/components/auth-page"

export default function DocsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/auth')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <GlobalNavbar user={user} onLogout={handleLogout} />
      <div className="pt-16 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Documentation</h1>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Getting Started</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Learn how to upload and analyze your first MRI scan:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Sign up or log in to your account</li>
                  <li>Upload your MRI image (JPEG, PNG, DICOM, or NIfTI format)</li>
                  <li>Select an appropriate segmentation model</li>
                  <li>View and download your results</li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5" />
                  <span>Supported Models</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Available segmentation models:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Tumor Detection:</strong> Identifies and segments brain tumors</li>
                  <li><strong>Stroke Analysis:</strong> Detects stroke-affected regions</li>
                  <li><strong>General Segmentation:</strong> Multi-class brain tissue segmentation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>File Formats</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Supported image formats:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>JPEG/PNG:</strong> Standard image formats for converted MRI scans</li>
                  <li><strong>DICOM:</strong> Medical imaging standard format</li>
                  <li><strong>NIfTI:</strong> Neuroimaging format (.nii, .nii.gz)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}