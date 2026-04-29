import { apiClient } from './client'
import type { AuthResponse, LoginCredentials } from '../types'

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: credentials,
  })
}