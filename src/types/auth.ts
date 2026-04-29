export interface User {
  id: number
  username: string
  email: string
  role: 'ADMIN' | 'VENDEDOR'
  roleId: number
  isActive: boolean
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}