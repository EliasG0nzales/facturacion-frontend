import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import type { ReactElement } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { useSales } from '../../hooks/useSales'
import { PAYMENT_METHODS, type PaymentMethodId } from '../../data/paymentMethods'
import type { Product } from '../../types'

// ── Íconos por categoría ──────────────────────────────────────────────────────
const CAT_ICONS: Record<string, ReactElement> = {
  'Monitores': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="8" width="52" height="36" rx="4"/><line x1="20" y1="56" x2="44" y2="56"/><line x1="32" y1="44" x2="32" y2="56"/>
    </svg>
  ),
  'Case': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="6" width="36" height="52" rx="4"/><rect x="20" y="14" width="10" height="8" rx="2"/>
      <line x1="20" y1="30" x2="44" y2="30"/><line x1="20" y1="38" x2="44" y2="38"/><circle cx="37" cy="50" r="3"/>
    </svg>
  ),
  'PC Completa': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="10" width="40" height="28" rx="3"/><line x1="14" y1="50" x2="30" y2="50"/>
      <line x1="24" y1="38" x2="24" y2="50"/><rect x="46" y="28" width="14" height="20" rx="2"/>
    </svg>
  ),
  'Disco SSD': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="16" width="48" height="32" rx="4"/><circle cx="50" cy="32" r="5"/>
    </svg>
  ),
  'Estabilizador': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="10" width="44" height="44" rx="4"/><path d="M22 32 l6-10 l6 16 l6-10 l4 4"/>
    </svg>
  ),
  'Fuente de Poder': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="14" width="48" height="36" rx="4"/><circle cx="20" cy="32" r="6"/>
      <line x1="32" y1="22" x2="32" y2="42"/>
    </svg>
  ),
  'Memoria RAM': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="20" width="52" height="24" rx="3"/>
      <rect x="14" y="26" width="6" height="12" rx="1"/><rect x="24" y="26" width="6" height="12" rx="1"/>
      <rect x="34" y="26" width="6" height="12" rx="1"/><rect x="44" y="26" width="6" height="12" rx="1"/>
    </svg>
  ),
  'Periféricos': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="32" cy="38" rx="22" ry="14"/><line x1="32" y1="24" x2="32" y2="14"/>
    </svg>
  ),
  'Placa Madre': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="52" height="52" rx="4"/><rect x="18" y="18" width="16" height="16" rx="2"/>
    </svg>
  ),
  'Tarjetas de Video': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="16" width="56" height="28" rx="4"/><circle cx="22" cy="30" r="8"/>
    </svg>
  ),
}

type FilterGroup = { label: string; key: string; options: string[] }

const CAT_FILTERS: Record<string, FilterGroup[]> = {
  'Monitores': [
    { label: 'Resolución', key: 'resolution', options: ['Full HD (1080p)', 'QHD (1440p)', '4K (2160p)'] },
    { label: 'Panel', key: 'panel', options: ['IPS', 'VA', 'TN', 'OLED'] },
  ],
  'Memoria RAM': [
    { label: 'Tipo', key: 'type', options: ['DDR4', 'DDR5'] },
    { label: 'Capacidad', key: 'cap', options: ['8 GB', '16 GB', '32 GB', '64 GB'] },
  ],
  'Disco SSD': [
    { label: 'Interfaz', key: 'iface', options: ['SATA III', 'NVMe PCIe 3.0', 'NVMe PCIe 4.0'] },
    { label: 'Capacidad', key: 'cap', options: ['256 GB', '512 GB', '1 TB', '2 TB'] },
  ],
  'Tarjetas de Video': [
    { label: 'Marca GPU', key: 'brand', options: ['NVIDIA', 'AMD'] },
    { label: 'VRAM', key: 'vram', options: ['4 GB', '8 GB', '12 GB', '16 GB'] },
  ],
}

interface CartItem { product: Product; qty: number }

// Modal para seleccionar método de pago al confirmar
interface PayModalProps {
  total: number
  onConfirm: (methodId: number) => void
  onClose: () => void
  loading: boolean
}

