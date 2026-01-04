export interface User {
  id: string
  email: string
  name: string
  mobile: string
  gender: "male" | "female"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

const AUTH_KEY = "bus_booking_auth"

export const authService = {
  login: (email: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem("bus_booking_users") || "[]")
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (user) {
      const authUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        gender: user.gender,
        createdAt: user.createdAt,
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify(authUser))
      return authUser
    }
    return null
  },

  signup: (email: string, password: string, name: string, mobile: string, gender: "male" | "female"): User | null => {
    const users = JSON.parse(localStorage.getItem("bus_booking_users") || "[]")

    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      return null
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this should be hashed
      name,
      mobile,
      gender,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("bus_booking_users", JSON.stringify(users))

    const authUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      mobile: newUser.mobile,
      gender: newUser.gender,
      createdAt: newUser.createdAt,
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser))
    return authUser
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY)
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem(AUTH_KEY)
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem(AUTH_KEY)
  },
}

export function getUser(): User | null {
  return authService.getCurrentUser()
}
