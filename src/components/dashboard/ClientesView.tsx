import { useState } from 'react'
import type { Client } from '../../types'

// Lista en memoria — sin datos mock ni localStorage
// TODO: conectar con API cuando el backend esté listo

export default function ClientesView() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const topClients = [...clients]
    .filter(c => c.purchases > 0)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 3)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    const newClient: Client = {
      id: String(Date.now()),
      name: newName,
      email: newEmail,
      purchases: 0,
      totalSpent: 0,
      lastActivity: new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' }),
      registeredAt: new Date().toISOString().split('T')[0],
      frequency: 'Ocasional',
    }
    setClients(prev => [...prev, newClient])
    setNewName('')
    setNewEmail('')
    setShowModal(false)
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Clientes</h2>
      </div>

      <div className="clientes-toolbar">
        <div className="clientes-search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="clientes-search"
            type="text"
            placeholder="Buscar por nombre"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="btn-add-client" onClick={() => setShowModal(true)}>+ Cliente</button>
      </div>

      <div className="clientes-body">
        <div className="clientes-list-wrap">
          <p className="clientes-total">{filtered.length} EN TOTAL</p>
          <div className="clientes-list">
            {filtered.map(c => (
              <div key={c.id} className="cliente-row">
                <div className="cliente-avatar">
                  <span className="avatar-icon">🤖</span>
                </div>
                <div className="cliente-info">
                  <p className="cliente-label">NOMBRE DE USUARIO</p>
                  <p className="cliente-name">{c.name}</p>
                </div>
                <div className="cliente-info">
                  <p className="cliente-label">HISTORIAL DE COMPRAS</p>
                  <p className="cliente-value">
                    {c.purchases} pedidos /<br />
                    S/. {c.totalSpent.toLocaleString('es-PE')}.00
                  </p>
                </div>
                <div className="cliente-info">
                  <p className="cliente-label">ÚLTIMA FECHA DE ACTIVIDAD</p>
                  <p className="cliente-value">{c.lastActivity}</p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="empty-state">No hay clientes registrados aún.</p>
            )}
          </div>
        </div>

        <aside className="clientes-sidebar">
          <h3 className="top-clients-title">CLIENTES MÁS ACTIVOS</h3>
          <div className="top-clients-divider" />
          {topClients.length === 0 && (
            <p className="empty-state" style={{ fontSize: '0.8rem' }}>Sin actividad aún.</p>
          )}
          {topClients.map(c => (
            <div key={c.id} className="top-client-card">
              <div className="top-client-avatar" />
              <div>
                <p className="top-client-name">{c.name}</p>
                <p className="top-client-badge">{c.badge ?? 'Cliente'}</p>
              </div>
              <div className="top-client-details">
                <p>Total acumulado: S/. {c.totalSpent.toLocaleString('es-PE')}.00</p>
                <p>Frecuencia: {c.frequency}</p>
              </div>
              <button className="top-client-link">Ver Actividad →</button>
            </div>
          ))}
        </aside>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nuevo cliente</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} className="auth-form" style={{ marginTop: '0.5rem' }}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" placeholder="Nombre completo" value={newName}
                  onChange={e => setNewName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Correo</label>
                <input type="email" placeholder="correo@ejemplo.com" value={newEmail}
                  onChange={e => setNewEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary">Agregar cliente</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
