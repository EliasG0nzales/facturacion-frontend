export type Page = 'login' | 'register' | 'recover' | 'dashboard'

export type DashboardView = 'vender' | 'productos' | 'clientes'

export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface Product {
  id: string
  name: string
  brand: string
  model: string
  price: number
  cost: number
  code: string
  description: string
  stock: number
  minStock: number
  sold: number
  category: string
  label: string
  featured: boolean
  cover?: string
  gallery: string[]
}

export interface Client {
  id: string
  name: string
  email: string
  purchases: number
  totalSpent: number
  lastActivity: string
  registeredAt: string
  frequency: 'Diaria' | 'Semanal' | 'Mensual' | 'Ocasional'
  badge?: string
}
