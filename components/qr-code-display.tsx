"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IndianRupee } from "lucide-react"

interface QRCodeDisplayProps {
  amount: number
  upiId: string
}

export function QRCodeDisplay({ amount, upiId }: QRCodeDisplayProps) {
  // Generate UPI QR code URL
  const upiString = `upi://pay?pa=${upiId}&pn=BusBooking&am=${amount}&cu=INR`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}`

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">Scan QR Code to Pay</h3>
          <p className="text-sm text-muted-foreground">Use any UPI app to scan and pay</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border-2 border-primary">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="Payment QR Code" className="w-64 h-64" />
          </div>
        </div>

        {/* Amount Badge */}
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <IndianRupee className="h-5 w-5 mr-1" />
          {amount}
        </Badge>

        {/* UPI ID */}
        <div className="text-sm">
          <p className="text-muted-foreground">UPI ID</p>
          <p className="font-mono font-medium">{upiId}</p>
        </div>
      </div>
    </Card>
  )
}
