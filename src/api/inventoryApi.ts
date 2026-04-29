// ─────────────────────────────────────────────────────────────────────────────
// API: Módulo de Inventario Serializado
// TODO: reemplazar las funciones stub por llamadas reales a apiClient()
//       cuando el backend tenga los endpoints listos
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ProductInstance,
  ReceiveInstancesPayload,
  ReceiveInstancesResponse,
  UpdateInstanceStatusPayload,
  GetInstancesParams,
} from '../types'

// import { apiClient } from './client'  ← descomentar cuando el backend esté listo

// ── Recepción masiva ──────────────────────────────────────────────────────────

/**
 * Registra una recepción masiva de unidades serializadas.
 * Backend: POST /api/inventory/receive
 */
export async function receiveInstances(
  payload: ReceiveInstancesPayload
): Promise<ReceiveInstancesResponse> {
  // TODO: return apiClient<ReceiveInstancesResponse>('/api/inventory/receive', {
  //   method: 'POST',
  //   body: payload,
  // })

  // STUB temporal — simula respuesta del backend
  console.warn('[inventoryApi] receiveInstances: usando stub, backend no conectado')
  return {
    created: payload.serialNumbers.length,
    skipped: 0,
    instances: payload.serialNumbers.map((sn, i) => ({
      id: Date.now() + i,
      serialNumber: sn,
      productId: payload.productId,
      status: 'DISPONIBLE',
      receivedAt: new Date().toISOString(),
      receivedBy: payload.receivedBy,
    })),
  }
}

// ── Buscar instancias ─────────────────────────────────────────────────────────

/**
 * Busca una instancia por número de serie.
 * Backend: GET /api/inventory/instances?serialNumber=ABC123
 */
export async function getInstanceBySN(
  serialNumber: string
): Promise<ProductInstance | null> {
  // TODO: return apiClient<ProductInstance>('/api/inventory/instances/by-sn/' + serialNumber)

  console.warn('[inventoryApi] getInstanceBySN: usando stub')
  return null
}

/**
 * Lista instancias con filtros opcionales.
 * Backend: GET /api/inventory/instances?productId=1&status=DISPONIBLE
 */
export async function getInstances(
  params?: GetInstancesParams
): Promise<ProductInstance[]> {
  // TODO: return apiClient<ProductInstance[]>('/api/inventory/instances', { params })

  console.warn('[inventoryApi] getInstances: usando stub', params)
  return []
}

// ── Actualizar estado ─────────────────────────────────────────────────────────

/**
 * Cambia el estado de una unidad y registra el evento en su historial.
 * Backend: PATCH /api/inventory/instances/:id/status
 */
export async function updateInstanceStatus(
  instanceId: number,
  payload: UpdateInstanceStatusPayload
): Promise<ProductInstance> {
  // TODO: return apiClient<ProductInstance>(`/api/inventory/instances/${instanceId}/status`, {
  //   method: 'PATCH',
  //   body: payload,
  // })

  console.warn('[inventoryApi] updateInstanceStatus: usando stub')
  throw new Error('Backend no conectado aún')
}

// ── Validar SN en POS ─────────────────────────────────────────────────────────

/**
 * Valida si un SN está disponible para venta.
 * Usado en el POS cuando el cajero escanea el SN de una unidad.
 * Backend: GET /api/inventory/instances/validate/:serialNumber
 */
export async function validateSNForSale(
  serialNumber: string
): Promise<{ valid: boolean; instance?: ProductInstance; reason?: string }> {
  // TODO: return apiClient('/api/inventory/instances/validate/' + serialNumber)

  console.warn('[inventoryApi] validateSNForSale: usando stub')
  return { valid: false, reason: 'Backend no conectado aún' }
}

// ── Marcar como vendido ───────────────────────────────────────────────────────

/**
 * Marca una unidad como VENDIDO al confirmar la venta en el POS.
 * Backend: PATCH /api/inventory/instances/:id/sell
 */
export async function markInstanceAsSold(
  instanceId: number,
  saleId: number,
  soldTo: string
): Promise<ProductInstance> {
  // TODO: return apiClient<ProductInstance>(`/api/inventory/instances/${instanceId}/sell`, {
  //   method: 'PATCH',
  //   body: { saleId, soldTo },
  // })

  console.warn('[inventoryApi] markInstanceAsSold: usando stub')
  throw new Error('Backend no conectado aún')
}
