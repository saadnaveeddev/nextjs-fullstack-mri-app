"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, CloudUpload } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { UploadedFile } from "@/app/page"

interface UploadPageProps {
  onFileUpload: (file: UploadedFile) => void
  onContinue: () => void
  uploadedFile: UploadedFile | null
}

const ALLOWED_FORMATS = ["image/jpeg", "image/png", "application/dicom", "application/x-nifti"]
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".dcm", ".nii", ".nii.gz"]

export default function UploadPage({ onFileUpload, onContinue, uploadedFile }: UploadPageProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const validateFile = (file: File): boolean => {
    const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
    const isValidType = ALLOWED_FORMATS.includes(file.type) || (extension && ALLOWED_EXTENSIONS.includes(extension))

    if (!isValidType) {
      setError("Unsupported file format. Please upload JPEG, PNG, DICOM, or NIfTI files.")
      return false
    }

    setError(null)
    return true
  }

  const handleFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return

      setIsUploading(true)
      setUploadProgress(0)

      try {
        // Create file URL for preview
        const url = URL.createObjectURL(file)
        
        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(interval)
              return 90
            }
            return prev + 10
          })
        }, 100)

        // TODO: Upload to cloud storage and get URL
        // For now, using local blob URL
        setTimeout(() => {
          clearInterval(interval)
          setUploadProgress(100)
          setIsUploading(false)
          
          onFileUpload({
            name: file.name,
            size: file.size,
            type: file.type,
            url,
          })
        }, 2000)
      } catch (error) {
        setError('Upload failed. Please try again.')
        setIsUploading(false)
      }
    },
    [onFileUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl">
        <div className="bg-card rounded-lg shadow-lg p-8 transition-all duration-300">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(26,115,232,0.2)]"
                : "border-border hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <CloudUpload className="w-16 h-16 text-primary/60" />
                <Upload className="w-8 h-8 text-primary absolute -bottom-1 -right-1" />
              </div>

              <div>
                <p className="text-lg font-medium text-foreground mb-2">
                  {"Drag & drop Brain MRI here, or click to upload"}
                </p>
                <p className="text-sm text-muted-foreground">Allowed formats: JPEG, PNG, DICOM, NIfTI</p>
              </div>

              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".jpg,.jpeg,.png,.dcm,.nii,.nii.gz"
                onChange={handleFileInput}
              />
              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                className="mt-4 transition-transform hover:scale-105"
              >
                Select File
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="mt-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">Uploading... {uploadProgress}%</p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg animate-in slide-in-from-bottom-4 duration-300">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {uploadedFile && !isUploading && (
            <div className="mt-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button onClick={onContinue} className="w-full mt-4 transition-transform hover:scale-[1.02]">
                Continue to Model Selection
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
