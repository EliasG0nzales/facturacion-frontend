export type NotificationType = 'STOCK_MINIMO' | 'VENTA_ANULADA'

export interface Notification {
  id: number
  type: NotificationType
  message: string
  referenceId?: number | null
  isRead: boolean
  createdAt: string
}