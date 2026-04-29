export interface Category {
  id: number
  name: string
  description?: string | null
}

export interface ProductImage {
  id: number
  productId: number
  url: string
  order: number
}

export type StockMovementType = 'ENTRADA' | 'SALIDA' | 'VENTA' | 'AJUSTE' | 'DEVOLUCION'

export interface StockMovement {
  id: number
  productId: number
  type: StockMovementType
  quantity: number
  referenceId?: number | null
  note?: string | null
  createdAt: string
}

export interface Product {
  id: number
  sku?: string | null
  name: string
  description?: string | null
  price: number
  cost?: number | null
  stockCurrent: number
  stockMin: number
  categoryId?: number | null
  coverImageUrl?: string | null
  gallery?: string[] | null
  tags?: string[] | null
  isFeatured: boolean
  isActive: boolean
  createdAt: string
  category?: Category | null
  images?: ProductImage[]
}

// Lo que se envía al crear un producto
export interface CreateProductPayload {
  sku?: string
  name: string
  description?: string
  price: number
  cost?: number
  stockCurrent?: number
  stockMin?: number
  categoryId?: number
  coverImageUrl?: string
  gallery?: string[]
  tags?: string[]
  isFeatured?: boolean
  isActive?: boolean
}

// Lo que se envía al editar
export type UpdateProductPayload = Partial<CreateProductPayload>