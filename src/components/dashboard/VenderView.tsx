import { useState, useRef, useEffect } from 'react'
import type { ReactElement } from 'react'
import { mockProducts, categories } from '../../data/mockData'
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
      <line x1="49" y1="32" x2="57" y2="32"/><line x1="49" y1="36" x2="57" y2="36"/>
    </svg>
  ),
  'Disco SSD': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="16" width="48" height="32" rx="4"/>
      <text x="14" y="37" fontSize="14" fontWeight="bold" stroke="currentColor" strokeWidth="1" fill="currentColor" fontFamily="monospace">SSD</text>
      <circle cx="50" cy="32" r="5"/>
    </svg>
  ),
  'Estabilizador': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="10" width="44" height="44" rx="4"/><path d="M22 32 l6-10 l6 16 l6-10 l4 4"/>
      <circle cx="32" cy="50" r="2" fill="currentColor"/>
    </svg>
  ),
  'Fuente de Poder': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="14" width="48" height="36" rx="4"/><circle cx="20" cy="32" r="6"/>
      <line x1="32" y1="22" x2="32" y2="42"/><line x1="38" y1="22" x2="38" y2="42"/><line x1="44" y1="22" x2="44" y2="42"/>
    </svg>
  ),
  'Memoria RAM': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="20" width="52" height="24" rx="3"/><line x1="6" y1="44" x2="6" y2="52"/><line x1="58" y1="44" x2="58" y2="52"/>
      <rect x="14" y="26" width="6" height="12" rx="1"/><rect x="24" y="26" width="6" height="12" rx="1"/>
      <rect x="34" y="26" width="6" height="12" rx="1"/><rect x="44" y="26" width="6" height="12" rx="1"/>
    </svg>
  ),
  'Periféricos': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="32" cy="38" rx="22" ry="14"/><line x1="32" y1="24" x2="32" y2="14"/><circle cx="32" cy="12" r="3"/>
      <line x1="26" y1="38" x2="26" y2="44"/><line x1="32" y1="38" x2="32" y2="46"/><line x1="38" y1="38" x2="38" y2="44"/>
    </svg>
  ),
  'Placa Madre': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="52" height="52" rx="4"/><rect x="18" y="18" width="16" height="16" rx="2"/>
      <line x1="6" y1="20" x2="18" y2="20"/><line x1="6" y1="28" x2="18" y2="28"/>
      <line x1="34" y1="26" x2="58" y2="26"/><line x1="34" y1="34" x2="58" y2="34"/>
      <rect x="40" y="40" width="12" height="8" rx="1"/><line x1="18" y1="34" x2="18" y2="58"/><line x1="26" y1="34" x2="26" y2="58"/>
    </svg>
  ),
  'Tarjetas de Video': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="16" width="56" height="28" rx="4"/><circle cx="22" cy="30" r="8"/><circle cx="22" cy="30" r="4"/>
      <line x1="32" y1="22" x2="56" y2="22"/><line x1="32" y1="30" x2="56" y2="30"/><line x1="32" y1="38" x2="56" y2="38"/>
      <line x1="14" y1="44" x2="14" y2="52"/><line x1="22" y1="44" x2="22" y2="52"/><line x1="30" y1="44" x2="30" y2="52"/>
    </svg>
  ),
  'Todos los Productos': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="22" height="22" rx="3"/><rect x="36" y="6" width="22" height="22" rx="3"/>
      <rect x="6" y="36" width="22" height="22" rx="3"/><rect x="36" y="36" width="22" height="22" rx="3"/>
    </svg>
  ),
}

// ── Filtros por categoría ─────────────────────────────────────────────────────
type FilterGroup = { label: string; key: string; options: string[] }

