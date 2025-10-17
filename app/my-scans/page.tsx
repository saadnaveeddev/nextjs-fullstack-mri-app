"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ScanHistory from "@/components/scan-history"
import GlobalNavbar from "@/components/global-navbar"
import { type AuthUser } from "@/components/auth-page"

export default function MyScansPage() {
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
        } else {
          router.push('/auth')
          return
        }
      } catch (error) {
        router.push('/auth')
        return
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/auth')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <GlobalNavbar user={user} onLogout={handleLogout} />
      <div className="pt-16">
        <ScanHistory />
      </div>
    </div>
  )
}