import { useState } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { adjustStock } from '../../api/productsApi'
import type { Product } from '../../types'

// ── Tipos locales para instancias serializadas (frontend-only hasta que el backend lo soporte) ──
type InstanceStatus = 'DISPONIBLE' | 'VENDIDO' | 'GARANTIA' | 'REPARACION' | 'DEVUELTO' | 'OBSOLETO'

interface ProductInstance {
  id: string
  serialNumber: string
  productId: number
  status: InstanceStatus
  receivedAt: string
  receivedBy: string
  soldAt?: string
  soldTo?: string
  history: { date: string; event: string; detail: string }[]
}

// Store en memoria para instancias (se conectará al backend cuando esté listo)
const instanceStore: ProductInstance[] = []

function addInstance(inst: ProductInstance) { instanceStore.push(inst) }
function findBySN(sn: string) { return instanceStore.find(i => i.serialNumber === sn) }
function getByProduct(productId: number) { return instanceStore.filter(i => i.productId === productId) }
function availableCount(productId: number) { return instanceStore.filter(i => i.productId === productId && i.status === 'DISPONIBLE').length }

type SubView = 'recibir' | 'buscar' | 'historial'

const STATUS_COLORS: Record<InstanceStatus, string> = {
  DISPONIBLE: '#22c55e', VENDIDO: '#3b82f6', GARANTIA: '#f59e0b',
  REPARACION: '#f97316', DEVUELTO: '#8b5cf6', OBSOLETO: '#6b7280',
}

