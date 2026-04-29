// ─────────────────────────────────────────────────────────────────────────────
// HOOK: useInventory
// Maneja el estado del módulo de inventario serializado.
// Cuando el backend esté listo, solo se actualizan las funciones en inventoryApi.ts
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react'
import type {
  ProductInstance,
  InstanceStatus,
  ReceiveInstancesPayload,
  UpdateInstanceStatusPayload,
  GetInstancesParams,
} from '../types'
import {
  receiveInstances,
  getInstanceBySN,
  getInstances,
  updateInstanceStatus,
  validateSNForSale,
  markInstanceAsSold,
} from '../api/inventoryApi'

interface UseInventoryReturn {
  instances: ProductInstance[]
  loading: boolean
  error: string | null

  // Recepción masiva de mercadería
  receive: (payload: ReceiveInstancesPayload) => Promise<{
    created: number
    skipped: number
  } | null>

  // Buscar por SN
  findBySN: (sn: string) => Promise<ProductInstance | null>

  // Listar con filtros
  fetchInstances: (params?: GetInstancesParams) => Promise<void>

  // Cambiar estado (garantía, reparación, etc.)
  changeStatus: (
    instanceId: number,
    status: InstanceStatus,
    detail: string,
    performedBy: string
  ) => Promise<boolean>

  // Validar SN en el POS antes de agregar al carrito
  validateForSale: (sn: string) => Promise<{
    valid: boolean
    instance?: ProductInstance
    reason?: string
  }>

  // Marcar como vendido al confirmar venta
  sellInstance: (
    instanceId: number,
    saleId: number,
    soldTo: string
  ) => Promise<boolean>

  clearError: () => void
}

export function useInventory(): UseInventoryReturn {
  const [instances, setInstances] = useState<ProductInstance[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Recepción masiva ────────────────────────────────────────────────────────
  const receive = useCallback(async (
    payload: ReceiveInstancesPayload
  ) => {
    setLoading(true)
    setError(null)
    try {
      const result = await receiveInstances(payload)
      // Agregar las nuevas instancias al estado local
      setInstances(prev => [...prev, ...result.instances])
      return { created: result.created, skipped: result.skipped }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar unidades')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Buscar por SN ───────────────────────────────────────────────────────────
  const findBySN = useCallback(async (sn: string) => {
    setError(null)
    try {
      return await getInstanceBySN(sn)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar SN')
      return null
    }
  }, [])

  // ── Listar instancias ───────────────────────────────────────────────────────
  const fetchInstances = useCallback(async (params?: GetInstancesParams) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getInstances(params)
      setInstances(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar instancias')
    } finally {
      setLoading(false)
    }
  }, [])

  // ── Cambiar estado ──────────────────────────────────────────────────────────
  const changeStatus = useCallback(async (
    instanceId: number,
    status: InstanceStatus,
    detail: string,
    performedBy: string
  ) => {
    setError(null)
    const payload: UpdateInstanceStatusPayload = { status, detail, performedBy }
    try {
      const updated = await updateInstanceStatus(instanceId, payload)
      setInstances(prev =>
        prev.map(i => i.id === instanceId ? updated : i)
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado')
      return false
    }
  }, [])

  // ── Validar SN en POS ───────────────────────────────────────────────────────
  const validateForSale = useCallback(async (sn: string) => {
    setError(null)
    try {
      return await validateSNForSale(sn)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al validar SN')
      return { valid: false, reason: 'Error de conexión' }
    }
  }, [])

  // ── Marcar como vendido ─────────────────────────────────────────────────────
  const sellInstance = useCallback(async (
    instanceId: number,
    saleId: number,
    soldTo: string
  ) => {
    setError(null)
    try {
      const updated = await markInstanceAsSold(instanceId, saleId, soldTo)
      setInstances(prev =>
        prev.map(i => i.id === instanceId ? updated : i)
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar venta')
      return false
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return {
    instances,
    loading,
    error,
    receive,
    findBySN,
    fetchInstances,
    changeStatus,
    validateForSale,
    sellInstance,
    clearError,
  }
}
