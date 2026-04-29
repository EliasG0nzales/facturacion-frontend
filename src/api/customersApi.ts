import { apiClient } from './client'
import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  PaginatedResponse,
} from '../types'

interface GetCustomersParams {
  page?: number
  limit?: number
}

export async function getCustomers(
  params?: GetCustomersParams
): Promise<PaginatedResponse<Customer>> {
  return apiClient<PaginatedResponse<Customer>>('/api/customers', {
    params: params as Record<string, string | number | boolean | undefined>,
  })
}

export async function getCustomerById(id: number): Promise<Customer> {
  return apiClient<Customer>(`/api/customers/${id}`)
}

export async function createCustomer(
  data: CreateCustomerPayload
): Promise<Customer> {
  return apiClient<Customer>('/api/customers', {
    method: 'POST',
    body: data,
  })
}

export async function updateCustomer(
  id: number,
  data: UpdateCustomerPayload
): Promise<Customer> {
  return apiClient<Customer>(`/api/customers/${id}`, {
    method: 'PUT',
    body: data,
  })
}

export async function deleteCustomer(id: number): Promise<Customer> {
  return apiClient<Customer>(`/api/customers/${id}`, {
    method: 'DELETE',
  })
}