const CAT_FILTERS: Record<string, FilterGroup[]> = {
  'Monitores': [
    { label: 'Tamaño', key: 'size', options: ['21"', '24"', '27"', '32"', '34" Ultrawide'] },
    { label: 'Resolución', key: 'resolution', options: ['Full HD (1080p)', 'QHD (1440p)', '4K (2160p)'] },
    { label: 'Tasa de refresco', key: 'hz', options: ['60 Hz', '75 Hz', '144 Hz', '165 Hz', '240 Hz'] },
    { label: 'Panel', key: 'panel', options: ['IPS', 'VA', 'TN', 'OLED'] },
    { label: 'Conectividad', key: 'conn', options: ['HDMI', 'DisplayPort', 'USB-C', 'VGA'] },
  ],
  'Case': [
    { label: 'Factor de forma', key: 'form', options: ['Mini-ITX', 'Micro-ATX', 'ATX', 'Full Tower'] },
    { label: 'Material', key: 'material', options: ['Acero', 'Aluminio', 'Vidrio templado'] },
    { label: 'Ventilación', key: 'fans', options: ['2 ventiladores', '3 ventiladores', '4+ ventiladores'] },
    { label: 'Color', key: 'color', options: ['Negro', 'Blanco', 'RGB'] },
  ],
  'PC Completa': [
    { label: 'Procesador', key: 'cpu', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7'] },
    { label: 'RAM', key: 'ram', options: ['8 GB', '16 GB', '32 GB', '64 GB'] },
    { label: 'Almacenamiento', key: 'storage', options: ['256 GB SSD', '512 GB SSD', '1 TB SSD', '1 TB HDD + SSD'] },
    { label: 'GPU', key: 'gpu', options: ['Integrada', 'GTX 1650', 'RTX 3060', 'RTX 4070'] },
    { label: 'Uso', key: 'use', options: ['Oficina', 'Gaming', 'Diseño', 'Servidor'] },
  ],
  'Disco SSD': [
    { label: 'Capacidad', key: 'cap', options: ['128 GB', '256 GB', '512 GB', '1 TB', '2 TB'] },
    { label: 'Interfaz', key: 'iface', options: ['SATA III', 'NVMe PCIe 3.0', 'NVMe PCIe 4.0'] },
    { label: 'Factor de forma', key: 'form', options: ['2.5"', 'M.2 2280', 'M.2 2242'] },
    { label: 'Velocidad lectura', key: 'read', options: ['Hasta 500 MB/s', 'Hasta 3500 MB/s', 'Hasta 7000 MB/s'] },
  ],
  'Estabilizador': [
    { label: 'Potencia', key: 'power', options: ['500 VA', '1000 VA', '1500 VA', '2000 VA', '3000 VA'] },
    { label: 'Tipo', key: 'type', options: ['Ferroresonante', 'Electrónico', 'Servo'] },
    { label: 'Salidas', key: 'outlets', options: ['4 tomas', '6 tomas', '8 tomas'] },
  ],
  'Fuente de Poder': [
    { label: 'Potencia', key: 'watts', options: ['450 W', '550 W', '650 W', '750 W', '850 W', '1000 W'] },
    { label: 'Certificación', key: 'cert', options: ['80+ White', '80+ Bronze', '80+ Gold', '80+ Platinum'] },
    { label: 'Modularidad', key: 'mod', options: ['No modular', 'Semi modular', 'Full modular'] },
  ],
  'Memoria RAM': [
    { label: 'Capacidad', key: 'cap', options: ['4 GB', '8 GB', '16 GB', '32 GB', '64 GB'] },
    { label: 'Tipo', key: 'type', options: ['DDR4', 'DDR5'] },
    { label: 'Velocidad', key: 'speed', options: ['2400 MHz', '3200 MHz', '3600 MHz', '4800 MHz', '6000 MHz'] },
    { label: 'Canales', key: 'ch', options: ['1 módulo', 'Kit 2x', 'Kit 4x'] },
  ],
  'Periféricos': [
    { label: 'Tipo', key: 'type', options: ['Teclado', 'Mouse', 'Audífonos', 'Webcam', 'Mousepad', 'Micrófono'] },
    { label: 'Conectividad', key: 'conn', options: ['USB', 'Inalámbrico', 'Bluetooth'] },
    { label: 'Iluminación', key: 'rgb', options: ['Sin RGB', 'RGB'] },
  ],
  'Placa Madre': [
    { label: 'Socket', key: 'socket', options: ['LGA1700', 'LGA1200', 'AM4', 'AM5'] },
    { label: 'Chipset', key: 'chipset', options: ['B450', 'B550', 'X570', 'B660', 'Z690', 'Z790'] },
    { label: 'Factor de forma', key: 'form', options: ['Mini-ITX', 'Micro-ATX', 'ATX', 'E-ATX'] },
    { label: 'Ranuras RAM', key: 'ram', options: ['2 ranuras', '4 ranuras'] },
  ],
  'Tarjetas de Video': [
    { label: 'Marca GPU', key: 'brand', options: ['NVIDIA', 'AMD'] },
    { label: 'Modelo', key: 'model', options: ['GTX 1650', 'RTX 3060', 'RTX 3070', 'RTX 4060', 'RTX 4070', 'RX 6600', 'RX 7600'] },
    { label: 'VRAM', key: 'vram', options: ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB'] },
    { label: 'Uso', key: 'use', options: ['Gaming 1080p', 'Gaming 1440p', 'Gaming 4K', 'Diseño / IA'] },
  ],
}

interface CartItem { product: Product; qty: number }

export default function VenderView() {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [catOpen, setCatOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)
  const [detailImg, setDetailImg] = useState(0)
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

  // Limpiar filtros al cambiar categoría
  useEffect(() => { setActiveFilters({}) }, [selectedCat])

  const currentFilters = CAT_FILTERS[selectedCat] ?? []
  const totalActiveFilters = Object.values(activeFilters).flat().length

  const toggleFilter = (key: string, val: string) => {
    setActiveFilters(prev => {
      const cur = prev[key] ?? []
      return { ...prev, [key]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] }
    })
  }

  const filtered = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.code.toLowerCase().includes(search.toLowerCase())
    const matchCat = !selectedCat || selectedCat === 'Todos los Productos' ? true : p.category === selectedCat
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
        <button className="btn-history" onClick={() => setShowHistory(true)}>Historial de ventas</button>
      </div>

      {/* ── Topbar ── */}
      <div className="vender-topbar">
        <input className="vender-search" type="text" placeholder="Producto"
          value={search} onChange={e => setSearch(e.target.value)} />

        {/* Dropdown categorías */}
        <div className="vender-cat-dropdown" ref={catRef}>
          <button className="vender-cat-trigger" onClick={() => setCatOpen(o => !o)}>
            <span>{!selectedCat || selectedCat === 'Todos los Productos' ? 'Categoría' : selectedCat}</span>
            <span className="vender-cat-arrow">{catOpen ? '▴' : '▾'}</span>
          </button>
          {catOpen && (
            <div className="vender-cat-menu">
              {categories.map(c => (
                <button key={c}
                  className={`vender-cat-option ${selectedCat === c ? 'active' : ''}`}
                  onClick={() => { setSelectedCat(selectedCat === c ? '' : c); setCatOpen(false) }}>
                  <span className="vender-cat-icon">{CAT_ICONS[c]}</span>
                  <span className="vender-cat-label">{c.toUpperCase()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botón Filtros */}
        <div className="vender-filter-wrap" ref={filterRef}>
          <button
            className={`vender-filter-btn ${filterOpen ? 'open' : ''} ${totalActiveFilters > 0 ? 'has-filters' : ''}`}
            onClick={() => setFilterOpen(o => !o)}
            title="Filtros"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            <span>Filtros</span>
            {totalActiveFilters > 0 && <span className="filter-badge">{totalActiveFilters}</span>}
          </button>

          {/* Panel de filtros */}
          {filterOpen && (
            <div className="filter-panel">
              <div className="filter-panel-header">
                <span className="filter-panel-title">
                  {selectedCat && selectedCat !== 'Todos los Productos' ? `Filtros · ${selectedCat}` : 'Filtros'}
                </span>
                {totalActiveFilters > 0 && (
                  <button className="filter-clear-all" onClick={() => setActiveFilters({})}>Limpiar todo</button>
                )}
              </div>

              {currentFilters.length === 0 ? (
                <div className="filter-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" width="40" height="40">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="#ccc"/>
                  </svg>
                  <p>Selecciona una categoría<br/>para ver sus filtros</p>
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
                            <button key={opt}
                              className={`filter-chip ${active ? 'active' : ''}`}
                              onClick={() => toggleFilter(group.key, opt)}>
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

        <button className="vender-cart-btn" onClick={() => setShowCart(true)} title="Ver carrito">
          🛒
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>

      {/* Chips de filtros activos */}
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

      {/* ── Grid de productos ── */}
      <div className="vender-body">
        <div className="sell-cards-grid">
          {filtered.length === 0 && (
            <p className="empty-state" style={{ gridColumn: '1/-1' }}>No se encontraron productos.</p>
          )}
          {filtered.map(p => {
            const inCart = cart.find(i => i.product.id === p.id)
            return (
              <div key={p.id} className="sell-card">
                <div className="sell-card-inner">
                  {/* BACK — imagen principal al hover */}
                  <div className="sell-card-back">
                    <div className="sell-card-back-anim" />
                    <div className="sell-card-back-content">
                      {p.cover
                        ? <img src={p.cover} alt={p.name} className="sell-card-back-img" />
                        : <span style={{ fontSize: '2.5rem' }}>📦</span>}
                      <strong style={{ color: '#fff', fontSize: '0.82rem', textAlign: 'center' }}>{p.name}</strong>
                    </div>
                  </div>

                  {/* FRONT */}
                  <div className="sell-card-front">
                    {/* Lupita arriba derecha */}
                    <button className="sell-card-zoom" title="Ver detalles"
                      onClick={e => { e.stopPropagation(); setDetailImg(0); setDetailProduct(p) }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                        strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                        <circle cx="11" cy="11" r="7"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </button>

                    {/* Imagen principal en el front */}
                    {p.cover ? (
                      <div className="sell-card-cover-wrap">
                        <img src={p.cover} alt={p.name} className="sell-card-cover-img" />
                      </div>
                    ) : (
                      <div className="sell-card-img-bg">
                        <div className="sc-circle" /><div className="sc-circle" id="sc-right" /><div className="sc-circle" id="sc-bottom" />
                      </div>
                    )}

                    <div className="sell-card-front-content">
                      <span className="sell-card-badge">{p.category}</span>
                      <div className="sell-card-desc">
                        <p className="sell-card-name"><strong>{p.name}</strong>{p.featured && <span style={{ color: '#f59e0b' }}> ★</span>}</p>
                        <p className="sell-card-meta">S/ {Number(p.price).toFixed(2)} &nbsp;|&nbsp; Stock: {p.stock}</p>
                        <p className="sell-card-brand">{p.brand} {p.model}</p>
                        <div className="sell-card-action">
                          {inCart ? (
                            <div className="sell-qty-ctrl">
                              <button onClick={() => updateQty(p.id, inCart.qty - 1)}>−</button>
                              <span>{inCart.qty}</span>
                              <button onClick={() => updateQty(p.id, inCart.qty + 1)}>+</button>
                            </div>
                          ) : (
                            <button className="sell-card-add-btn" onClick={() => addToCart(p)} disabled={p.stock === 0}>
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

      {/* Panel carrito */}
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
                  <polygon points="50,5 65,25 55,25 55,45 45,45 45,25 35,25" fill="#222" stroke="none"/>
                  <line x1="20" y1="55" x2="25" y2="75"/><line x1="25" y1="75" x2="75" y2="75"/>
                  <line x1="75" y1="75" x2="80" y2="55"/><line x1="20" y1="55" x2="80" y2="55"/>
                  <line x1="30" y1="55" x2="32" y2="75"/><line x1="45" y1="55" x2="45" y2="75"/>
                  <line x1="60" y1="55" x2="58" y2="75"/><line x1="72" y1="55" x2="75" y2="75"/>
                  <circle cx="33" cy="80" r="4" fill="#222" stroke="none"/><circle cx="67" cy="80" r="4" fill="#222" stroke="none"/>
                  <circle cx="38" cy="50" r="2.5" fill="#222" stroke="none"/><circle cx="62" cy="50" r="2.5" fill="#222" stroke="none"/>
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
                      {product.cover ? <img src={product.cover} alt={product.name} /> : <span>📦</span>}
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
                  <span>Subtotal ({totalItems} items)</span><span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="cart-panel-total-row" style={{ fontWeight: 700, fontSize: '1rem', color: '#111' }}>
                  <span>Total</span><span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                <button className="btn-primary cart-panel-confirm" onClick={() => { setCart([]); setShowCart(false) }}>
                  Confirmar venta
                </button>
                <button className="cart-panel-clear" onClick={() => setCart([])}>Vaciar carrito</button>
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

      {/* Modal detalles del producto */}
      {detailProduct && (() => {
        const p = detailProduct
        const allImgs = [p.cover, ...p.gallery].filter(Boolean) as string[]
        const prev = () => setDetailImg(i => (i - 1 + allImgs.length) % allImgs.length)
        const next = () => setDetailImg(i => (i + 1) % allImgs.length)
        const inCart = cart.find(i => i.product.id === p.id)
        return (
          <div className="modal-overlay" onClick={() => setDetailProduct(null)}>
            <div className="detail-modal" onClick={e => e.stopPropagation()}>
              <div className="detail-modal-header">
                <span className="detail-modal-title">Detalles del Producto</span>
                <button className="modal-close" onClick={() => setDetailProduct(null)}>✕</button>
              </div>

              <div className="detail-modal-body">
                {/* Columna izquierda: carrusel */}
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
                        <button key={i}
                          className={`detail-thumb ${detailImg === i ? 'active' : ''}`}
                          onClick={() => setDetailImg(i)}>
                          <img src={img} alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Columna derecha: info */}
                <div className="detail-col-info">
                  <div className="detail-tags">
                    {p.brand && <span className="detail-tag brand">{p.brand.toUpperCase()}</span>}
                    <span className="detail-tag cat">{p.category.toUpperCase()}</span>
                    <span className={`detail-tag stock ${p.stock === 0 ? 'nostock' : 'instock'}`}>
                      {p.stock === 0 ? '✗ Sin stock' : `✓ ${p.stock} en stock`}
                    </span>
                  </div>

                  <h2 className="detail-name">{p.name}</h2>
                  {p.model && <p className="detail-model">{p.model}</p>}

                  {p.description && (
                    <p className="detail-desc">{p.description}</p>
                  )}

                  <div className="detail-price-box">
                    <span className="detail-price-label">PRECIO</span>
                    <span className="detail-price">S/ {Number(p.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="detail-modal-footer">
                <button className="detail-add-btn"
                  disabled={p.stock === 0}
                  onClick={() => { addToCart(p); setDetailProduct(null) }}>
                  {inCart ? `En carrito (${inCart.qty}) · + Agregar` : 'Agregar al Carrito'}
                </button>
                <button className="detail-close-btn" onClick={() => setDetailProduct(null)}>Cerrar</button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
