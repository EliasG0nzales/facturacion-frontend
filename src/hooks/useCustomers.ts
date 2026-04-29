import { useState, useEffect, useCallback } from 'react'
import type { Customer, PaginatedResponse } from '../types'
import type { CreateCustomerPayload, UpdateCustomerPayload } from '../types'
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '../api/customersApi'

interface UseCustomersParams {
  page?: number
  limit?: number
}

interface UseCustomersReturn {
  customers: Customer[]
  meta: PaginatedResponse<Customer>['meta'] | null
  loading: boolean
  error: string | null
  fetchCustomers: (params?: UseCustomersParams) => Promise<void>
  getOne: (id: number) => Promise<Customer | null>
  create: (data: CreateCustomerPayload) => Promise<Customer | null>
  update: (id: number, data: UpdateCustomerPayload) => Promise<Customer | null>
  remove: (id: number) => Promise<boolean>
  clearError: () => void
}

export function useCustomers(
  initialParams?: UseCustomersParams
): UseCustomersReturn {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [meta, setMeta] = useState<PaginatedResponse<Customer>['meta'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async (params?: UseCustomersParams) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getCustomers(params ?? initialParams)
      setCustomers(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  const getOne = useCallback(async (id: number): Promise<Customer | null> => {
    setError(null)
    try {
      return await getCustomerById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener cliente')
      return null
    }
  }, [])

  const create = useCallback(async (
    data: CreateCustomerPayload
  ): Promise<Customer | null> => {
    setLoading(true)
    setError(null)
    try {
      const newCustomer = await createCustomer(data)
      setCustomers(prev => [newCustomer, ...prev])
      return newCustomer
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear cliente')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const update = useCallback(async (
    id: number,
    data: UpdateCustomerPayload
  ): Promise<Customer | null> => {
    setLoading(true)
    setError(null)
    try {
      const updated = await updateCustomer(id, data)
      setCustomers(prev => prev.map(c => c.id === id ? updated : c))
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar cliente')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const remove = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await deleteCustomer(id)
      setCustomers(prev =>
        prev.map(c => c.id === id ? { ...c, isActive: false } : c)
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar cliente')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  useEffect(() => {
    fetchCustomers(initialParams)
  }, [])

  return {
    customers,
    meta,
    loading,
    error,
    fetchCustomers,
    getOne,
    create,
    update,
    remove,
    clearError,
  }
}