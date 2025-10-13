"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, User, Home, History, Brain, HelpCircle } from "lucide-react"
import type { AuthUser } from "@/components/auth-page"

interface GlobalNavbarProps {
  user: AuthUser | null
  onLogout: () => void
}

export default function GlobalNavbar({ user, onLogout }: GlobalNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold text-primary">
            Brain MRI Platform
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-sm hover:text-primary">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link href="/my-scans" className="flex items-center space-x-2 text-sm hover:text-primary">
                <History className="w-4 h-4" />
                <span>My Scans</span>
              </Link>
              <Link href="/models" className="flex items-center space-x-2 text-sm hover:text-primary">
                <Brain className="w-4 h-4" />
                <span>Models</span>
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="flex items-center space-x-2 text-sm hover:text-primary">
                  <User className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-sm hover:text-primary">
                  <HelpCircle className="w-4 h-4" />
                  <span>Help</span>
                </button>
                <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link href="/help/docs" className="block px-4 py-2 text-sm hover:bg-accent whitespace-nowrap">
                    Documentation
                  </Link>
                  <Link href="/help/faq" className="block px-4 py-2 text-sm hover:bg-accent whitespace-nowrap">
                    FAQ
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.role === "ADMIN" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                }`}>
                  {user.role}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/auth">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}