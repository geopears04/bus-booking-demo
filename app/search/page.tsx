"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SearchForm, type SearchFilters } from "@/components/search-form"
import { BusList } from "@/components/bus-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getBusesForRoute, type Bus } from "@/lib/bus-data"
import { getUser } from "@/lib/auth"

export default function SearchPage() {
  const router = useRouter()
  const [buses, setBuses] = useState<Bus[]>([])
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/")
      return
    }
    setLoading(false)
  }, [router])

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters)
    const foundBuses = getBusesForRoute(filters.from, filters.to)
    setBuses(foundBuses)
  }

  const handleSelectBus = (bus: Bus) => {
    if (!searchFilters) return

    // Store search details in localStorage
    localStorage.setItem(
      "bookingData",
      JSON.stringify({
        bus,
        searchFilters,
      }),
    )

    router.push("/select-seat")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Search Buses</h1>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("user")
                router.push("/")
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <SearchForm onSearch={handleSearch} />

          {searchFilters && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Available Buses ({buses.length})</h2>
              <BusList buses={buses} onSelectBus={handleSelectBus} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
