import { useState } from 'react'
import { mockProducts, categories } from '../../data/mockData'
import type { Product } from '../../types'

const CAT_ICONS: Record<string, string> = {
  'Monitores':         '🖥️',
  'Case':              '🖨️',
  'PC Completa':       '💻',
  'Disco SSD':         '💾',
  'Estabilizador':     '🔋',
  'Fuente de Poder':   '⚡',
  'Memoria RAM':       '🧩',
  'Periféricos':       '🖱️',
  'Placa Madre':       '🔌',
  'Tarjetas de Video': '🎮',
}

interface CartItem { product: Product; qty: number }

export default function VenderView() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const filtered = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.code.toLowerCase().includes(search.toLowerCase())
    const matchCat = selectedCat ? p.category === selectedCat : true
    return matchSearch && matchCat
  })

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1 }]
    })
  }

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id))

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return }
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty } : i))
  }

  const totalItems = cart.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cart.reduce((s, i) => s + i.qty * Number(i.product.price), 0)

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Vender</h2>
        <button className="btn-history" onClick={() => setShowHistory(true)}>
          Historial de ventas
        </button>
      </div>

      {/* Barra búsqueda + categorías + carrito */}
      <div className="vender-topbar">
        <input
          className="vender-search"
          type="text"
          placeholder="Producto"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="vender-cat-dropdown">
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
          >
            <option value="">Categorías</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <span className="vender-cat-arrow">▾</span>
        </div>
        <button className="vender-cart-btn" onClick={() => setShowCart(true)} title="Ver carrito">
          🛒
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>

      {/* Layout: lista */}
      <div className="vender-body">

        {/* Grid de cards */}
        <div className="sell-cards-grid">
          {filtered.length === 0 && (
            <p className="empty-state" style={{ gridColumn: '1/-1' }}>No se encontraron productos.</p>
          )}
          {filtered.map(p => {
            const inCart = cart.find(i => i.product.id === p.id)
            return (
              <div key={p.id} className="sell-card">
                <div className="sell-card-inner">

                  {/* BACK — se ve al hover */}
                  <div className="sell-card-back">
                    <div className="sell-card-back-anim" />
                    <div className="sell-card-back-content">
                      {p.cover
                        ? <img src={p.cover} alt={p.name} className="sell-card-back-img" />
                        : <span style={{ fontSize: '2.5rem' }}>📦</span>
                      }
                      <strong style={{ color: '#fff', fontSize: '0.82rem', textAlign: 'center' }}>
                        {p.name}
                      </strong>
                    </div>
                  </div>

                  {/* FRONT — info del producto */}
                  <div className="sell-card-front">
                    {/* Fondo animado */}
                    <div className="sell-card-img-bg">
                      <div className="sc-circle" />
                      <div className="sc-circle" id="sc-right" />
                      <div className="sc-circle" id="sc-bottom" />
                    </div>

                    <div className="sell-card-front-content">
                      <span className="sell-card-badge">{p.category}</span>
                      <div className="sell-card-desc">
                        <div className="sell-card-title-row">
                          <p className="sell-card-name">
                            <strong>{p.name}</strong>
                            {p.featured && <span style={{ color: '#f59e0b' }}> ★</span>}
                          </p>
                        </div>
                        <p className="sell-card-meta">
                          S/ {Number(p.price).toFixed(2)} &nbsp;|&nbsp; Stock: {p.stock}
                        </p>
                        <p className="sell-card-brand">{p.brand} {p.model}</p>
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
                              disabled={p.stock === 0}
                            >
                              {p.stock === 0 ? 'Sin stock' : '+ Agregar'}
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

      {/* Panel carrito lateral */}
      {showCart && (
        <aside className="cart-panel" onClick={e => e.stopPropagation()}>
          <div className="cart-panel-header">
            <span />
            <span className="cart-panel-title">Seleccionar Producto</span>
            <button className="modal-close" onClick={() => setShowCart(false)}>✕</button>
          </div>

          {cart.length === 0 ? (
            <div className="cart-panel-empty">
              <div className="cart-empty-circle">
                <svg viewBox="0 0 100 90" width="110" height="100" fill="none" stroke="#222" strokeWidth="4">
                  {/* flecha hacia abajo */}
                  <polygon points="50,5 65,25 55,25 55,45 45,45 45,25 35,25" fill="#222" stroke="none"/>
                  {/* carrito */}
                  <line x1="20" y1="55" x2="25" y2="75" />
                  <line x1="25" y1="75" x2="75" y2="75" />
                  <line x1="75" y1="75" x2="80" y2="55" />
                  <line x1="20" y1="55" x2="80" y2="55" />
                  <line x1="30" y1="55" x2="32" y2="75" />
                  <line x1="45" y1="55" x2="45" y2="75" />
                  <line x1="60" y1="55" x2="58" y2="75" />
                  <line x1="72" y1="55" x2="75" y2="75" />
                  {/* ruedas */}
                  <circle cx="33" cy="80" r="4" fill="#222" stroke="none"/>
                  <circle cx="67" cy="80" r="4" fill="#222" stroke="none"/>
                  {/* puntos */}
                  <circle cx="38" cy="50" r="2.5" fill="#222" stroke="none"/>
                  <circle cx="62" cy="50" r="2.5" fill="#222" stroke="none"/>
                </svg>
              </div>
              <p className="cart-empty-title">Tu Carrito esta vacio.</p>
              <p className="cart-empty-sub">Clica en los articulos para añadirlos a la venta</p>
            </div>
          ) : (
            <>
              <ul className="cart-panel-list">
                {cart.map(({ product, qty }) => (
                  <li key={product.id} className="cart-panel-item">
                    <div className="cart-panel-img">
                      {product.cover
                        ? <img src={product.cover} alt={product.name} />
                        : <span>📦</span>}
                    </div>
                    <div className="cart-panel-info">
                      <p className="cart-panel-name">{product.name}</p>
                      <p className="cart-panel-price">S/ {Number(product.price).toFixed(2)}</p>
                      <div className="sell-qty-ctrl" style={{ marginTop: '0.3rem' }}>
                        <button onClick={() => updateQty(product.id, qty - 1)}>−</button>
                        <span>{qty}</span>
                        <button onClick={() => updateQty(product.id, qty + 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-panel-right">
                      <p className="cart-panel-subtotal">S/ {(qty * Number(product.price)).toFixed(2)}</p>
                      <button className="remove-btn" onClick={() => removeFromCart(product.id)}>✕</button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="cart-panel-footer">
                <div className="cart-panel-total-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="cart-panel-total-row" style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>
                  <span>Total</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                <button className="btn-primary cart-panel-confirm"
                  onClick={() => { setCart([]); setShowCart(false) }}>
                  Confirmar venta
                </button>
                <button className="cart-panel-clear" onClick={() => setCart([])}>
                  Vaciar carrito
                </button>
              </div>
            </>
          )}
        </aside>
      )}

      {/* Modal historial */}
      {showHistory && (
        <div className="modal-overlay" onClick={() => setShowHistory(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Historial de ventas</h3>
              <button className="modal-close" onClick={() => setShowHistory(false)}>✕</button>
            </div>
            <p className="empty-state">No hay ventas registradas aún.</p>
          </div>
        </div>
      )}
    </div>
  )
}
