"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import GlobalNavbar from "@/components/global-navbar"

import UploadPage from "@/components/upload-page"
import ModelSelectionPage from "@/components/model-selection-page"
import ResultsPage from "@/components/results-page"
import { type AuthUser } from "@/components/auth-page"

export type Step = "upload" | "models" | "results"

export interface UploadedFile {
  name: string
  size: number
  type: string
  url: string
}

export interface SelectedModel {
  id: string
  title: string
  description: string
  version?: string
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [currentStep, setCurrentStep] = useState<Step>("upload")
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [selectedModel, setSelectedModel] = useState<SelectedModel | null>(null)
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
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file)
  }

  const handleContinueToModels = () => {
    setCurrentStep("models")
  }

  const handleModelSelect = (model: SelectedModel) => {
    setSelectedModel(model)
    setCurrentStep("results")
  }

  const handleNavigate = (step: Step) => {
    if (step === "upload") {
      setCurrentStep("upload")
    } else if (step === "models" && uploadedFile) {
      setCurrentStep("models")
    } else if (step === "results" && uploadedFile && selectedModel) {
      setCurrentStep("results")
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setCurrentStep('upload')
    setUploadedFile(null)
    setSelectedModel(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <GlobalNavbar user={user} onLogout={handleLogout} />
      <div className="pt-16">
        {/* Stepper Navigation */}
        <div className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center space-x-8">
              {[
                { id: "upload" as Step, label: "Upload", enabled: true },
                { id: "models" as Step, label: "Model Selection", enabled: !!uploadedFile },
                { id: "results" as Step, label: "Results", enabled: !!uploadedFile && !!selectedModel },
              ].map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => step.enabled && handleNavigate(step.id)}
                    disabled={!step.enabled}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : step.enabled
                          ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      currentStep === step.id ? "bg-primary-foreground text-primary" : "bg-current text-current"
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{step.label}</span>
                  </button>
                  {index < 2 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      (index === 0 && uploadedFile) || (index === 1 && selectedModel)
                        ? "bg-primary"
                        : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <main>
          {currentStep === "upload" && (
            <UploadPage onFileUpload={handleFileUpload} onContinue={handleContinueToModels} uploadedFile={uploadedFile} />
          )}
          {currentStep === "models" && <ModelSelectionPage onModelSelect={handleModelSelect} />}
          {currentStep === "results" && uploadedFile && selectedModel && (
            <ResultsPage uploadedFile={uploadedFile} selectedModel={selectedModel} />
          )}
        </main>
      </div>
    </div>
  )
}
