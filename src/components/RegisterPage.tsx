import { useState } from 'react'
import { mockUsers, addUser, addClient } from '../data/mockData'
import type { User, Client } from '../types'

interface Props {
  onGoLogin: () => void
  onRegistered: (user: User) => void
}

export default function RegisterPage({ onGoLogin, onRegistered }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (mockUsers.find(u => u.email === email)) {
      setError('Este correo ya está registrado.')
      return
    }
    const newId = String(mockUsers.length + 1).padStart(7, '0')
    const newUser: User = { id: newId, name, email, password }
    addUser(newUser)

    const newClient: Client = {
      id: newId,
      name,
      email,
      purchases: 0,
      totalSpent: 0,
      lastActivity: new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }),
      registeredAt: new Date().toISOString().split('T')[0],
      frequency: 'Ocasional',
    }
    addClient(newClient)

    onRegistered(newUser)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🛒</span>
          <h1>VenderApp</h1>
        </div>
        <h2>Crear cuenta</h2>
        <p className="auth-subtitle">Regístrate para comenzar</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name">Nombre</label>
            <input
              id="reg-name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Correo electrónico</label>
            <input
              id="reg-email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-pass">Contraseña</label>
            <input
              id="reg-pass"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-confirm">Confirmar contraseña</label>
            <input
              id="reg-confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary">Registrarse</button>
        </form>
        <div className="auth-links">
          <span>¿Ya tienes cuenta?</span>
          <button className="link-btn" onClick={onGoLogin}>Iniciar sesión</button>
        </div>
      </div>
    </div>
  )
}