export default function InventarioView() {
  const [subView, setSubView] = useState<SubView>('recibir')

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Inventario</h2>
      </div>

      <div className="inv-tabs">
        {([
          { key: 'recibir',   label: '📥 Recibir mercadería' },
          { key: 'buscar',    label: '🔍 Buscar por SN' },
          { key: 'historial', label: '📋 Historial de unidades' },
        ] as { key: SubView; label: string }[]).map(t => (
          <button key={t.key}
            className={`inv-tab ${subView === t.key ? 'inv-tab-active' : ''}`}
            onClick={() => setSubView(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="inv-body">
        {subView === 'recibir'   && <RecibirMercaderia />}
        {subView === 'buscar'    && <BuscarSN />}
        {subView === 'historial' && <HistorialUnidades />}
      </div>
    </div>
  )
}

// ── RECIBIR MERCADERÍA ────────────────────────────────────────────────────────
function RecibirMercaderia() {
  const { products, loading } = useProducts({ isActive: true })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [operario, setOperario] = useState('')
  const [snInput, setSnInput] = useState('')
  const [scanned, setScanned] = useState<string[]>([])
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const sn = snInput.trim()
    if (!sn) return
    if (scanned.includes(sn)) { setError(`⚠ SN "${sn}" ya fue escaneado.`); setSnInput(''); return }
    if (findBySN(sn)) { setError(`⚠ SN "${sn}" ya existe en el sistema.`); setSnInput(''); return }
    setError('')
    setScanned(prev => [...prev, sn])
    setSnInput('')
  }

  const handleFinalizar = async () => {
    if (!selectedProduct || scanned.length === 0) return
    setSaving(true)
    const now = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    // Registrar instancias localmente
    scanned.forEach(sn => {
      addInstance({
        id: `${Date.now()}-${sn}`,
        serialNumber: sn,
        productId: selectedProduct.id,
        status: 'DISPONIBLE',
        receivedAt: now,
        receivedBy: operario || 'Operario',
        history: [{ date: now, event: 'RECIBIDO', detail: `Ingresado por ${operario || 'Operario'}` }],
      })
    })
    // Ajustar stock en el backend
    try {
      await adjustStock(selectedProduct.id, scanned.length, `Recepción de ${scanned.length} unidades por ${operario || 'Operario'}`)
    } catch {
      // Si el backend falla, igual registramos localmente
    }
    setSaving(false)
    setDone(true)
  }

  const handleReset = () => {
    setSelectedProduct(null); setScanned([]); setSnInput('')
    setError(''); setDone(false); setOperario('')
  }

  if (done) {
    return (
      <div className="inv-done">
        <span className="inv-done-icon">✅</span>
        <h3>{scanned.length} unidades registradas</h3>
        <p>Producto: <strong>{selectedProduct?.name}</strong></p>
        <p>Operario: <strong>{operario || 'Operario'}</strong></p>
        <div className="inv-sn-list">
          {scanned.map(sn => <span key={sn} className="inv-sn-chip done">✓ {sn}</span>)}
        </div>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={handleReset}>
          Nueva recepción
        </button>
      </div>
    )
  }

  return (
    <div className="inv-recibir">
      <div className="inv-form-row">
        <div className="inv-field">
          <label>Producto</label>
          {loading ? <p className="inv-hint">Cargando productos...</p> : (
            <select value={selectedProduct?.id ?? ''}
              onChange={e => {
                const p = products.find(x => x.id === Number(e.target.value)) ?? null
                setSelectedProduct(p); setScanned([]); setError('')
              }}>
              <option value="">— Seleccionar producto —</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} {p.sku ? `(${p.sku})` : ''}</option>
              ))}
            </select>
          )}
        </div>
        <div className="inv-field">
          <label>Operario</label>
          <input type="text" placeholder="Nombre del operario"
            value={operario} onChange={e => setOperario(e.target.value)} />
        </div>
      </div>

      {selectedProduct && (
        <>
          <div className="inv-product-card">
            {selectedProduct.coverImageUrl && <img src={selectedProduct.coverImageUrl} alt="" />}
            <div>
              <p className="inv-product-name">{selectedProduct.name}</p>
              <p className="inv-product-meta">
                SKU: {selectedProduct.sku ?? '—'} · {selectedProduct.category?.name ?? '—'}
              </p>
              <p className="inv-product-meta">
                Stock actual: {selectedProduct.stockCurrent} · Disponibles SN: {availableCount(selectedProduct.id)}
              </p>
            </div>
          </div>

          <div className="inv-scan-area">
            <label className="inv-scan-label">Escanea el número de serie (SN) — Enter por cada unidad</label>
            <input
              className="inv-scan-input"
              type="text"
              placeholder="Escanea o escribe el SN..."
              value={snInput}
              onChange={e => setSnInput(e.target.value)}
              onKeyDown={handleScan}
              autoFocus
            />
            {error && <p className="inv-error">{error}</p>}
          </div>

          <div className="inv-scanned-header">
            <span>Escaneados: <strong>{scanned.length}</strong></span>
            {scanned.length > 0 && (
              <button className="inv-clear-btn" onClick={() => setScanned([])}>Limpiar lista</button>
            )}
          </div>

          <div className="inv-sn-list">
            {scanned.length === 0 && <p className="inv-empty">Aún no se han escaneado unidades.</p>}
            {[...scanned].reverse().map((sn, i) => (
              <span key={sn} className={`inv-sn-chip ${i === 0 ? 'new' : ''}`}>✓ {sn}</span>
            ))}
          </div>

          {scanned.length > 0 && (
            <button className="btn-primary inv-finalizar" onClick={handleFinalizar} disabled={saving}>
              {saving ? 'Guardando...' : `Finalizar recepción (${scanned.length} unidades)`}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ── BUSCAR POR SN ─────────────────────────────────────────────────────────────
function BuscarSN() {
  const { products } = useProducts({ isActive: true })
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<ProductInstance | null | 'not-found'>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const inst = findBySN(query.trim())
    setResult(inst ?? 'not-found')
  }

  const product = result && result !== 'not-found'
    ? products.find(p => p.id === result.productId)
    : null

  return (
    <div className="inv-buscar">
      <form onSubmit={handleSearch} className="inv-search-form">
        <input className="inv-search-input" type="text"
          placeholder="Ingresa o escanea el número de serie..."
          value={query} onChange={e => setQuery(e.target.value)} autoFocus />
        <button type="submit" className="btn-primary">Buscar</button>
      </form>

      {result === 'not-found' && (
        <div className="inv-not-found">
          <span>❌</span>
          <p>No se encontró ninguna unidad con SN: <strong>{query}</strong></p>
          <p className="inv-hint">Este SN no ha sido ingresado al sistema.</p>
        </div>
      )}

      {result && result !== 'not-found' && (
        <div className="inv-result-card">
          <div className="inv-result-header">
            {product?.coverImageUrl && <img src={product.coverImageUrl} alt="" className="inv-result-img" />}
            <div>
              <p className="inv-result-name">{product?.name ?? 'Producto desconocido'}</p>
              <p className="inv-result-sn">SN: <strong>{result.serialNumber}</strong></p>
              <span className="inv-status-badge" style={{ background: STATUS_COLORS[result.status] }}>
                {result.status}
              </span>
            </div>
          </div>

          <div className="inv-result-meta">
            <div><span>SKU</span><strong>{product?.sku ?? '—'}</strong></div>
            <div><span>Categoría</span><strong>{product?.category?.name ?? '—'}</strong></div>
            <div><span>Recibido</span><strong>{result.receivedAt}</strong></div>
            <div><span>Por</span><strong>{result.receivedBy}</strong></div>
            {result.soldAt && <div><span>Vendido</span><strong>{result.soldAt}</strong></div>}
            {result.soldTo && <div><span>Cliente</span><strong>{result.soldTo}</strong></div>}
          </div>

          <div className="inv-history">
            <p className="inv-history-title">Historial de eventos</p>
            <table className="inv-history-table">
              <thead><tr><th>Fecha</th><th>Evento</th><th>Detalle</th></tr></thead>
              <tbody>
                {result.history.map((h, i) => (
                  <tr key={i}>
                    <td>{h.date}</td>
                    <td><span className="inv-event-badge">{h.event}</span></td>
                    <td>{h.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="inv-change-status">
            <p className="inv-history-title">Cambiar estado</p>
            <div className="inv-status-btns">
              {(['DISPONIBLE','GARANTIA','REPARACION','DEVUELTO','OBSOLETO'] as InstanceStatus[])
                .filter(s => s !== result.status)
                .map(s => (
                  <button key={s} className="inv-status-btn"
                    style={{ borderColor: STATUS_COLORS[s], color: STATUS_COLORS[s] }}
                    onClick={() => {
                      const now = new Date().toLocaleDateString('es-PE')
                      result.status = s
                      result.history.push({ date: now, event: s, detail: `Estado cambiado a ${s}` })
                      setResult({ ...result })
                    }}>
                    → {s}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── HISTORIAL DE UNIDADES ─────────────────────────────────────────────────────
function HistorialUnidades() {
  const { products } = useProducts({ isActive: true })
  const [filterProductId, setFilterProductId] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const instances = instanceStore.filter(i => {
    const matchP = filterProductId ? i.productId === Number(filterProductId) : true
    const matchS = filterStatus ? i.status === filterStatus : true
    return matchP && matchS
  })

  const summary = products
    .map(p => {
      const insts = getByProduct(p.id)
      if (insts.length === 0) return null
      return {
        product: p,
        total: insts.length,
        disponible: insts.filter(i => i.status === 'DISPONIBLE').length,
        vendido: insts.filter(i => i.status === 'VENDIDO').length,
        garantia: insts.filter(i => i.status === 'GARANTIA').length,
        reparacion: insts.filter(i => i.status === 'REPARACION').length,
      }
    })
    .filter(Boolean) as { product: Product; total: number; disponible: number; vendido: number; garantia: number; reparacion: number }[]

  return (
    <div className="inv-historial">
      {summary.length > 0 && (
        <div className="inv-summary">
          {summary.map(s => (
            <div key={s.product.id} className="inv-summary-card">
              <p className="inv-summary-name">{s.product.name}</p>
              <div className="inv-summary-stats">
                <span style={{ color: '#22c55e' }}>✓ {s.disponible} disp.</span>
                <span style={{ color: '#3b82f6' }}>● {s.vendido} vend.</span>
                {s.garantia > 0 && <span style={{ color: '#f59e0b' }}>⚠ {s.garantia} gar.</span>}
                {s.reparacion > 0 && <span style={{ color: '#f97316' }}>🔧 {s.reparacion} rep.</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="inv-filters">
        <select value={filterProductId} onChange={e => setFilterProductId(e.target.value)}>
          <option value="">Todos los productos</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {(['DISPONIBLE','VENDIDO','GARANTIA','REPARACION','DEVUELTO','OBSOLETO'] as InstanceStatus[]).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {instances.length === 0 ? (
        <p className="inv-empty">No hay unidades registradas aún.</p>
      ) : (
        <table className="prod-table">
          <thead>
            <tr><th>SN</th><th>Producto</th><th>Estado</th><th>Recibido</th><th>Por</th><th>Vendido a</th></tr>
          </thead>
          <tbody>
            {instances.map(i => {
              const p = products.find(x => x.id === i.productId)
              return (
                <tr key={i.id}>
                  <td className="prod-code">{i.serialNumber}</td>
                  <td>{p?.name ?? '—'}</td>
                  <td>
                    <span className="inv-status-badge" style={{ background: STATUS_COLORS[i.status] }}>
                      {i.status}
                    </span>
                  </td>
                  <td>{i.receivedAt}</td>
                  <td>{i.receivedBy}</td>
                  <td>{i.soldTo ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}
