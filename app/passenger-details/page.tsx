"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Mail, Phone, Calendar } from "lucide-react"
import { getUser } from "@/lib/auth"
import { validateEmail, validateMobile, validateName, validateAge } from "@/lib/validation"
import type { Bus, Passenger } from "@/lib/bus-data"
import type { SearchFilters } from "@/components/search-form"

export default function PassengerDetailsPage() {
  const router = useRouter()
  const [bus, setBus] = useState<Bus | null>(null)
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    if (!data.selectedSeats || data.selectedSeats.length === 0) {
      router.push("/select-seat")
      return
    }

    setBus(data.bus)
    setSearchFilters(data.searchFilters)
    setSelectedSeats(data.selectedSeats)

    // Initialize passenger forms
    const initialPassengers: Passenger[] = data.selectedSeats.map((seatNumber: string) => ({
      name: "",
      age: 0,
      gender: "male" as "male" | "female",
      mobile: "",
      email: "",
      seatNumber,
    }))
    setPassengers(initialPassengers)
    setLoading(false)
  }, [router])

  const updatePassenger = (index: number, field: keyof Passenger, value: string | number) => {
    setPassengers((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
    // Clear error for this field
    setErrors((prev) => {
      const updated = { ...prev }
      delete updated[`${index}-${field}`]
      return updated
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    passengers.forEach((passenger, index) => {
      if (!validateName(passenger.name)) {
        newErrors[`${index}-name`] = "Please enter a valid name (min 2 characters)"
      }
      if (!validateAge(passenger.age)) {
        newErrors[`${index}-age`] = "Age must be between 1 and 120"
      }
      if (!validateMobile(passenger.mobile)) {
        newErrors[`${index}-mobile`] = "Please enter a valid 10-digit mobile number"
      }
      if (!validateEmail(passenger.email)) {
        newErrors[`${index}-email`] = "Please enter a valid email address"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (!validateForm()) {
      alert("Please fill all fields correctly")
      return
    }

    // Save passenger details
    const bookingData = JSON.parse(localStorage.getItem("bookingData") || "{}")
    bookingData.passengers = passengers
    localStorage.setItem("bookingData", JSON.stringify(bookingData))

    router.push("/payment")
  }

  if (loading || !bus || !searchFilters) {
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
            <Button variant="ghost" onClick={() => router.push("/select-seat")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-bold">Passenger Details</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">
              Enter details for {selectedSeats.length} passenger{selectedSeats.length > 1 ? "s" : ""}
            </p>
          </Card>

          {/* Passenger Forms */}
          {passengers.map((passenger, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold text-lg mb-4">
                Passenger {index + 1} - Seat {passenger.seatNumber}
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`} className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Full Name *
                  </Label>
                  <Input
                    id={`name-${index}`}
                    type="text"
                    placeholder="Enter full name"
                    value={passenger.name}
                    onChange={(e) => updatePassenger(index, "name", e.target.value)}
                    className={errors[`${index}-name`] ? "border-destructive" : ""}
                  />
                  {errors[`${index}-name`] && <p className="text-xs text-destructive">{errors[`${index}-name`]}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor={`age-${index}`} className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Age *
                    </Label>
                    <Input
                      id={`age-${index}`}
                      type="number"
                      placeholder="Enter age"
                      min="1"
                      max="120"
                      value={passenger.age || ""}
                      onChange={(e) => updatePassenger(index, "age", Number.parseInt(e.target.value) || 0)}
                      className={errors[`${index}-age`] ? "border-destructive" : ""}
                    />
                    {errors[`${index}-age`] && <p className="text-xs text-destructive">{errors[`${index}-age`]}</p>}
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor={`gender-${index}`}>Gender *</Label>
                    <Select value={passenger.gender} onValueChange={(value) => updatePassenger(index, "gender", value)}>
                      <SelectTrigger id={`gender-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor={`mobile-${index}`} className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Mobile Number *
                  </Label>
                  <Input
                    id={`mobile-${index}`}
                    type="tel"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={passenger.mobile}
                    onChange={(e) => updatePassenger(index, "mobile", e.target.value.replace(/\D/g, ""))}
                    className={errors[`${index}-mobile`] ? "border-destructive" : ""}
                  />
                  {errors[`${index}-mobile`] && <p className="text-xs text-destructive">{errors[`${index}-mobile`]}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor={`email-${index}`} className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email Address *
                  </Label>
                  <Input
                    id={`email-${index}`}
                    type="email"
                    placeholder="your.email@example.com"
                    value={passenger.email}
                    onChange={(e) => updatePassenger(index, "email", e.target.value)}
                    className={errors[`${index}-email`] ? "border-destructive" : ""}
                  />
                  {errors[`${index}-email`] && <p className="text-xs text-destructive">{errors[`${index}-email`]}</p>}
                </div>
              </div>
            </Card>
          ))}

          {/* Continue Button */}
          <Card className="p-4 sticky bottom-4">
            <Button onClick={handleContinue} size="lg" className="w-full">
              Continue to Payment
            </Button>
          </Card>
        </div>
      </main>
    </div>
  )
}
