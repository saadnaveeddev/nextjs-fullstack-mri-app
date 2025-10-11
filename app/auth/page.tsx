"use client"

import { useRouter } from "next/navigation"
import AuthPage, { type AuthUser } from "@/components/auth-page"

export default function AuthPageRoute() {
  const router = useRouter()

  const handleAuth = (user: AuthUser) => {
    // Redirect to home after successful auth
    router.push('/')
  }

  return <AuthPage onAuth={handleAuth} />
}