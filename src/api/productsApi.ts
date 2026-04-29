import { apiClient } from './client'
import type {
  Product,
  Category,
  CreateProductPayload,
  UpdateProductPayload,
  PaginatedResponse,
} from '../types'

interface GetProductsParams {
  page?: number
  limit?: number
  name?: string
  categoryId?: number
  isActive?: boolean
}

export async function getProducts(
  params?: GetProductsParams
): Promise<PaginatedResponse<Product>> {
  return apiClient<PaginatedResponse<Product>>('/api/products', {
    params: params as Record<string, string | number | boolean | undefined>,
  })
}

export async function getProductById(id: number): Promise<Product> {
  return apiClient<Product>(`/api/products/${id}`)
}

export async function createProduct(data: CreateProductPayload): Promise<Product> {
  return apiClient<Product>('/api/products', {
    method: 'POST',
    body: data,
  })
}

export async function updateProduct(
  id: number,
  data: UpdateProductPayload
): Promise<Product> {
  return apiClient<Product>(`/api/products/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteProduct(id: number): Promise<Product> {
  return apiClient<Product>(`/api/products/${id}`, {
    method: 'DELETE',
  })
}

export async function adjustStock(
  id: number,
  delta: number,
  note?: string
): Promise<Product> {
  return apiClient<Product>(`/api/products/${id}/stock`, {
    method: 'PATCH',
    body: { delta, note },
  })
}

export async function getCategories(): Promise<Category[]> {
  return apiClient<Category[]>('/api/categories')
}