import { useState, useCallback } from 'react'
import type { Sale, CreateSalePayload, PaginatedResponse } from '../types'
import { getSales, getSaleById, createSale, anularSale } from '../api/salesApi'

interface GetSalesParams {
  page?: number
  limit?: number
  userId?: number
  from?: string
  to?: string
}

interface UseSalesReturn {
  sales: Sale[]
  meta: PaginatedResponse<Sale>['meta'] | null
  loading: boolean
  error: string | null
  fetchSales: (params?: GetSalesParams) => Promise<void>
  getOne: (id: number) => Promise<Sale | null>
  create: (data: CreateSalePayload) => Promise<Sale | null>
  anular: (id: number) => Promise<Sale | null>
  clearError: () => void
}

export function useSales(): UseSalesReturn {
  const [sales, setSales] = useState<Sale[]>([])
  const [meta, setMeta] = useState<PaginatedResponse<Sale>['meta'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSales = useCallback(async (params?: GetSalesParams) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getSales(params)
      setSales(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ventas')
    } finally {
      setLoading(false)
    }
  }, [])

  const getOne = useCallback(async (id: number): Promise<Sale | null> => {
    setError(null)
    try {
      return await getSaleById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener venta')
      return null
    }
  }, [])

  const create = useCallback(async (
    data: CreateSalePayload
  ): Promise<Sale | null> => {
    setLoading(true)
    setError(null)
    try {
      const newSale = await createSale(data)
      setSales(prev => [newSale, ...prev])
      return newSale
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear venta')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const anular = useCallback(async (id: number): Promise<Sale | null> => {
    setLoading(true)
    setError(null)
    try {
      const updated = await anularSale(id)
      setSales(prev => prev.map(s => s.id === id ? updated : s))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al anular venta')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { sales, meta, loading, error, fetchSales, getOne, create, anular, clearError }
}