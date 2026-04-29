import { useState, useRef } from 'react'
import { useProducts } from '../../hooks/useProducts'
import type { Product, CreateProductPayload, UpdateProductPayload } from '../../types'

const emptyForm = (): CreateProductPayload => ({
  sku: '',
  name: '',
  description: '',
  price: 0,
  cost: 0,
  stockCurrent: 0,
  stockMin: 5,
  categoryId: undefined,
  coverImageUrl: '',
  gallery: [],
  tags: [],
  isFeatured: false,
  isActive: true,
})

export default function ProductosView() {
  const { products, categories, loading, error, create, update, remove, fetchProducts } = useProducts({ isActive: true })
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof CreateProductPayload, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => set('coverImageUrl', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const updated = [...(form.gallery ?? [])]
      updated[idx] = ev.target?.result as string
      set('gallery', updated)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await update(editing.id, form as UpdateProductPayload)
      } else {
        await create(form as CreateProductPayload)
      }
      setEditing(null)
      setForm(emptyForm())
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Error al guardar:', err)
    }
  }

  const loadEdit = (p: Product) => {
    setEditing(p)
    setForm({
      sku: p.sku ?? '',
      name: p.name,
      description: p.description ?? '',
      price: p.price,
      cost: p.cost ?? 0,
      stockCurrent: p.stockCurrent,
      stockMin: p.stockMin,
      categoryId: p.categoryId ?? undefined,
      coverImageUrl: p.coverImageUrl ?? '',
      gallery: p.gallery ?? [],
      tags: p.tags ?? [],
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    })
    // scroll al top del formulario
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number) => {
    try {
      await remove(id)
      if (editing?.id === id) {
        setEditing(null)
        setForm(emptyForm())
      }
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku?.toLowerCase().includes(search.toLowerCase()) ?? false)
  )

  const stockStatus = (p: Product) => {
    if (p.stockCurrent === 0) return { label: 'Sin stock', cls: 'badge-nostock' }
    if (p.stockCurrent <= p.stockMin) return { label: 'Stock bajo', cls: 'badge-low' }
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
              {form.coverImageUrl
                ? <img src={form.coverImageUrl} alt="portada" className="pv-img-fill" />
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
              {form.coverImageUrl && (
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
                  {form.gallery?.[idx]
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
            <p className="pv-field-lbl">Codigo de serie</p>
            <input className="pv-input" placeholder="SKU"
              value={form.sku ?? ''} onChange={e => set('sku', e.target.value)} />
              </div>
              <div>
                <p className="pv-field-lbl">CATEGORÍA</p>
                <select className="pv-input pv-select" value={form.categoryId ?? ''}
                  onChange={e => set('categoryId', e.target.value ? Number(e.target.value) : undefined)}>
                  <option value="">Seleccionar categoría</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="pv-row2">
              <div>
                <p className="pv-field-lbl">PRECIO</p>
                <input className="pv-input" type="number" min="0" placeholder="Precio"
                  value={form.price || ''} onChange={e => set('price', Number(e.target.value))} />
              </div>
              <div>
                <p className="pv-field-lbl">COSTO</p>
                <input className="pv-input" type="number" min="0" placeholder="Costo"
                  value={form.cost ?? ''} onChange={e => set('cost', Number(e.target.value))} />
              </div>
            </div>

            <p className="pv-field-lbl">DESCRIPCIÓN</p>
            <textarea className="pv-input pv-textarea" placeholder="Descripción"
              value={form.description} onChange={e => set('description', e.target.value)} />

            <label className="prod-featured-check">
              <input type="checkbox" checked={form.isFeatured}
                onChange={e => set('isFeatured', e.target.checked)} />
              <span>⭐ Destacar este producto</span>
            </label>
          </div>

          {/* Col 3: stock + guardar */}
          <div className="pv-col-stock">
            <p className="pv-stock-title">STOCK</p>

            <p className="pv-field-lbl">STOCK ACTUAL</p>
            <input className="pv-input" type="number" min="0" placeholder="Stock actual"
              value={form.stockCurrent || ''} onChange={e => set('stockCurrent', Number(e.target.value))} />

            <p className="pv-field-lbl" style={{ marginTop: '0.75rem' }}>STOCK MÍNIMO</p>
            <input className="pv-input" type="number" min="0" placeholder="Stock mínimo"
              value={form.stockMin || ''} onChange={e => set('stockMin', Number(e.target.value))} />

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
          <input className="pv-search" type="text" placeholder="Buscar por nombre o SKU..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <table className="prod-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="prod-empty">No hay productos. Agrega uno arriba.</td></tr>
            )}
            {filtered.map(p => {
              const st = stockStatus(p)
              const isEditing = editing?.id === p.id
              return (
                <tr key={p.id} className={isEditing ? 'pv-row-editing' : ''}>
                  <td className="prod-code">{p.sku || '—'}</td>
                  <td className="prod-name-cell">
                    {p.coverImageUrl && <img src={p.coverImageUrl} alt="" className="prod-row-img" />}
                    <span className="prod-name-text">{p.name}</span>
                    {p.isFeatured && <span className="prod-star">★</span>}
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td>{p.description?.substring(0, 30) || '—'}</td>
                  <td>S/ {Number(p.price).toFixed(2)}</td>
                  <td>{p.stockCurrent}</td>
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
