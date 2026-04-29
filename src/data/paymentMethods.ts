export const PAYMENT_METHODS = [
  { id: 1, name: 'Efectivo' },
  { id: 2, name: 'Tarjeta' },
  { id: 3, name: 'Yape' },
  { id: 4, name: 'Plin' },
  { id: 5, name: 'Transferencia' },
] as const

export type PaymentMethodId = typeof PAYMENT_METHODS[number]['id']