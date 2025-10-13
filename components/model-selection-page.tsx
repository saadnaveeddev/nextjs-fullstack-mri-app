"use client"

import { useState, useEffect } from "react"
import { Brain, Activity, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SelectedModel } from "@/app/page"

interface ModelSelectionPageProps {
  onModelSelect: (model: SelectedModel) => void
}

interface Model {
  id: string
  name: string
  description: string
  version: string
  isActive: boolean
}

const getModelIcon = (name: string) => {
  if (name.toLowerCase().includes('tumor')) return Brain
  if (name.toLowerCase().includes('stroke')) return Activity
  return Scan
}

export default function ModelSelectionPage({ onModelSelect }: ModelSelectionPageProps) {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models')
        if (response.ok) {
          const data = await response.json()
          setModels(data)
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchModels()
  }, [])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading models...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-foreground mb-8 text-balance">Select a Model</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => {
            const Icon = getModelIcon(model.name)
            return (
              <div
                key={model.id}
                className="bg-card rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2 text-balance">{model.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{model.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">Version: {model.version}</p>
                  </div>
                </div>

                <Button
                  onClick={() =>
                    onModelSelect({
                      id: model.id,
                      title: model.name,
                      description: model.description,
                      version: model.version
                    })
                  }
                  className="mt-auto ml-auto transition-transform hover:scale-105"
                >
                  Select
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
