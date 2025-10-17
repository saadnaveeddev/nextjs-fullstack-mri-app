"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Activity, Scan } from "lucide-react"
import GlobalNavbar from "@/components/global-navbar"
import { type AuthUser } from "@/components/auth-page"

interface Model {
  id: string
  name: string
  description: string
  version: string
  isActive: boolean
}

const staticModels = [
  {
    id: "tumor-detection",
    name: "Tumor Detection Model",
    description: "Advanced deep learning model for detecting and segmenting brain tumors in MRI scans.",
    version: "2.1.0",
    isActive: true
  },
  {
    id: "stroke-analysis",
    name: "Stroke Analysis Model",
    description: "Identifies ischemic and hemorrhagic stroke regions with high accuracy.",
    version: "1.8.3",
    isActive: true
  },
  {
    id: "tissue-segmentation",
    name: "Tissue Segmentation Model",
    description: "Segments white matter, gray matter, and cerebrospinal fluid regions.",
    version: "3.0.1",
    isActive: true
  },
  {
    id: "alzheimers-detection",
    name: "Alzheimer's Detection Model",
    description: "Detects early signs of Alzheimer's disease through structural analysis.",
    version: "1.5.2",
    isActive: true
  },
  {
    id: "lesion-detection",
    name: "Lesion Detection Model",
    description: "Identifies and classifies various types of brain lesions and abnormalities.",
    version: "2.3.0",
    isActive: true
  },
  {
    id: "volumetric-analysis",
    name: "Volumetric Analysis Model",
    description: "Provides detailed volumetric measurements of brain structures.",
    version: "1.9.1",
    isActive: true
  }
]

const getModelIcon = (name: string) => {
  if (name.toLowerCase().includes('tumor')) return Brain
  if (name.toLowerCase().includes('stroke')) return Activity
  return Scan
}

export default function ModelsPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        } else {
          router.push('/auth')
          return
        }
      } catch (error) {
        router.push('/auth')
        return
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    if (!user) return
    
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models')
        if (response.ok) {
          const data = await response.json()
          setModels(data.length > 0 ? data : staticModels)
        } else {
          setModels(staticModels)
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
        setModels(staticModels)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [user])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/auth')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading models...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <GlobalNavbar user={user} onLogout={handleLogout} />
      <div className="pt-16 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Available Models</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => {
            const Icon = getModelIcon(model.name)
            return (
              <Card key={model.id} className={`${!model.isActive ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">v{model.version}</p>
                      </div>
                    </div>
                    <Badge variant={model.isActive ? "default" : "secondary"}>
                      {model.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{model.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        {models.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No models available</p>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}