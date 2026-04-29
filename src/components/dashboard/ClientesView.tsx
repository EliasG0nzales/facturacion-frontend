import { useState } from 'react'
import { useCustomers } from '../../hooks/useCustomers'
import type { CreateCustomerPayload } from '../../types'

export default function ClientesView() {
  const { customers, meta, loading, error, create, remove } = useCustomers()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = customers.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload: CreateCustomerPayload = {
      nombre: newNombre,
      email: newEmail || undefined,
      tipoDocumento: 'SIN_DOC',
    }
    const result = await create(payload)
    setSaving(false)
    if (result) {
      setNewNombre('')
      setNewEmail('')
      setShowModal(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desactivar este cliente?')) return
    await remove(id)
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Clientes</h2>
        {meta && (
          <span className="view-count">{meta.total} clientes</span>
        )}
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
        <button className="btn-add-client" onClick={() => setShowModal(true)}>
          + Cliente
        </button>
      </div>

      <div className="clientes-body">
        <div className="clientes-list-wrap">
          {loading && (
            <p className="empty-state">Cargando clientes...</p>
          )}
          {error && (
            <p className="auth-error" style={{ margin: '1rem' }}>{error}</p>
          )}
          {!loading && (
            <>
              <p className="clientes-total">{filtered.length} EN TOTAL</p>
              <div className="clientes-list">
                {filtered.map(c => (
                  <div key={c.id} className="cliente-row">
                    <div className="cliente-avatar">
                      <span className="avatar-icon">🤖</span>
                    </div>
                    <div className="cliente-info">
                      <p className="cliente-label">NOMBRE</p>
                      <p className="cliente-name">{c.nombre}</p>
                    </div>
                    <div className="cliente-info">
                      <p className="cliente-label">DOCUMENTO</p>
                      <p className="cliente-value">
                        {c.tipoDocumento}{c.nroDocumento ? ` · ${c.nroDocumento}` : ''}
                      </p>
                    </div>
                    <div className="cliente-info">
                      <p className="cliente-label">CONTACTO</p>
                      <p className="cliente-value">
                        {c.email ?? '—'}<br />
                        {c.telefono ?? ''}
                      </p>
                    </div>
                    <div className="cliente-info">
                      <p className="cliente-label">ESTADO</p>
                      <p className="cliente-value">
                        {c.isActive ? '✓ Activo' : '✗ Inactivo'}
                      </p>
                    </div>
                    <button
                      className="prod-del-btn"
                      onClick={() => handleDelete(c.id)}
                      title="Desactivar"
                    >
                      🗑
                    </button>
                  </div>
                ))}
                {filtered.length === 0 && !loading && (
                  <p className="empty-state">No se encontraron clientes.</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Panel lateral — top 3 por orden alfabético mientras no hay totalSpent */}
        <aside className="clientes-sidebar">
          <h3 className="top-clients-title">CLIENTES RECIENTES</h3>
          <div className="top-clients-divider" />
          {customers.slice(0, 3).map(c => (
            <div key={c.id} className="top-client-card">
              <div>
                <div className="top-client-avatar" />
                <div>
                  <p className="top-client-name">{c.nombre}</p>
                  <p className="top-client-badge">{c.tipoDocumento}</p>
                </div>
              </div>
              <div className="top-client-details">
                <p>{c.email ?? 'Sin correo'}</p>
                <p>{c.telefono ?? 'Sin teléfono'}</p>
              </div>
            </div>
          ))}
          {customers.length === 0 && !loading && (
            <p className="empty-state" style={{ fontSize: '0.8rem' }}>
              Sin clientes aún.
            </p>
          )}
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
                <label>Nombre completo</label>
                <input
                  type="text"
                  placeholder="Nombre o razón social"
                  value={newNombre}
                  onChange={e => setNewNombre(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Correo (opcional)</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Agregar cliente'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}