function PayModal({ total, onConfirm, onClose, loading }: PayModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>(PAYMENT_METHODS[0].id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirmar venta</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          Total: <strong style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
            S/ {total.toFixed(2)}
          </strong>
        </p>
        <div className="form-group">
          <label>Método de pago</label>
          <select
            className="pv-input pv-select"
            value={selectedMethod}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedMethod(Number(e.target.value) as PaymentMethodId)}
          >
            {PAYMENT_METHODS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        <button
          className="btn-primary"
          style={{ marginTop: '1rem', width: '100%' }}
          disabled={loading}
          onClick={() => onConfirm(selectedMethod)}
        >
          {loading ? 'Procesando...' : 'Confirmar venta'}
        </button>
      </div>
    </div>
  )
}

export default function VenderView() {
  const { products, categories, loading: loadingProducts } = useProducts({ isActive: true })
  const { sales, loading: loadingSale, error: saleError, fetchSales, create: createSale } = useSales()

  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)
  const [detailImg, setDetailImg] = useState(0)
  const [saleSuccess, setSaleSuccess] = useState(false)

  const catRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false)
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setActiveFilters({}) }, [selectedCat])

  const currentFilters = CAT_FILTERS[selectedCat] ?? []
  const totalActiveFilters = Object.values(activeFilters).flat().length

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => {
      const cur = prev[key] ?? []
      return { ...prev, [key]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] }
    })
  }

  // Filtrado contra productos reales del backend
  const filtered = products.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku?.toLowerCase().includes(search.toLowerCase()) ?? false)
    const matchCat =
      !selectedCat || selectedCat === 'Todos los Productos'
        ? true
        : p.category?.name === selectedCat
    return matchSearch && matchCat && p.isActive
  })

  const addToCart = (product: Product) => {
    if (product.stockCurrent <= 0) return
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        if (existing.qty >= product.stockCurrent) return prev
        return prev.map(i =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  const removeFromCart = (id: number) =>
    setCart(prev => prev.filter(i => i.product.id !== id))

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return }
    const product = cart.find(i => i.product.id === id)?.product
    if (product && qty > product.stockCurrent) return
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i))
  }

  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.qty * Number(i.product.price), 0)

  const handleConfirmSale = async (paymentMethodId: number) => {
    const payload = {
      items: cart.map(i => ({
        productId: i.product.id,
        quantity: i.qty,
        descuento: 0,
      })),
      payments: [{
        paymentMethodId,
        amount: totalPrice,
      }],
      descuento: 0,
      status: 'COMPLETADA' as const,
    }

    const result = await createSale(payload)
    if (result) {
      setCart([])
      setShowCart(false)
      setShowPayModal(false)
      setSaleSuccess(true)
      setTimeout(() => setSaleSuccess(false), 3000)
    }
  }

  // Categorías vienen del backend via useProducts
  const allCategories = ['Todos los Productos', ...categories.map(c => c.name)]

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Vender</h2>
        <button
          className="btn-history"
          onClick={() => { fetchSales(); setShowHistory(true) }}
        >
          Historial de ventas
        </button>
      </div>

      {saleSuccess && (
        <div style={{
          background: 'var(--color-background-success)',
          color: 'var(--color-text-success)',
          padding: '0.65rem 1.5rem',
          fontSize: '0.88rem',
          fontWeight: 500,
        }}>
          ✓ Venta registrada correctamente
        </div>
      )}

      {/* Topbar */}
      <div className="vender-topbar">
        <input
          className="vender-search"
          type="text"
          placeholder="Buscar producto o SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Dropdown categorías */}
        <div className="vender-cat-dropdown" ref={catRef}>
          <button className="vender-cat-trigger" onClick={() => setCatOpen(o => !o)}>
            <span>{!selectedCat || selectedCat === 'Todos los Productos' ? 'Categoría' : selectedCat}</span>
            <span className="vender-cat-arrow">{catOpen ? '▴' : '▾'}</span>
          </button>
          {catOpen && (
            <div className="vender-cat-menu">
              {allCategories.map(c => (
                <button
                  key={c}
                  className={`vender-cat-option ${selectedCat === c ? 'active' : ''}`}
                  onClick={() => { setSelectedCat(selectedCat === c ? '' : c); setCatOpen(false) }}
                >
                  <span className="vender-cat-icon">{CAT_ICONS[c] ?? null}</span>
                  <span className="vender-cat-label">{c.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="vender-filter-wrap" ref={filterRef}>
          <button
            className={`vender-filter-btn ${filterOpen ? 'open' : ''} ${totalActiveFilters > 0 ? 'has-filters' : ''}`}
            onClick={() => setFilterOpen(o => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            <span>Filtros</span>
            {totalActiveFilters > 0 && (
              <span className="filter-badge">{totalActiveFilters}</span>
            )}
          </button>

          {filterOpen && (
            <div className="filter-panel">
              <div className="filter-panel-header">
                <span className="filter-panel-title">
                  {selectedCat && selectedCat !== 'Todos los Productos'
                    ? `Filtros · ${selectedCat}`
                    : 'Filtros'}
                </span>
                {totalActiveFilters > 0 && (
                  <button className="filter-clear-all" onClick={() => setActiveFilters({})}>
                    Limpiar todo
                  </button>
                )}
              </div>
              {currentFilters.length === 0 ? (
                <div className="filter-empty">
                  <p>Selecciona una categoría<br />para ver sus filtros</p>
                </div>
              ) : (
                <div className="filter-groups">
                  {currentFilters.map(group => (
                    <div key={group.key} className="filter-group">
                      <p className="filter-group-label">{group.label}</p>
                      <div className="filter-chips">
                        {group.options.map(opt => {
                          const active = (activeFilters[group.key] ?? []).includes(opt)
                          return (
                            <button
                              key={opt}
                              className={`filter-chip ${active ? 'active' : ''}`}
                              onClick={() => toggleFilter(group.key, opt)}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="vender-cart-btn"
          onClick={() => setShowCart(true)}
          title="Ver carrito"
        >
          🛒
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>

      {/* Chips filtros activos */}
      {totalActiveFilters > 0 && (
        <div className="active-filter-bar">
          {Object.entries(activeFilters).flatMap(([key, vals]) =>
            vals.map(val => (
              <span key={`${key}-${val}`} className="active-chip">
                {val}
                <button onClick={() => toggleFilter(key, val)}>✕</button>
              </span>
            ))
          )}
        </div>
      )}

      {/* Grid productos */}
      <div className="vender-body">
        <div className="sell-cards-grid">
          {loadingProducts && (
            <p className="empty-state" style={{ gridColumn: '1/-1' }}>
              Cargando productos...
            </p>
          )}
          {!loadingProducts && filtered.length === 0 && (
            <p className="empty-state" style={{ gridColumn: '1/-1' }}>
              No se encontraron productos.
            </p>
          )}
          {filtered.map(p => {
            const inCart = cart.find(i => i.product.id === p.id)
            const allImgs = [p.coverImageUrl, ...(p.gallery ?? [])].filter(Boolean) as string[]
            return (
              <div key={p.id} className="sell-card">
                <div className="sell-card-inner">
                  {/* BACK */}
                  <div className="sell-card-back">
                    <div className="sell-card-back-content">
                      {allImgs[0]
                        ? <img src={allImgs[0]} alt={p.name} className="sell-card-back-img" />
                        : <span style={{ fontSize: '2.5rem' }}>📦</span>}
                      <strong style={{ color: '#fff', fontSize: '0.82rem', textAlign: 'center' }}>
                        {p.name}
                      </strong>
                    </div>
                  </div>

                  {/* FRONT */}
                  <div className="sell-card-front">
                    <button
                      className="sell-card-zoom"
                      onClick={e => { e.stopPropagation(); setDetailImg(0); setDetailProduct(p) }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                        width="15" height="15">
                        <circle cx="11" cy="11" r="7"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </button>

                    {allImgs[0] ? (
                      <div className="sell-card-cover-wrap">
                        <img src={allImgs[0]} alt={p.name} className="sell-card-cover-img" />
                      </div>
                    ) : (
                      <div className="sell-card-img-bg">
                        <div className="sc-circle" />
                        <div className="sc-circle" id="sc-right" />
                        <div className="sc-circle" id="sc-bottom" />
                      </div>
                    )}

                    <div className="sell-card-front-content">
                      <span className="sell-card-badge">
                        {p.category?.name ?? 'Sin categoría'}
                      </span>
                      <div className="sell-card-desc">
                        <p className="sell-card-name">
                          <strong>{p.name}</strong>
                          {p.isFeatured && <span style={{ color: '#f59e0b' }}> ★</span>}
                        </p>
                        <p className="sell-card-meta">
                          S/ {Number(p.price).toFixed(2)} &nbsp;|&nbsp; Stock: {p.stockCurrent}
                        </p>
                        {p.sku && <p className="sell-card-brand">SKU: {p.sku}</p>}
                        <div className="sell-card-action">
                          {inCart ? (
                            <div className="sell-qty-ctrl">
                              <button onClick={() => updateQty(p.id, inCart.qty - 1)}>−</button>
                              <span>{inCart.qty}</span>
                              <button onClick={() => updateQty(p.id, inCart.qty + 1)}>+</button>
                            </div>
                          ) : (
                            <button
                              className="sell-card-add-btn"
                              onClick={() => addToCart(p)}
                              disabled={p.stockCurrent === 0}
                            >
                              {p.stockCurrent === 0 ? 'Sin stock' : '+ Agregar'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Panel carrito */}
      {showCart && (
        <aside className="cart-panel" onClick={e => e.stopPropagation()}>
          <div className="cart-panel-header">
            <span />
            <span className="cart-panel-title">Carrito de venta</span>
            <button className="modal-close" onClick={() => setShowCart(false)}>✕</button>
          </div>

          {cart.length === 0 ? (
            <div className="cart-panel-empty">
              <div className="cart-empty-circle">
                <svg viewBox="0 0 100 90" width="110" height="100" fill="none"
                  stroke="#222" strokeWidth="4">
                  <polygon points="50,5 65,25 55,25 55,45 45,45 45,25 35,25"
                    fill="#222" stroke="none"/>
                  <line x1="20" y1="55" x2="25" y2="75"/>
                  <line x1="25" y1="75" x2="75" y2="75"/>
                  <line x1="75" y1="75" x2="80" y2="55"/>
                  <line x1="20" y1="55" x2="80" y2="55"/>
                  <circle cx="33" cy="80" r="4" fill="#222" stroke="none"/>
                  <circle cx="67" cy="80" r="4" fill="#222" stroke="none"/>
                </svg>
              </div>
              <p className="cart-empty-title">Tu carrito está vacío.</p>
              <p className="cart-empty-sub">Agrega productos para comenzar la venta</p>
            </div>
          ) : (
            <>
              <ul className="cart-panel-list">
                {cart.map(({ product, qty }) => (
                  <li key={product.id} className="cart-panel-item">
                    <div className="cart-panel-img">
                      {product.coverImageUrl
                        ? <img src={product.coverImageUrl} alt={product.name} />
                        : <span>📦</span>}
                    </div>
                    <div className="cart-panel-info">
                      <p className="cart-panel-name">{product.name}</p>
                      <p className="cart-panel-price">
                        S/ {Number(product.price).toFixed(2)}
                      </p>
                      <div className="sell-qty-ctrl" style={{ marginTop: '0.3rem' }}>
                        <button onClick={() => updateQty(product.id, qty - 1)}>−</button>
                        <span>{qty}</span>
                        <button onClick={() => updateQty(product.id, qty + 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-panel-right">
                      <p className="cart-panel-subtotal">
                        S/ {(qty * Number(product.price)).toFixed(2)}
                      </p>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(product.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-panel-footer">
                <div className="cart-panel-total-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="cart-panel-total-row" style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                  <span>Total</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                {saleError && (
                  <p className="auth-error" style={{ fontSize: '0.8rem' }}>{saleError}</p>
                )}
                <button
                  className="btn-primary cart-panel-confirm"
                  onClick={() => setShowPayModal(true)}
                  disabled={loadingSale}
                >
                  Confirmar venta
                </button>
                <button
                  className="cart-panel-clear"
                  onClick={() => setCart([])}
                >
                  Vaciar carrito 🗑
                </button>
              </div>
            </>
          )}
        </aside>
      )}

      {/* Modal método de pago */}
      {showPayModal && (
        <PayModal
          total={totalPrice}
          onConfirm={handleConfirmSale}
          onClose={() => setShowPayModal(false)}
          loading={loadingSale}
        />
      )}

      {/* Modal historial */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Historial de ventas</h3>
              <button className="modal-close" onClick={() => setShowHistory(false)}>✕</button>
            </div>
            {loadingSale && <p className="empty-state">Cargando...</p>}
            {!loadingSale && sales.length === 0 && (
              <p className="empty-state">No hay ventas registradas.</p>
            )}
            {sales.map(s => (
              <div key={s.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 0',
                borderBottom: '1px solid var(--color-border-tertiary)',
                fontSize: '0.88rem',
              }}>
                <div>
                  <span style={{ fontWeight: 600 }}>Venta #{s.id}</span>
                  <span style={{ color: 'var(--color-text-secondary)', marginLeft: '0.75rem' }}>
                    {new Date(s.createdAt).toLocaleDateString('es-PE')}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontWeight: 700 }}>S/ {Number(s.total).toFixed(2)}</span>
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 20,
                    background: s.status === 'COMPLETADA'
                      ? 'var(--color-background-success)'
                      : s.status === 'ANULADA'
                        ? 'var(--color-background-danger)'
                        : 'var(--color-background-warning)',
                    color: s.status === 'COMPLETADA'
                      ? 'var(--color-text-success)'
                      : s.status === 'ANULADA'
                        ? 'var(--color-text-danger)'
                        : 'var(--color-text-warning)',
                  }}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal detalles del producto */}
      {detailProduct && (() => {
        const p = detailProduct
        const allImgs = [p.coverImageUrl, ...(p.gallery ?? [])].filter(Boolean) as string[]
        const prev = () => setDetailImg(i => (i - 1 + allImgs.length) % allImgs.length)
        const next = () => setDetailImg(i => (i + 1) % allImgs.length)
        const inCart = cart.find(i => i.product.id === p.id)
        return (
          <div className="modal-overlay" onClick={() => setDetailProduct(null)}>
            <div className="detail-modal" onClick={e => e.stopPropagation()}>
              <div className="detail-modal-header">
                <span className="detail-modal-title">Detalles del producto</span>
                <button className="modal-close" onClick={() => setDetailProduct(null)}>✕</button>
              </div>
              <div className="detail-modal-body">
                <div className="detail-col-img">
                  <div className="detail-main-img">
                    {allImgs.length > 0
                      ? <img src={allImgs[detailImg]} alt={p.name} />
                      : <span style={{ fontSize: '4rem' }}>📦</span>}
                    {allImgs.length > 1 && (
                      <>
                        <button className="detail-arrow left" onClick={prev}>‹</button>
                        <button className="detail-arrow right" onClick={next}>›</button>
                      </>
                    )}
                  </div>
                  {allImgs.length > 1 && (
                    <div className="detail-thumbs">
                      {allImgs.map((img, i) => (
                        <button
                          key={i}
                          className={`detail-thumb ${detailImg === i ? 'active' : ''}`}
                          onClick={() => setDetailImg(i)}
                        >
                          <img src={img} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="detail-col-info">
                  <div className="detail-tags">
                    {p.category && (
                      <span className="detail-tag cat">{p.category.name.toUpperCase()}</span>
                    )}
                    <span className={`detail-tag stock ${p.stockCurrent === 0 ? 'nostock' : 'instock'}`}>
                      {p.stockCurrent === 0 ? '✗ Sin stock' : `✓ ${p.stockCurrent} en stock`}
                    </span>
                  </div>
                  <h2 className="detail-name">{p.name}</h2>
                  {p.sku && <p className="detail-model">SKU: {p.sku}</p>}
                  {p.description && (
                    <p className="detail-desc">{p.description}</p>
                  )}
                  <div className="detail-price-box">
                    <span className="detail-price-label">PRECIO</span>
                    <span className="detail-price">S/ {Number(p.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="detail-modal-footer">
                <button
                  className="detail-add-btn"
                  disabled={p.stockCurrent === 0}
                  onClick={() => { addToCart(p); setDetailProduct(null) }}
                >
                  {inCart
                    ? `En carrito (${inCart.qty}) · + Agregar`
                    : 'Agregar al carrito'}
                </button>
                <button
                  className="detail-close-btn"
                  onClick={() => setDetailProduct(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}