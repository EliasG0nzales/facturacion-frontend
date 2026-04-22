import { useState, useRef } from 'react'
import { mockProducts, addProduct, updateProduct, categories } from '../../data/mockData'
import type { Product } from '../../types'

const LABELS = ['Sin etiqueta', 'Nuevo', 'Oferta', 'Destacado', 'Agotado']

const emptyForm = (): Omit<Product, 'id' | 'sold'> => ({
  name: '', brand: '', model: '', price: 0, cost: 0, code: '',
  description: '', stock: 0, minStock: 5, category: 'Monitores',
  label: 'Sin etiqueta', featured: false, cover: '', gallery: [],
})

export default function ProductosView() {
  const [products, setProducts] = useState<Product[]>([...mockProducts])
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)

  const refresh = () => setProducts([...mockProducts])

  const set = (k: keyof typeof form, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('cover', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const updated = [...form.gallery]
      updated[idx] = ev.target?.result as string
      set('gallery', updated)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      updateProduct({ ...editing, ...form })
    } else {
      addProduct({ ...form, id: String(Date.now()), sold: 0 })
    }
    refresh()
    setEditing(null)
    setForm(emptyForm())
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const loadEdit = (p: Product) => {
    setEditing(p)
    setForm({
      name: p.name, brand: p.brand, model: p.model, price: p.price,
      cost: p.cost, code: p.code, description: p.description, stock: p.stock,
      minStock: p.minStock, category: p.category, label: p.label,
      featured: p.featured, cover: p.cover ?? '', gallery: [...p.gallery],
    })
    // scroll al top del formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = (id: string) => {
    const idx = mockProducts.findIndex(p => p.id === id)
    if (idx !== -1) mockProducts.splice(idx, 1)
    if (editing?.id === id) { setEditing(null); setForm(emptyForm()) }
    refresh()
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  )

  const stockStatus = (p: Product) => {
    if (p.stock === 0) return { label: 'Sin stock', cls: 'badge-nostock' }
    if (p.stock <= p.minStock) return { label: 'Stock bajo', cls: 'badge-low' }
    return { label: 'En stock', cls: 'badge-instock' }
  }

  return (
    <div className="view-container" style={{ overflowY: 'auto' }}>

      {/* Header */}
      <div className="view-header">
        <h2 className="view-title">Productos</h2>
      </div>

      {/* ── FORMULARIO ARRIBA ── */}
      <div className="pv-form-section">

        {/* Topbar */}
        <div className="pv-topbar">
          <span className="pv-hint">Registre sus productos...</span>
          <label className="prod-featured-check">
            <input type="checkbox" checked={form.featured}
              onChange={e => set('featured', e.target.checked)} />
            <span>⭐ Destacar un producto</span>
          </label>
          <div className="prod-label-select">
            <span>Etiqueta:</span>
            <select value={form.label} onChange={e => set('label', e.target.value)}>
              {LABELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          {editing && (
            <button className="pv-clear-btn" onClick={() => { setEditing(null); setForm(emptyForm()) }}>
              ✕ Cancelar edición
            </button>
          )}
        </div>

        {/* Cuerpo 3 columnas */}
        <form onSubmit={handleSave} className="pv-form-body">

          {/* Col 1: imágenes */}
          <div className="pv-col-img">
            {/* Portada principal grande */}
            <p className="pv-col-label">IMAGEN PRINCIPAL</p>
            <div className="pv-cover" onClick={() => coverRef.current?.click()}>
              {form.cover
                ? <img src={form.cover} alt="portada" className="pv-img-fill" />
                : (
                  <div className="pv-cover-placeholder">
                    <svg viewBox="0 0 48 48" fill="none" stroke="#ccc" strokeWidth="1.5" width="52" height="52">
                      <rect x="4" y="8" width="40" height="32" rx="4"/>
                      <circle cx="16" cy="20" r="4"/>
                      <path d="M4 34 l10-10 8 8 6-6 16 12"/>
                    </svg>
                    <span className="pv-cover-hint">Subir imagen principal</span>
                  </div>
                )}
              <input ref={coverRef} type="file" accept="image/*" hidden onChange={handleCover} />
              {form.cover && (
                <div className="pv-cover-overlay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" width="20" height="20">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Cambiar</span>
                </div>
              )}
            </div>

            {/* Galería 4 miniaturas en fila */}
            <p className="pv-col-label" style={{ marginTop: '0.75rem' }}>IMÁGENES SECUNDARIAS</p>
            <div className="pv-gallery">
              {[0, 1, 2, 3].map(idx => (
                <div key={idx} className="pv-gal-cell"
                  onClick={() => (document.getElementById(`pgal-${idx}`) as HTMLInputElement)?.click()}>
                  {form.gallery[idx]
                    ? <img src={form.gallery[idx]} alt="" className="pv-img-fill" />
                    : (
                      <div className="pv-gal-placeholder">
                        <svg viewBox="0 0 48 48" fill="none" stroke="#ccc" strokeWidth="1.5" width="28" height="28">
                          <rect x="4" y="8" width="40" height="32" rx="4"/>
                          <circle cx="16" cy="20" r="4"/>
                          <path d="M4 34 l10-10 8 8 6-6 16 12"/>
                        </svg>
                        <span style={{ fontSize: '0.65rem', color: '#ccc', marginTop: '4px' }}>{idx + 1}</span>
                      </div>
                    )}
                  <input id={`pgal-${idx}`} type="file" accept="image/*" hidden
                    onChange={e => handleGallery(e, idx)} />
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: campos */}
          <div className="pv-col-fields">
            <p className="pv-field-lbl">NOMBRE DEL PRODUCTO</p>
            <input className="pv-input" placeholder="Nombre del producto"
              value={form.name} onChange={e => set('name', e.target.value)} required />

            <div className="pv-row2">
              <div>
                <p className="pv-field-lbl">MARCA</p>
                <input className="pv-input" placeholder="Marca"
                  value={form.brand} onChange={e => set('brand', e.target.value)} />
              </div>
              <div>
                <p className="pv-field-lbl">MODELO</p>
                <input className="pv-input" placeholder="Modelo"
                  value={form.model} onChange={e => set('model', e.target.value)} />
              </div>
            </div>

            <div className="pv-row2">
              <div>
                <p className="pv-field-lbl">PRECIO</p>
                <input className="pv-input" type="number" min="0" placeholder="Precio"
                  value={form.price || ''} onChange={e => set('price', Number(e.target.value))} />
              </div>
              <div>
                <p className="pv-field-lbl">CATEGORÍA</p>
                <select className="pv-input pv-select" value={form.category}
                  onChange={e => set('category', e.target.value)}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <p className="pv-field-lbl">DESCRIPCIÓN</p>
            <textarea className="pv-input pv-textarea" placeholder="Descripción"
              value={form.description} onChange={e => set('description', e.target.value)} />

            <p className="pv-field-lbl">CÓDIGO DEL PRODUCTO</p>
            <input className="pv-input" placeholder="Código del producto"
              value={form.code} onChange={e => set('code', e.target.value)} />
          </div>

          {/* Col 3: stock + guardar */}
          <div className="pv-col-stock">
            <p className="pv-stock-title">STOCK</p>

            <p className="pv-field-lbl">STOCK ACTUAL</p>
            <input className="pv-input" type="number" min="0" placeholder="Stock actual"
              value={form.stock || ''} onChange={e => set('stock', Number(e.target.value))} />

            <p className="pv-field-lbl" style={{ marginTop: '0.75rem' }}>STOCK MÍNIMO</p>
            <input className="pv-input" type="number" min="0" placeholder="Stock mínimo"
              value={form.minStock || ''} onChange={e => set('minStock', Number(e.target.value))} />

            <div style={{ flex: 1 }} />

            {saved && <p className="pv-saved">✅ Guardado</p>}

            <button type="submit" className="pv-btn-save">
              {editing ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>

      {/* ── TABLA ABAJO ── */}
      <div className="pv-table-section">
        <div className="pv-table-topbar">
          <span className="pv-table-count">Todos los productos ({filtered.length})</span>
          <input className="pv-search" type="text" placeholder="Buscar por nombre o código..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <table className="prod-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="prod-empty">No hay productos. Agrega uno arriba.</td></tr>
            )}
            {filtered.map(p => {
              const st = stockStatus(p)
              const isEditing = editing?.id === p.id
              return (
                <tr key={p.id} className={isEditing ? 'pv-row-editing' : ''}>
                  <td className="prod-code">{p.code || '—'}</td>
                  <td className="prod-name-cell">
                    {p.cover && <img src={p.cover} alt="" className="prod-row-img" />}
                    <span className="prod-name-text">{p.name}</span>
                    {p.featured && <span className="prod-star">★</span>}
                  </td>
                  <td>{p.brand || '—'}</td>
                  <td>{p.model || '—'}</td>
                  <td>{p.category}</td>
                  <td>S/ {Number(p.price).toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td><span className={`prod-badge ${st.cls}`}>{st.label}</span></td>
                  <td className="prod-actions">
                    <button className="prod-edit-btn" onClick={() => loadEdit(p)} title="Editar">✏️</button>
                    <button className="prod-del-btn" onClick={() => handleDelete(p.id)} title="Eliminar">🗑</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
