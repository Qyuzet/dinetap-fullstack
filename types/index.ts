export type User = {
  id: string
  name: string
  email: string
  phone?: string
  addresses?: {
    id: string
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    isDefault: boolean
  }[]
  preferences?: {
    favoriteItems?: string[]
    dietaryRestrictions?: string[]
    spicePreference?: 'mild' | 'medium' | 'hot'
  }
}

export type Route = {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}