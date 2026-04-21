import { useState } from 'react'
import type { User } from '../types'
import { mockUsers } from '../data/mockData'

interface Props {
  onLogin: (user: User) => void
  onGoRegister: () => void
  onGoRecover: () => void
}

export default function LoginPage({ onLogin, onGoRegister, onGoRecover }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (user) {
      onLogin(user)
    } else {
      setError('Correo o contraseña incorrectos.')
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🛒</span>
          <h1>VenderApp</h1>
        </div>
        <h2>Iniciar sesión</h2>
        <p className="auth-subtitle">Bienvenido de nuevo</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary">Entrar</button>
        </form>
        <div className="auth-links">
          <button className="link-btn" onClick={onGoRecover}>¿Olvidaste tu contraseña?</button>
          <span className="auth-divider">·</span>
          <button className="link-btn" onClick={onGoRegister}>Crear cuenta</button>
        </div>
        <p className="auth-hint">Demo: user@demo.com / 123456</p>
      </div>
    </div>
  )
}
