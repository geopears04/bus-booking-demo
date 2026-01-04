"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, IndianRupee, CreditCard, QrCode } from "lucide-react"
import { QRCodeDisplay } from "@/components/qr-code-display"
import { getUser } from "@/lib/auth"
import { validateUpiId } from "@/lib/validation"
import {
  saveBooking,
  generateBookingId,
  generatePaymentId,
  type Bus,
  type Passenger,
  type Booking,
} from "@/lib/bus-data"
import type { SearchFilters } from "@/components/search-form"

export default function PaymentPage() {
  const router = useRouter()
  const [bus, setBus] = useState<Bus | null>(null)
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "upi">("qr")
  const [upiId, setUpiId] = useState("")
  const [upiError, setUpiError] = useState("")
  const [processing, setProcessing] = useState(false)
  const [loading, setLoading] = useState(true)

  const MERCHANT_UPI_ID = "merchant@upi" // Your UPI ID

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
    if (!data.passengers || data.passengers.length === 0) {
      router.push("/passenger-details")
      return
    }

    setBus(data.bus)
    setSearchFilters(data.searchFilters)
    setSelectedSeats(data.selectedSeats)
    setPassengers(data.passengers)
    setLoading(false)
  }, [router])

  const totalAmount = passengers.length * (bus?.price || 0)

  const handlePayment = () => {
    if (paymentMethod === "upi" && !validateUpiId(upiId)) {
      setUpiError("Please enter a valid UPI ID (e.g., username@bankname)")
      return
    }

    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const user = getUser()!
      const paymentId = generatePaymentId()
      const bookingId = generateBookingId()

      const booking: Booking = {
        id: bookingId,
        userId: user.email,
        bus: bus!,
        passengers,
        journeyDate: searchFilters!.date,
        bookingDate: new Date().toISOString().split("T")[0],
        paymentId,
        paymentStatus: "completed",
        totalAmount,
        paymentMethod,
        upiId: paymentMethod === "upi" ? upiId : undefined,
      }

      saveBooking(booking)

      // Clear booking data
      localStorage.removeItem("bookingData")

      // Redirect to ticket page
      router.push(`/ticket/${bookingId}`)
    }, 2000)
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
            <Button
              variant="ghost"
              onClick={() => router.push("/passenger-details")}
              className="gap-2"
              disabled={processing}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl font-bold">Payment</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Booking Summary */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bus</span>
                <span className="font-medium">{bus.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route</span>
                <span className="font-medium">
                  {bus.route.from} to {bus.route.to}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Journey Date</span>
                <span className="font-medium">{new Date(searchFilters.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seats</span>
                <span className="font-medium">{selectedSeats.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Passengers</span>
                <span className="font-medium">{passengers.length}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="flex items-center">
                  <IndianRupee className="h-5 w-5" />
                  {totalAmount}
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Method Selection */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Select Payment Method</h3>
            <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "qr" | "upi")}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="qr" id="qr" />
                  <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer flex-1">
                    <QrCode className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Scan QR Code</p>
                      <p className="text-xs text-muted-foreground">Use any UPI app to scan and pay</p>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Enter UPI ID</p>
                      <p className="text-xs text-muted-foreground">Pay using your UPI ID</p>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </Card>

          {/* Payment Details */}
          {paymentMethod === "qr" ? (
            <QRCodeDisplay amount={totalAmount} upiId={MERCHANT_UPI_ID} />
          ) : (
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Enter Your UPI ID</h3>
                  <p className="text-sm text-muted-foreground">You will receive a payment request on your UPI app</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upi-id">UPI ID *</Label>
                  <Input
                    id="upi-id"
                    type="text"
                    placeholder="yourname@bankname"
                    value={upiId}
                    onChange={(e) => {
                      setUpiId(e.target.value)
                      setUpiError("")
                    }}
                    className={upiError ? "border-destructive" : ""}
                  />
                  {upiError && <p className="text-xs text-destructive">{upiError}</p>}
                  <p className="text-xs text-muted-foreground">Example: 9876543210@paytm, user@oksbi, name@ybl</p>
                </div>
              </div>
            </Card>
          )}

          {/* Pay Button */}
          <Card className="p-4 sticky bottom-4">
            <Button onClick={handlePayment} size="lg" className="w-full" disabled={processing}>
              {processing ? "Processing Payment..." : `Pay ₹${totalAmount}`}
            </Button>
          </Card>

          {/* Instructions */}
          <Card className="p-4 bg-muted">
            <h4 className="font-semibold text-sm mb-2">Important Instructions</h4>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Complete the payment within 10 minutes</li>
              <li>Do not refresh or close this page during payment</li>
              <li>Your ticket will be generated after successful payment</li>
              <li>You will receive booking confirmation on your registered email</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  )
}
