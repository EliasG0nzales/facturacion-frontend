import { apiClient } from './client'
import type {
  Sale,
  CreateSalePayload,
  PaginatedResponse,
} from '../types'

interface GetSalesParams {
  page?: number
  limit?: number
  userId?: number
  from?: string
  to?: string
}

export async function getSales(
  params?: GetSalesParams
): Promise<PaginatedResponse<Sale>> {
  return apiClient<PaginatedResponse<Sale>>('/api/sales', {
    params: params as Record<string, string | number | boolean | undefined>,
  })
}

export async function getSaleById(id: number): Promise<Sale> {
  return apiClient<Sale>(`/api/sales/${id}`)
}

export async function createSale(data: CreateSalePayload): Promise<Sale> {
  return apiClient<Sale>('/api/sales', {
    method: 'POST',
    body: data,
  })
}

export async function anularSale(id: number): Promise<Sale> {
  return apiClient<Sale>(`/api/sales/${id}/anular`, {
    method: 'PATCH',
  })
}