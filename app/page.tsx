"use client"

import { useState, useEffect } from "react"
import { AuthForm } from "@/components/auth-form"
import { authService } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Bus, MapPin, Shield, Zap } from "lucide-react"

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated()
      setIsAuthenticated(authenticated)
      setIsLoading(false)

      if (authenticated) {
        router.push("/search")
      }
    }

    checkAuth()
  }, [router])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    router.push("/search")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <Bus className="h-12 w-12 text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary font-bold border-2 border-primary/30">
              <Bus className="h-5 w-5" />
              <span>India's Trusted Bus Booking Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Book Your Bus Journey
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 text-pretty font-medium">
              Safe, comfortable, and affordable travel across India. Book your tickets in minutes with our easy-to-use
              platform.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 py-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm text-muted-foreground font-semibold">Buses</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border-2 border-secondary/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                100+
              </div>
              <div className="text-sm text-muted-foreground font-semibold">Routes</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20">
              <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-sm text-muted-foreground font-semibold">Support</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm bg-primary/5 p-3 rounded-lg border border-primary/20">
              <Shield className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="font-semibold">Gender-based seating preferences available</span>
            </div>
            <div className="flex items-center gap-3 text-sm bg-secondary/5 p-3 rounded-lg border border-secondary/20">
              <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
              <span className="font-semibold">Book up to 90 days in advance</span>
            </div>
            <div className="flex items-center gap-3 text-sm bg-accent/5 p-3 rounded-lg border border-accent/20">
              <Zap className="h-5 w-5 text-accent flex-shrink-0" />
              <span className="font-semibold">Instant ticket confirmation and download</span>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="order-1 lg:order-2">
          <AuthForm onSuccess={handleAuthSuccess} />
        </div>
      </div>
    </div>
  )
}
