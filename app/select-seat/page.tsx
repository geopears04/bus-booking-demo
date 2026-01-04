"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, IndianRupee } from "lucide-react"
import { SeatMap } from "@/components/seat-map"
import { getUser } from "@/lib/auth"
import type { Bus } from "@/lib/bus-data"
import type { SearchFilters } from "@/components/search-form"
import Image from "next/image"

export default function SelectSeatPage() {
  const router = useRouter()
  const [bus, setBus] = useState<Bus | null>(null)
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/")
      return
    }

    const bookingData = localStorage.getItem("bookingData")
    if (!bookingData) {
      router.push("/search")
      return
    }

    const data = JSON.parse(bookingData)
    setBus(data.bus)
    setSearchFilters(data.searchFilters)
    setLoading(false)
  }, [router])

  const handleSeatSelect = (seatNumber: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber)
      }
      return [...prev, seatNumber]
    })
  }

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat")
      return
    }

    // Save selected seats
    const bookingData = JSON.parse(localStorage.getItem("bookingData") || "{}")
    bookingData.selectedSeats = selectedSeats
    localStorage.setItem("bookingData", JSON.stringify(bookingData))

    router.push("/passenger-details")
  }

  if (loading || !bus || !searchFilters) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const user = getUser()!
  const totalPrice = selectedSeats.length * bus.price

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/search")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-bold">Select Seats</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Bus Info Card */}
          <Card className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3">
                <div className="relative h-32 w-full rounded-lg overflow-hidden bg-muted">
                  <Image src={bus.image || "/placeholder.svg"} alt={bus.name} fill className="object-cover" />
                </div>
              </div>

              <div className="md:col-span-9 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{bus.name}</h2>
                    <p className="text-sm text-muted-foreground">{bus.busNumber}</p>
                  </div>
                  <Badge>{bus.type}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>
                      {bus.route.from} to {bus.route.to}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>
                      {bus.departureTime} - {bus.arrivalTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-lg font-bold">
                  <IndianRupee className="h-5 w-5" />
                  <span>{bus.price}</span>
                  <span className="text-sm font-normal text-muted-foreground">per seat</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Seat Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Choose Your Seats</h3>
            <SeatMap
              seats={bus.seats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              userGender={user.gender}
              genderPreference={searchFilters.gender}
            />
          </Card>

          {/* Summary and Continue */}
          {selectedSeats.length > 0 && (
            <Card className="p-4 sticky bottom-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Seats</p>
                  <p className="font-semibold">{selectedSeats.join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <div className="flex items-center gap-1 text-2xl font-bold">
                    <IndianRupee className="h-5 w-5" />
                    <span>{totalPrice}</span>
                  </div>
                </div>
                <Button onClick={handleContinue} size="lg">
                  Continue
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
