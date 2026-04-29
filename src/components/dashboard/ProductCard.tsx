import type { Product } from '../../types'

interface Props {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: Props) {
  return (
    <div className="product-card" onClick={() => onAddToCart(product)}>
      <div className="product-image" aria-hidden="true" />
      <div className="product-info">
        <p className="product-name">{product.name.toUpperCase()}</p>
        <p className="product-stock"># STOCK: {product.stockCurrent}</p>
        <p className="product-category">{product.category?.name?.toUpperCase() || 'SIN CATEGORÍA'}</p>
      </div>
    </div>
  )
}
