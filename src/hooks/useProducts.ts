import { useState, useEffect, useCallback } from 'react'
import type { Product, Category, PaginatedResponse } from '../types'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from '../api/productsApi'
import type {
  CreateProductPayload,
  UpdateProductPayload,
} from '../types'

interface UseProductsParams {
  page?: number
  limit?: number
  name?: string
  categoryId?: number
  isActive?: boolean
}

interface UseProductsReturn {
  products: Product[]
  meta: PaginatedResponse<Product>['meta'] | null
  categories: Category[]
  loading: boolean
  error: string | null
  fetchProducts: (params?: UseProductsParams) => Promise<void>
  fetchCategories: () => Promise<void>
  getOne: (id: number) => Promise<Product | null>
  create: (data: CreateProductPayload) => Promise<Product | null>
  update: (id: number, data: UpdateProductPayload) => Promise<Product | null>
  remove: (id: number) => Promise<boolean>
  clearError: () => void
}

export function useProducts(initialParams?: UseProductsParams): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState<PaginatedResponse<Product>['meta'] | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async (params?: UseProductsParams) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getProducts(params ?? initialParams)
      setProducts(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías')
    }
  }, [])

  const getOne = useCallback(async (id: number): Promise<Product | null> => {
    setError(null)
    try {
      return await getProductById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener producto')
      return null
    }
  }, [])

  const create = useCallback(async (
    data: CreateProductPayload
  ): Promise<Product | null> => {
    setLoading(true)
    setError(null)
    try {
      const newProduct = await createProduct(data)
      // Agregar al estado local sin refetch
      setProducts(prev => [newProduct, ...prev])
      return newProduct
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear producto')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const update = useCallback(async (
    id: number,
    data: UpdateProductPayload
  ): Promise<Product | null> => {
    setLoading(true)
    setError(null)
    try {
      const updated = await updateProduct(id, data)
      // Actualizar en el estado local sin refetch
      setProducts(prev =>
        prev.map(p => p.id === id ? updated : p)
      )
      return updated
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const remove = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await deleteProduct(id)
      // El backend hace soft delete, actualizar isActive en local
      setProducts(prev =>
        prev.map(p => p.id === id ? { ...p, isActive: false } : p)
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  // Carga inicial
  useEffect(() => {
    fetchProducts(initialParams)
    fetchCategories()
  }, [])

  return {
    products,
    meta,
    categories,
    loading,
    error,
    fetchProducts,
    fetchCategories,
    getOne,
    create,
    update,
    remove,
    clearError,
  }
}