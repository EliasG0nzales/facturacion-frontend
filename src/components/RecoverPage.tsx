import { useState } from 'react'
import { mockUsers } from '../data/mockData'

interface Props {
  onGoLogin: () => void
}

export default function RecoverPage({ onGoLogin }: Props) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      setError('No encontramos una cuenta con ese correo.')
      return
    }
    setSent(true)
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">🛒</span>
          <h1>VenderApp</h1>
        </div>
        <h2>Recuperar cuenta</h2>
        <p className="auth-subtitle">Te enviaremos un enlace de recuperación</p>

        {sent ? (
          <div className="auth-success">
            <span className="success-icon">✅</span>
            <p>Revisa tu correo <strong>{email}</strong> para restablecer tu contraseña.</p>
            <button className="btn-primary" onClick={onGoLogin} style={{ marginTop: '1rem' }}>
              Volver al login
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="rec-email">Correo electrónico</label>
                <input
                  id="rec-email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="btn-primary">Enviar enlace</button>
            </form>
            <div className="auth-links">
              <button className="link-btn" onClick={onGoLogin}>← Volver al login</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
