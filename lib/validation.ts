export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  mobile: (mobile: string): boolean => {
    const mobileRegex = /^[6-9]\d{9}$/
    return mobileRegex.test(mobile)
  },

  upiId: (upiId: string): boolean => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/
    return upiRegex.test(upiId)
  },

  name: (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name)
  },

  age: (age: number): boolean => {
    return age >= 1 && age <= 120
  },
}

export function validateEmail(email: string): boolean {
  return validation.email(email)
}

export function validateMobile(mobile: string): boolean {
  return validation.mobile(mobile)
}

export function validateUpiId(upiId: string): boolean {
  return validation.upiId(upiId)
}

export function validateName(name: string): boolean {
  return validation.name(name)
}

export function validateAge(age: number): boolean {
  return validation.age(age)
}
