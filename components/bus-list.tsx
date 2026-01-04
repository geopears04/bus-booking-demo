"use client"

import type { Bus } from "@/lib/bus-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, IndianRupee, Armchair } from "lucide-react"
import Image from "next/image"

interface BusListProps {
  buses: Bus[]
  onSelectBus: (bus: Bus) => void
}

export function BusList({ buses, onSelectBus }: BusListProps) {
  if (buses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground text-lg">No buses found for your search criteria</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search for a different route</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {buses.map((bus) => {
        const availableSeats = bus.seats.filter((s) => !s.isBooked).length

        return (
          <Card
            key={bus.id}
            className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-primary/5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
              {/* Bus Image */}
              <div className="lg:col-span-3">
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted shadow-md">
                  <Image
                    src={bus.image || "/placeholder.svg"}
                    alt={bus.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Bus Details */}
              <div className="lg:col-span-6 space-y-3">
                <div>
                  <h3 className="font-bold text-xl text-primary">{bus.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium">{bus.busNumber}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1 bg-secondary text-secondary-foreground">
                    <Armchair className="h-3 w-3" />
                    {bus.type}
                  </Badge>
                  <Badge variant={availableSeats > 10 ? "default" : "destructive"} className="font-semibold">
                    {availableSeats} Seats Available
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-foreground">{bus.route.from}</p>
                      <p className="text-muted-foreground">to {bus.route.to}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">{bus.departureTime}</span>
                      <span className="text-muted-foreground"> - </span>
                      <span className="font-semibold text-foreground">{bus.arrivalTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="lg:col-span-3 flex flex-col justify-between items-end gap-4">
                <div className="text-right bg-gradient-to-br from-accent/10 to-primary/10 px-4 py-3 rounded-xl">
                  <div className="flex items-center justify-end gap-1">
                    <IndianRupee className="h-6 w-6 text-accent" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                      {bus.price}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">per seat</p>
                </div>

                <Button
                  onClick={() => onSelectBus(bus)}
                  size="lg"
                  className="w-full lg:w-auto bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
                  disabled={availableSeats === 0}
                >
                  {availableSeats === 0 ? "Sold Out" : "Select Seats"}
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
