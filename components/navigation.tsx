"use client"

import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Step } from "@/app/page"
import type { AuthUser } from "@/components/auth-page"

interface NavigationProps {
  currentStep: Step
  onNavigate: (step: Step) => void
  canAccessModels: boolean
  canAccessResults: boolean
  user: AuthUser
  onLogout: () => void
}

export default function Navigation({ currentStep, onNavigate, canAccessModels, canAccessResults, user, onLogout }: NavigationProps) {
  const steps: { id: Step; label: string; enabled: boolean }[] = [
    { id: "upload", label: "Upload", enabled: true },
    { id: "models", label: "Models", enabled: canAccessModels },
    { id: "results", label: "Results", enabled: canAccessResults },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <User className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            user.role === "ADMIN" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
          }`}>
            {user.role}
          </span>
        </div>
        <div className="flex items-center gap-8">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => step.enabled && onNavigate(step.id)}
              disabled={!step.enabled}
              className={`text-sm font-medium transition-all duration-200 pb-1 border-b-2 ${
                currentStep === step.id
                  ? "text-primary border-primary"
                  : step.enabled
                    ? "text-muted-foreground border-transparent hover:text-foreground"
                    : "text-muted-foreground/40 border-transparent cursor-not-allowed"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </nav>
  )
}
