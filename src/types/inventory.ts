// ─────────────────────────────────────────────────────────────────────────────
// TIPOS: Módulo de Inventario Serializado
// Basado en el flujo del documento "Escaneo masivo + POS + Trazabilidad"
// ─────────────────────────────────────────────────────────────────────────────

// Estados posibles de una unidad física
export type InstanceStatus =
  | 'DISPONIBLE'   // en almacén, lista para vender
  | 'VENDIDO'      // ya fue vendida a un cliente
  | 'GARANTIA'     // el cliente la trajo por garantía
  | 'REPARACION'   // en servicio técnico
  | 'DEVUELTO'     // devuelta, pendiente de revisión
  | 'OBSOLETO'     // dada de baja

// Un evento en el historial de una unidad
export interface InstanceEvent {
  id: number
  instanceId: number
  event: InstanceStatus | 'RECIBIDO' | 'RECLAMO'
  detail: string
  performedBy: string   // nombre del operario o cajero
  createdAt: string
}

// Una unidad física individual (una laptop, un monitor, etc.)
export interface ProductInstance {
  id: number
  serialNumber: string        // SN único por unidad física
  productId: number           // referencia al producto
  status: InstanceStatus
  receivedAt: string          // fecha de ingreso al almacén
  receivedBy: string          // operario que la recibió
  soldAt?: string | null      // fecha de venta
  soldTo?: string | null      // nombre del cliente
  saleId?: number | null      // ID de la venta
  warrantyExpiresAt?: string | null  // fecha de vencimiento de garantía
  history?: InstanceEvent[]
}

// ── Payloads para la API ──────────────────────────────────────────────────────

// Registrar una recepción masiva de unidades
export interface ReceiveInstancesPayload {
  productId: number
  serialNumbers: string[]     // lista de SNs escaneados
  receivedBy: string
  note?: string
}

// Cambiar el estado de una unidad
export interface UpdateInstanceStatusPayload {
  status: InstanceStatus
  detail: string
  performedBy: string
}

// Buscar instancias
export interface GetInstancesParams {
  productId?: number
  status?: InstanceStatus
  serialNumber?: string
  page?: number
  limit?: number
}

// Respuesta de recepción masiva
export interface ReceiveInstancesResponse {
  created: number             // cuántas unidades se registraron
  skipped: number             // cuántas se saltaron (SN duplicado)
  instances: ProductInstance[]
}
