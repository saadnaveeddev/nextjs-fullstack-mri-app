"use client"

import { useState, useEffect } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UploadedFile, SelectedModel } from "@/app/page"

interface ResultsPageProps {
  uploadedFile: UploadedFile
  selectedModel: SelectedModel
}

type ViewMode = "overlay" | "side-by-side"

export default function ResultsPage({ uploadedFile, selectedModel }: ResultsPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("overlay")
  const [isLoading, setIsLoading] = useState(true)
  const [opacity, setOpacity] = useState(50)

  useEffect(() => {
    // Simulate model prediction and save scan
    const timer = setTimeout(async () => {
      try {
        // Create scan record
        await fetch('/api/scans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: uploadedFile.name,
            originalUrl: uploadedFile.url,
            size: uploadedFile.size,
            modelId: selectedModel.id,
            status: 'COMPLETED'
          })
        })
      } catch (error) {
        console.error('Failed to save scan:', error)
      }
      setIsLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [uploadedFile, selectedModel])

  const handleDownload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      // Draw original image
      ctx?.drawImage(img, 0, 0)
      
      // Add overlay effect
      if (ctx) {
        ctx.fillStyle = `rgba(59, 130, 246, ${opacity / 300})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `mri-results-${selectedModel.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    }
    
    img.crossOrigin = 'anonymous'
    img.src = uploadedFile.url || '/placeholder.svg'
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Results</h1>
          <Button onClick={handleDownload} disabled={isLoading} className="transition-transform hover:scale-105">
            <Download className="w-4 h-4 mr-2" />
            Download Results
          </Button>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Model</p>
              <p className="font-medium text-foreground">{selectedModel.title}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "overlay" ? "default" : "outline"}
                onClick={() => setViewMode("overlay")}
                className="transition-all"
              >
                Overlay Mode
              </Button>
              <Button
                variant={viewMode === "side-by-side" ? "default" : "outline"}
                onClick={() => setViewMode("side-by-side")}
                className="transition-all"
              >
                Side-by-Side Mode
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-300">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Running model...</p>
            </div>
          ) : (
            <>
              {viewMode === "overlay" ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="relative bg-secondary/20 rounded-lg overflow-hidden aspect-square max-w-2xl mx-auto">
                    <img
                      src={uploadedFile.url || "/placeholder.svg"}
                      alt="Original MRI"
                      className="w-full h-full object-contain"
                    />
                    <div
                      className="absolute inset-0 bg-primary/30 mix-blend-multiply"
                      style={{ opacity: opacity / 100 }}
                    />
                  </div>

                  <div className="mt-6 max-w-2xl mx-auto">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Overlay Opacity: {opacity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-secondary/20 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-medium text-foreground">Original MRI</p>
                    </div>
                    <div className="aspect-square">
                      <img
                        src={uploadedFile.url || "/placeholder.svg"}
                        alt="Original MRI"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="bg-secondary/20 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-medium text-foreground">Predicted Output</p>
                    </div>
                    <div className="aspect-square relative">
                      <img
                        src={uploadedFile.url || "/placeholder.svg"}
                        alt="Predicted MRI"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-primary/30 mix-blend-multiply" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
