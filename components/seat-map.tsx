"use client"

import type { Seat } from "@/lib/bus-data"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SeatMapProps {
  seats: Seat[]
  selectedSeats: string[]
  onSeatSelect: (seatNumber: string) => void
  userGender: "male" | "female"
  genderPreference: "male" | "female" | "any"
}

export function SeatMap({ seats, selectedSeats, onSeatSelect, userGender, genderPreference }: SeatMapProps) {
  const rows = Math.max(...seats.map((s) => s.position.row)) + 1
  const cols = 4

  const canSelectSeat = (seat: Seat): boolean => {
    if (seat.isBooked) return false

    // If user selected "any" preference, they can sit anywhere
    if (genderPreference === "any") return true

    // If user selected gender preference, check adjacent seats
    const { row, col } = seat.position

    // Check adjacent seats (left and right in same row)
    const adjacentSeats = seats.filter(
      (s) => s.position.row === row && Math.abs(s.position.col - col) === 1 && s.isBooked,
    )

    // If there are booked adjacent seats, check if they match user gender
    if (adjacentSeats.length > 0) {
      return adjacentSeats.every((s) => s.gender === userGender)
    }

    return true
  }

  const getSeatColor = (seat: Seat): string => {
    if (selectedSeats.includes(seat.number)) {
      return "bg-primary text-primary-foreground hover:bg-primary"
    }
    if (seat.isBooked) {
      return seat.gender === "male"
        ? "bg-blue-500 text-white cursor-not-allowed"
        : "bg-pink-500 text-white cursor-not-allowed"
    }
    if (!canSelectSeat(seat)) {
      return "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
    }
    return "bg-background border-2 border-primary hover:bg-primary/10"
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-background border-2 border-primary rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded" />
          <span>Booked (Male)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-pink-500 rounded" />
          <span>Booked (Female)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded" />
          <span>Selected</span>
        </div>
      </div>

      {/* Driver section */}
      <div className="text-center mb-4">
        <div className="inline-block px-6 py-2 bg-muted rounded-t-lg font-medium">Driver</div>
      </div>

      {/* Seat Grid */}
      <div className="max-w-md mx-auto">
        <div className="grid gap-3">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-9 gap-2 items-center">
              {/* Left side seats (2 seats) */}
              {[0, 1].map((colIndex) => {
                const seat = seats.find((s) => s.position.row === rowIndex && s.position.col === colIndex)
                if (!seat) return <div key={colIndex} className="w-10 h-10" />

                return (
                  <Button
                    key={seat.id}
                    variant="outline"
                    size="sm"
                    className={cn("w-10 h-10 p-0 font-mono text-xs", getSeatColor(seat))}
                    onClick={() => canSelectSeat(seat) && onSeatSelect(seat.number)}
                    disabled={seat.isBooked || !canSelectSeat(seat)}
                  >
                    {seat.number}
                  </Button>
                )
              })}

              {/* Aisle */}
              <div className="col-span-1 h-10 flex items-center justify-center">
                <div className="h-full w-px bg-muted-foreground/20" />
              </div>

              {/* Right side seats (2 seats) */}
              {[2, 3].map((colIndex) => {
                const seat = seats.find((s) => s.position.row === rowIndex && s.position.col === colIndex)
                if (!seat) return <div key={colIndex} className="w-10 h-10" />

                return (
                  <Button
                    key={seat.id}
                    variant="outline"
                    size="sm"
                    className={cn("w-10 h-10 p-0 font-mono text-xs", getSeatColor(seat))}
                    onClick={() => canSelectSeat(seat) && onSeatSelect(seat.number)}
                    disabled={seat.isBooked || !canSelectSeat(seat)}
                  >
                    {seat.number}
                  </Button>
                )
              })}

              {/* Row label */}
              <div className="col-span-4 text-xs text-muted-foreground text-right">Row {rowIndex + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gender preference warning */}
      {genderPreference !== "any" && (
        <div className="text-center text-sm text-muted-foreground bg-muted p-3 rounded">
          You selected {genderPreference} preference. Only seats next to {genderPreference} passengers are available.
        </div>
      )}
    </div>
  )
}
