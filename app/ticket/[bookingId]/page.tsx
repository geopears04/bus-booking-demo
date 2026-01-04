"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, MapPin, User, Phone, Mail, IndianRupee } from "lucide-react"
import { getBookings, type Booking } from "@/lib/bus-data"
import { getUser } from "@/lib/auth"
import Image from "next/image"

export default function TicketPage() {
  const router = useRouter()
  const params = useParams()
  const ticketRef = useRef<HTMLDivElement>(null)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = getUser()
    if (!user) {
      router.push("/")
      return
    }

    const bookingId = params.bookingId as string
    const bookings = getBookings()
    const foundBooking = bookings.find((b) => b.id === bookingId)

    if (!foundBooking) {
      alert("Booking not found")
      router.push("/search")
      return
    }

    setBooking(foundBooking)
    setLoading(false)
  }, [router, params])

  const handleDownload = async () => {
    if (!ticketRef.current) return

    try {
      // Use html2canvas to capture the ticket
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
      })

      // Convert to image and download
      const link = document.createElement("a")
      link.download = `bus-ticket-${booking?.id}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Download failed:", error)
      alert("Failed to download ticket. Please try again.")
    }
  }

  if (loading || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/search")}>
              Back to Search
            </Button>
            <h1 className="text-xl font-bold">Your Ticket</h1>
            <Button variant="outline" onClick={handleDownload} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Ticket */}
          <div ref={ticketRef} className="bg-white">
            <Card className="overflow-hidden border-2 shadow-2xl">
              {/* Bus Image Header */}
              <div className="relative h-64 w-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <Image
                  src={booking.bus.image || "/placeholder.svg"}
                  alt={booking.bus.name}
                  fill
                  className="object-contain p-4"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-3xl font-bold drop-shadow-lg">{booking.bus.name}</h3>
                  <p className="text-lg opacity-95 font-semibold">{booking.bus.busNumber}</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Booking ID */}
                <div className="flex items-center justify-between pb-4 border-b-2 border-primary/20">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Booking ID</p>
                    <p className="font-mono font-bold text-xl text-primary">{booking.id}</p>
                  </div>
                  <Badge variant="default" className="text-base px-4 py-2 bg-gradient-to-r from-primary to-secondary">
                    {booking.paymentStatus.toUpperCase()}
                  </Badge>
                </div>

                {/* Journey Details */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-5 rounded-xl border-2 border-primary/20">
                  <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-primary">
                    <MapPin className="h-6 w-6" />
                    Journey Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Bus Name</p>
                        <p className="font-bold text-lg text-foreground">{booking.bus.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">From</p>
                        <p className="font-bold text-foreground">{booking.bus.route.from}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Departure Time</p>
                        <p className="font-bold text-lg text-accent">{booking.bus.departureTime}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Bus Number</p>
                        <p className="font-bold text-lg text-foreground">{booking.bus.busNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">To</p>
                        <p className="font-bold text-foreground">{booking.bus.route.to}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold uppercase">Arrival Time</p>
                        <p className="font-bold text-lg text-accent">{booking.bus.arrivalTime}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">Journey Date</p>
                      <p className="font-bold text-foreground">
                        {new Date(booking.journeyDate).toLocaleDateString("en-IN", { dateStyle: "long" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">Booking Date</p>
                      <p className="font-bold text-foreground">
                        {new Date(booking.bookingDate).toLocaleDateString("en-IN", { dateStyle: "long" })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passenger Details */}
                <div className="bg-gradient-to-br from-secondary/5 to-accent/5 p-5 rounded-xl border-2 border-secondary/20">
                  <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-secondary">
                    <User className="h-6 w-6" />
                    Passenger Details
                  </h4>
                  <div className="space-y-3">
                    {booking.passengers.map((passenger, index) => (
                      <Card key={index} className="p-4 bg-white border-2 border-secondary/20 shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase">Name</p>
                            <p className="font-bold text-base">{passenger.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase">Age / Gender</p>
                            <p className="font-bold text-base">
                              {passenger.age} / {passenger.gender === "male" ? "Male" : "Female"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 font-semibold uppercase">
                              <Phone className="h-3 w-3" /> Mobile
                            </p>
                            <p className="font-bold text-base">{passenger.mobile}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 font-semibold uppercase">
                              <Mail className="h-3 w-3" /> Email
                            </p>
                            <p className="font-bold text-base break-all">{passenger.email}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase">Seat Number</p>
                            <Badge variant="outline" className="font-mono text-base font-bold border-2 border-primary">
                              {passenger.seatNumber}
                            </Badge>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gradient-to-br from-accent/5 to-primary/5 p-5 rounded-xl border-2 border-accent/20">
                  <h4 className="font-bold text-xl mb-4 flex items-center gap-2 text-accent">
                    <IndianRupee className="h-6 w-6" />
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">Payment ID</p>
                      <p className="font-mono font-bold text-base">{booking.paymentId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">Payment Status</p>
                      <Badge variant="default" className="bg-gradient-to-r from-primary to-secondary text-base">
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold uppercase">Total Amount</p>
                      <p className="font-bold text-2xl text-accent">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* Important Instructions */}
                <div className="border-t-2 border-destructive/30 pt-4 bg-destructive/5 p-4 rounded-lg">
                  <h4 className="font-bold text-base mb-3 text-destructive flex items-center gap-2">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Important Instructions
                  </h4>
                  <ul className="text-xs space-y-1.5 list-disc list-inside text-muted-foreground leading-relaxed">
                    <li>Please carry a valid government-issued ID proof during your journey</li>
                    <li>Report to the boarding point at least 30 minutes before departure</li>
                    <li>Ticket once booked cannot be cancelled or transferred</li>
                    <li>SMS and email confirmation will be sent to registered contact details</li>
                    <li>Refund/cancellation policy as per operator terms and conditions</li>
                    <li>Passengers are advised to verify boarding point details before travel</li>
                    <li>Keep this ticket handy for verification during boarding</li>
                    <li>For any queries, contact customer support with booking ID</li>
                  </ul>
                </div>

                {/* Footer */}
                <div className="text-center pt-4 border-t-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-foreground">
                    Thank you for booking with us! Have a safe journey.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 font-medium">
                    For support: support@busbooking.com | +91-1800-XXX-XXXX
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleDownload}
              size="lg"
              className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg"
            >
              <Download className="h-5 w-5" />
              Download Ticket
            </Button>
            <Button variant="outline" onClick={() => router.push("/search")} size="lg" className="flex-1 border-2">
              Book Another Ticket
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
