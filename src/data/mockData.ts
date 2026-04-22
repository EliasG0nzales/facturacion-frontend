import type { Product, User, Client } from '../types'

// ── Persistencia en localStorage ──────────────────────────────────────────────

const USERS_KEY = 'venderapp_users'
const CLIENTS_KEY = 'venderapp_clients'

const defaultUsers: User[] = [
  { id: '0000001', name: 'USER 0000001', email: 'user@demo.com', password: '123456' },
]

const defaultClients: Client[] = [
  {
    id: '0000001', name: 'USER 0000001', email: 'user@demo.com',
    purchases: 0, totalSpent: 0, lastActivity: '2026-01-01',
    registeredAt: '2026-01-01', frequency: 'Ocasional',
  },
  {
    id: '0000002', name: 'Carlos Alcántara', email: 'carlos@mail.com',
    purchases: 12, totalSpent: 15000, lastActivity: '18 Enero 2026',
    registeredAt: '2025-06-10', frequency: 'Semanal', badge: 'Comprador Fiel',
  },
  {
    id: '0000003', name: 'Ana García', email: 'ana@mail.com',
    purchases: 8, totalSpent: 9200, lastActivity: '15 Enero 2026',
    registeredAt: '2025-08-22', frequency: 'Mensual', badge: 'Comprador Fiel',
  },
  {
    id: '0000004', name: 'María Rodríguez', email: 'maria@mail.com',
    purchases: 20, totalSpent: 23500, lastActivity: '20 Enero 2026',
    registeredAt: '2025-03-05', frequency: 'Semanal', badge: 'Comprador Fiel',
  },
]

function loadFromStorage<T>(key: string, defaults: T[]): T[] {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaults
  } catch {
    return defaults
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// Inicializar con defaults si es la primera vez
if (!localStorage.getItem(USERS_KEY)) saveToStorage(USERS_KEY, defaultUsers)
if (!localStorage.getItem(CLIENTS_KEY)) saveToStorage(CLIENTS_KEY, defaultClients)

export const mockUsers: User[] = loadFromStorage<User>(USERS_KEY, defaultUsers)
export const mockClients: Client[] = loadFromStorage<Client>(CLIENTS_KEY, defaultClients)

// Wrappers para agregar y persistir
export function addUser(user: User) {
  mockUsers.push(user)
  saveToStorage(USERS_KEY, mockUsers)
}

export function addClient(client: Client) {
  mockClients.push(client)
  saveToStorage(CLIENTS_KEY, mockClients)
}

// ── Productos ─────────────────────────────────────────────────────────────────

const PRODUCTS_KEY = 'venderapp_products'

const defaultProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  name: `Producto ${i + 1}`,
  brand: 'Marca',
  model: 'Modelo',
  price: (i + 1) * 50,
  cost: (i + 1) * 30,
  code: `COD-${String(i + 1).padStart(4, '0')}`,
  description: '',
  stock: Math.floor(Math.random() * 100) + 10,
  minStock: 5,
  sold: Math.floor(Math.random() * 50),
  category: ['Electrónica', 'Ropa', 'Alimentos', 'Hogar'][i % 4],
  label: 'Sin etiqueta',
  featured: false,
  gallery: [],
}))

if (!localStorage.getItem(PRODUCTS_KEY)) saveToStorage(PRODUCTS_KEY, defaultProducts)

export const mockProducts: Product[] = loadFromStorage<Product>(PRODUCTS_KEY, defaultProducts)

export function addProduct(product: Product) {
  mockProducts.push(product)
  saveToStorage(PRODUCTS_KEY, mockProducts)
}

export function updateProduct(updated: Product) {
  const idx = mockProducts.findIndex(p => p.id === updated.id)
  if (idx !== -1) {
    mockProducts[idx] = updated
    saveToStorage(PRODUCTS_KEY, mockProducts)
  }
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
