import busesData from "./buses-data.json"

export interface Seat {
  id: string
  number: string
  type: "normal" | "sleeper"
  isBooked: boolean
  gender?: "male" | "female"
  position: { row: number; col: number }
}

export interface Bus {
  id: string
  name: string
  busNumber: string
  image: string
  route: {
    from: string
    to: string
  }
  departureTime: string
  arrivalTime: string
  price: number
  type: string
  seats: Seat[]
}

export interface Passenger {
  name: string
  age: number
  gender: "male" | "female"
  mobile: string
  email: string
  seatNumber: string
}

export interface Booking {
  id: string
  userId: string
  bus: Bus
  passengers: Passenger[]
  journeyDate: string
  bookingDate: string
  paymentId: string
  paymentStatus: "completed" | "pending" | "failed"
  totalAmount: number
  paymentMethod: "upi" | "qr"
  upiId?: string
}

// Convert MongoDB data format to our Bus format
function convertMongoSeatsToAppSeats(mongoSeats: any[]): Seat[] {
  const seats: Seat[] = []
  const seatsPerRow = 4 // 2 seats on left, aisle, 2 seats on right

  mongoSeats.forEach((seat, index) => {
    const row = Math.floor(index / seatsPerRow)
    const col = index % seatsPerRow

    seats.push({
      id: `seat-${index + 1}`,
      number: seat.seatNumber,
      type: "normal",
      isBooked: seat.isBooked,
      gender: seat.gender,
      position: { row, col },
    })
  })

  return seats
}

export const ROUTES = Array.from(
  new Set(
    busesData.map((bus: any) =>
      JSON.stringify({
        from: bus.from.charAt(0).toUpperCase() + bus.from.slice(1),
        to: bus.to.charAt(0).toUpperCase() + bus.to.slice(1),
      }),
    ),
  ),
).map((str: string) => JSON.parse(str))

const BUS_DATABASE: Bus[] = busesData.map((bus: any) => ({
  id: bus._id.$oid,
  name: bus.busName,
  busNumber: bus.busNumber,
  image: `/${bus.image.replace("images/", "")}`,
  route: {
    from: bus.from.charAt(0).toUpperCase() + bus.from.slice(1),
    to: bus.to.charAt(0).toUpperCase() + bus.to.slice(1),
  },
  departureTime: bus.departureTime,
  arrivalTime: bus.arrivalTime,
  price: bus.price,
  type: bus.busName.includes("SETC") ? "AC Sleeper" : "AC Seater",
  seats: convertMongoSeatsToAppSeats(bus.seats),
}))

export function getBusesForRoute(from: string, to: string): Bus[] {
  return BUS_DATABASE.filter(
    (bus) => bus.route.from.toLowerCase() === from.toLowerCase() && bus.route.to.toLowerCase() === to.toLowerCase(),
  ).map((bus) => ({
    ...bus,
    // Deep clone seats to avoid mutation
    seats: JSON.parse(JSON.stringify(bus.seats)),
  }))
}

export function getBusById(id: string): Bus | null {
  const bus = BUS_DATABASE.find((b) => b.id === id)
  if (!bus) return null

  return {
    ...bus,
    seats: JSON.parse(JSON.stringify(bus.seats)),
  }
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings()
  bookings.push(booking)
  localStorage.setItem("bus_bookings", JSON.stringify(bookings))
}

export function getBookings(): Booking[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("bus_bookings")
  return stored ? JSON.parse(stored) : []
}

export function getUserBookings(userId: string): Booking[] {
  return getBookings().filter((b) => b.userId === userId)
}

export function generateBookingId(): string {
  return `BK${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export function generatePaymentId(): string {
  return `PAY${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}
