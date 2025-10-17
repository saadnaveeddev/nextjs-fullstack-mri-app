"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import GlobalNavbar from "@/components/global-navbar"
import { type AuthUser } from "@/components/auth-page"

export default function FAQPage() {
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
          <div className="flex items-center space-x-3 mb-8">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What file formats are supported?</AccordionTrigger>
                  <AccordionContent>
                    We support JPEG, PNG, DICOM (.dcm), and NIfTI (.nii, .nii.gz) formats. 
                    For best results, use DICOM or NIfTI formats as they preserve medical imaging metadata.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How long does processing take?</AccordionTrigger>
                  <AccordionContent>
                    Processing time varies by model complexity and image size, typically 2-10 minutes. 
                    You'll receive real-time updates on processing status.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Is my data secure?</AccordionTrigger>
                  <AccordionContent>
                    Yes, all uploads are encrypted and processed securely. Images are automatically 
                    deleted after processing unless you choose to save them to your account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I download my results?</AccordionTrigger>
                  <AccordionContent>
                    Yes, completed scans can be downloaded in multiple formats including 
                    segmentation masks and detailed analysis reports.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>What's the difference between models?</AccordionTrigger>
                  <AccordionContent>
                    Each model is trained for specific tasks: Tumor Detection focuses on identifying 
                    tumors, Stroke Analysis detects stroke-affected areas, and General Segmentation 
                    provides comprehensive brain tissue classification.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}