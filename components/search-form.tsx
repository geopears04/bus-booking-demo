"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users } from "lucide-react"
import { ROUTES } from "@/lib/bus-data"

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void
}

export interface SearchFilters {
  from: string
  to: string
  date: string
  gender: "male" | "female" | "any"
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState("")
  const [gender, setGender] = useState<"male" | "female" | "any">("any")

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  // Get date 90 days from now
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 90)
  const max = maxDate.toISOString().split("T")[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!from || !to || !date) {
      alert("Please fill all fields")
      return
    }
    if (from === to) {
      alert("Source and destination cannot be the same")
      return
    }
    onSearch({ from, to, date, gender })
  }

  const cities = Array.from(new Set(ROUTES.flatMap((route) => [route.from, route.to]))).sort()

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From */}
          <div className="space-y-2">
            <Label htmlFor="from" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              From
            </Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger id="from">
                <SelectValue placeholder="Select source city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label htmlFor="to" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              To
            </Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger id="to">
                <SelectValue placeholder="Select destination city" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Journey Date
            </Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              max={max}
              required
            />
          </div>

          {/* Gender Preference */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Gender Preference
            </Label>
            <Select value={gender} onValueChange={(value) => setGender(value as "male" | "female" | "any")}>
              <SelectTrigger id="gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="male">Male (Sit with Male only)</SelectItem>
                <SelectItem value="female">Female (Sit with Female only)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Search Buses
        </Button>
      </form>
    </Card>
  )
}
