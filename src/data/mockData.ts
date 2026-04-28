import type { Product, User, Client } from '../types'

// Arrays en memoria — sin localStorage ni datos mock
// Estos serán reemplazados por llamadas a la API cuando el backend esté listo

export const mockUsers: User[] = []

export const mockClients: Client[] = []

export const mockProducts: Product[] = []

export function addUser(user: User) {
  mockUsers.push(user)
}

export function addClient(client: Client) {
  mockClients.push(client)
}

export function addProduct(product: Product) {
  mockProducts.push(product)
}

export function updateProduct(updated: Product) {
  const idx = mockProducts.findIndex(p => p.id === updated.id)
  if (idx !== -1) mockProducts[idx] = updated
}

export function deleteProduct(id: string) {
  const idx = mockProducts.findIndex(p => p.id === id)
  if (idx !== -1) mockProducts.splice(idx, 1)
}

export const categories = [
  'Todos los Productos',
  'Monitores',
  'Case',
  'PC Completa',
  'Disco SSD',
  'Estabilizador',
  'Fuente de Poder',
  'Memoria RAM',
  'Periféricos',
  'Placa Madre',
  'Tarjetas de Video',
]
