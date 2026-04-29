import type { Customer } from './customer'
export type SaleStatus = 'COMPLETADA' | 'ANULADA' | 'PENDIENTE_PAGO'

export interface PaymentMethod {
  id: number
  name: string
  isActive: boolean
}

export interface SaleItem {
  id: number
  saleId: number
  productId: number
  nombreSnapshot: string
  precioSnapshot: number
  quantity: number
  descuento: number
  subtotal: number
  product?: {
    id: number
    sku?: string | null
  }
}

export interface SalePayment {
  id: number
  saleId: number
  paymentMethodId: number
  amount: number
  paymentMethod?: PaymentMethod
}

export interface Sale {
  id: number
  userId: number
  customerId?: number | null
  subtotal: number
  descuento: number
  total: number
  status: SaleStatus
  createdAt: string
  user?: {
    id: number
    username: string
    email: string
  }
  customer?: Customer | null
  items?: SaleItem[]
  payments?: SalePayment[]
}

// Lo que se envía al crear una venta
export interface CreateSaleItemPayload {
  productId: number
  quantity: number
  descuento?: number
}

export interface CreateSalePaymentPayload {
  paymentMethodId: number
  amount: number
}

export interface CreateSalePayload {
  customerId?: number
  items: CreateSaleItemPayload[]
  payments: CreateSalePaymentPayload[]
  descuento?: number
  status?: SaleStatus
}