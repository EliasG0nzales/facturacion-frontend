import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthResponse, LoginCredentials } from '../types'
import { login as loginApi } from '../api/authApi'

const SESSION_KEY = 'venderapp_session'

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getSavedSession(): AuthResponse | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const savedSession = getSavedSession()

  const [user, setUser] = useState<User | null>(savedSession?.user ?? null)
  const [token, setToken] = useState<string | null>(savedSession?.token ?? null)

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await loginApi(credentials)

    localStorage.setItem(SESSION_KEY, JSON.stringify(data))
    setUser(data.user)
    setToken(data.token)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}