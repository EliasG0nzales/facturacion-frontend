# 🖥️ VenderApp — Sistema de Facturación Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![Estado](https://img.shields.io/badge/estado-en%20desarrollo-orange?style=for-the-badge)

**Sistema integral de Punto de Venta (POS), gestión de inventario serializado y clientes para tienda de componentes informáticos.**

[📋 Issues](https://github.com/EliasG0nzales/facturacion-frontend/issues)

</div>

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Módulos del Sistema](#módulos-del-sistema)
6. [Capa de Tipos](#capa-de-tipos)
7. [Capa de API](#capa-de-api)
8. [Capa de Hooks](#capa-de-hooks)
9. [Módulo de Inventario Serializado](#módulo-de-inventario-serializado)
10. [Sistema de Filtros Técnicos](#sistema-de-filtros-técnicos)
11. [Instalación](#instalación)
12. [Variables de Entorno](#variables-de-entorno)
13. [Estado del Proyecto](#estado-del-proyecto)
14. [Roadmap](#roadmap)

---

## Descripción General

VenderApp es un frontend React + TypeScript para un sistema POS orientado a tiendas de componentes de cómputo. Se conecta a un backend REST mediante una capa de API centralizada.

### Características principales

- Autenticación con JWT y sesión persistente
- Módulo POS con carrito, búsqueda por código de barras y filtros técnicos por categoría
- Gestión de productos con imágenes, galería y especificaciones técnicas
- **Inventario serializado**: registro de números de serie (SN) por unidad física, trazabilidad completa y gestión de estados (DISPONIBLE → VENDIDO → GARANTIA → REPARACION)
- Gestión de clientes con historial de compras y ranking de activos
- Historial de ventas

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | UI |
| TypeScript | 6 | Tipado estático |
| Vite | 8 | Bundler / dev server |
| CSS puro | — | Estilos sin librerías externas |
| Fetch API | — | Llamadas HTTP al backend |

---

## Arquitectura del Proyecto

El proyecto sigue una arquitectura en capas. Cada capa tiene una responsabilidad única:

```
┌─────────────────────────────────────────┐
│           COMPONENTES (UI)              │  src/components/
│  Solo renderizan, llaman hooks          │
├─────────────────────────────────────────┤
│              HOOKS                      │  src/hooks/
│  Estado + lógica de negocio             │
│  Llaman funciones de la capa API        │
├─────────────────────────────────────────┤
│           CAPA DE API                   │  src/api/
│  Una función por endpoint               │
│  Usa apiClient() centralizado           │
├─────────────────────────────────────────┤
│           API CLIENT                    │  src/api/client.ts
│  fetch + auth token + manejo de errores │
├─────────────────────────────────────────┤
│              TIPOS                      │  src/types/
│  Interfaces y tipos compartidos         │
└─────────────────────────────────────────┘
```

**Regla clave:** cuando el backend cambie un endpoint, solo se modifica el archivo correspondiente en `src/api/`. Los hooks y componentes no cambian.

---

## Estructura de Archivos

```
src/
├── App.tsx                          # Entry point: usa AuthContext para decidir qué renderizar
├── App.css                          # Estilos globales
│
├── context/
│   └── AuthContext.tsx              # Proveedor de autenticación global (JWT + sesión)
│
├── types/                           # Contratos de datos TypeScript
│   ├── index.ts                     # Re-exporta todos los tipos + DashboardView
│   ├── auth.ts                      # User, AuthResponse, LoginCredentials
│   ├── product.ts                   # Product, Category, CreateProductPayload...
│   ├── customer.ts                  # Customer y payloads relacionados
│   ├── sale.ts                      # Sale, SaleItem, SalePayment, CreateSalePayload
│   ├── inventory.ts                 # ProductInstance, InstanceStatus, payloads de inventario
│   ├── notification.ts              # Tipos de notificaciones
│   └── pagination.ts                # PaginatedResponse<T>
│
├── api/                             # Una función por endpoint del backend
│   ├── client.ts                    # apiClient(): fetch centralizado con auth header
│   ├── authApi.ts                   # login()
│   ├── productsApi.ts               # getProducts(), createProduct(), adjustStock()...
│   ├── customersApi.ts              # getCustomers(), createCustomer()...
│   ├── salesApi.ts                  # getSales(), createSale()...
│   └── inventoryApi.ts              # receiveInstances(), getInstanceBySN(), updateInstanceStatus()...
│                                    # ⚠️ Stubs activos — endpoints pendientes de confirmar con backend
│
├── hooks/                           # Estado + lógica, consumen la capa API
│   ├── useProducts.ts               # CRUD productos + categorías
│   ├── useCustomers.ts              # CRUD clientes
│   ├── useSales.ts                  # Ventas + historial
│   └── useInventory.ts              # Inventario serializado (SN, estados, trazabilidad)
│
├── data/
│   └── paymentMethods.ts            # Métodos de pago disponibles (datos estáticos)
│
└── components/
    ├── LoginPage.tsx                # Formulario de login
    ├── Dashboard.tsx                # Contenedor principal del panel
    │
    └── dashboard/
        ├── Sidebar.tsx              # Navegación lateral
        ├── VenderView.tsx           # Módulo POS completo
        ├── ProductosView.tsx        # Gestión de productos
        ├── InventarioView.tsx       # Inventario serializado (SN)
        ├── ClientesView.tsx         # Gestión de clientes
        └── ProductCard.tsx          # Tarjeta de producto con flip 3D
```

---

## Módulos del Sistema

### Autenticación — `AuthContext.tsx`

- Usa `useContext` para exponer `user`, `token`, `isAuthenticated`, `login()`, `logout()`
- La sesión se guarda en `localStorage` bajo la clave `venderapp_session`
- `App.tsx` consume el contexto: si `isAuthenticated` → muestra Dashboard, si no → LoginPage

```typescript
const { user, login, logout, isAuthenticated } = useAuth()
```

---

### Dashboard — `Dashboard.tsx`

Contenedor que recibe el `user` del contexto y controla la vista activa:

```
vender | productos | inventario | clientes
```

---

### Sidebar — `Sidebar.tsx`

Navegación lateral con 4 ítems:

| Ícono | Vista | Descripción |
|---|---|---|
| 🏷️ | vender | Módulo POS |
| 📦 | productos | Gestión de inventario |
| 🔢 | inventario | Serialización y trazabilidad |
| 👤 | clientes | Gestión de clientes |

---

### VenderView — Módulo POS

El componente más complejo. Implementa el punto de venta completo:

**Búsqueda y filtros:**
- Campo de búsqueda por nombre o código de barras
- Al presionar `Enter` con un código exacto → agrega el producto al carrito automáticamente (compatible con pistola lectora HID)
- Dropdown de categorías con íconos SVG personalizados
- Panel de filtros técnicos por categoría (chips multi-select)

**Grid de productos:**
- Tarjetas con animación CSS flip 3D
- Cara trasera: imagen del producto + borde animado
- Cara delantera: categoría, nombre, precio, stock, botón agregar
- Modal de detalle con carrusel de imágenes

**Carrito lateral:**
- Panel deslizante desde la derecha
- Estado vacío con ilustración SVG
- Controles de cantidad por ítem
- Total calculado en tiempo real
- Confirmar venta / Vaciar carrito

---

### ProductosView — Gestión de Productos

Vista dividida en dos secciones en la misma pantalla:

**Formulario superior (3 columnas):**
- Col 1: imagen principal + galería de 4 fotos
- Col 2: nombre, marca, modelo, precio, categoría, descripción, código, costo
- Col 3: stock actual, stock mínimo, guardar/actualizar

**Tabla inferior:**
- Columnas: Código · Nombre · Marca · Modelo · Categoría · Precio · Stock · Estado · Acciones
- Badge de estado: `En stock` (verde) / `Stock bajo` (amarillo) / `Sin stock` (rojo)
- ✏️ carga el producto en el formulario para editar · 🗑 elimina

---

### InventarioView — Inventario Serializado

Módulo de trazabilidad por número de serie. Tiene 3 pestañas:

#### 📥 Recibir mercadería

Flujo de ingreso masivo al almacén:

```
1. Seleccionar producto + nombre del operario
2. Escanear SN uno por uno con la pistola (Enter por cada uno)
3. El sistema muestra ✓ SN: ABC123001 en tiempo real
4. "Finalizar recepción" → llama a receiveInstances() → backend
```

#### 🔍 Buscar por SN

Trazabilidad completa de una unidad:
- Busca por número de serie exacto
- Muestra: producto, estado actual, quién lo recibió, cuándo, a quién se vendió
- Historial completo de eventos con fecha, tipo y detalle
- Botones para cambiar estado: GARANTIA / REPARACION / DEVUELTO / OBSOLETO

#### 📋 Historial de unidades

- Resumen por producto: disponibles, vendidos, en garantía, en reparación
- Tabla filtrable por producto y estado

---

### ClientesView — Gestión de Clientes

- Buscador por nombre en tiempo real
- Lista con avatar, historial de compras y última actividad
- Panel lateral con top 3 clientes por gasto acumulado
- Modal para agregar cliente manualmente

---

## Capa de Tipos

Todos los tipos están en `src/types/` y se re-exportan desde `src/types/index.ts`.

### `auth.ts`
```typescript
interface User {
  id: number
  username: string
  email: string
  role: 'ADMIN' | 'VENDEDOR'
  isActive: boolean
  createdAt: string
}
```

### `product.ts`
```typescript
interface Product {
  id: number
  sku?: string
  name: string
  price: number
  stockCurrent: number
  stockMin: number
  categoryId?: number
  coverImageUrl?: string
  isFeatured: boolean
  isActive: boolean
  category?: Category
}
```

### `inventory.ts`
```typescript
type InstanceStatus =
  | 'DISPONIBLE' | 'VENDIDO' | 'GARANTIA'
  | 'REPARACION' | 'DEVUELTO' | 'OBSOLETO'

interface ProductInstance {
  id: number
  serialNumber: string
  productId: number
  status: InstanceStatus
  receivedAt: string
  receivedBy: string
  soldAt?: string
  soldTo?: string
  warrantyExpiresAt?: string
  history?: InstanceEvent[]
}
```

### `sale.ts`
```typescript
interface Sale {
  id: number
  subtotal: number
  descuento: number
  total: number
  status: 'COMPLETADA' | 'ANULADA' | 'PENDIENTE_PAGO'
  createdAt: string
  items?: SaleItem[]
  payments?: SalePayment[]
}
```

---

## Capa de API

### `client.ts` — Cliente HTTP centralizado

Todas las llamadas pasan por `apiClient()`:
- Agrega automáticamente el header `Authorization: Bearer <token>`
- Maneja errores HTTP y los convierte en excepciones con el mensaje del backend
- Construye query strings desde objetos de parámetros

```typescript
// Uso interno en los archivos de API
const data = await apiClient<Product[]>('/api/products', {
  method: 'GET',
  params: { categoryId: 1, isActive: true }
})
```

### Archivos de API disponibles

| Archivo | Endpoints cubiertos |
|---|---|
| `authApi.ts` | `POST /api/auth/login` |
| `productsApi.ts` | `GET/POST/PUT/DELETE /api/products`, `GET /api/categories`, `PATCH /api/products/:id/stock` |
| `customersApi.ts` | `GET/POST/PUT/DELETE /api/customers` |
| `salesApi.ts` | `GET/POST /api/sales` |
| `inventoryApi.ts` | ⚠️ Stubs — endpoints pendientes de confirmar |

### `inventoryApi.ts` — Estado actual

Las funciones están implementadas como **stubs** que simulan la respuesta del backend. Cuando el backend confirme los endpoints, solo hay que:

1. Descomentar la línea `import { apiClient } from './client'`
2. Reemplazar el stub por la llamada real
3. Borrar el `console.warn`

```typescript
// ANTES (stub):
export async function receiveInstances(payload) {
  console.warn('[inventoryApi] stub')
  return { created: payload.serialNumbers.length, skipped: 0, instances: [...] }
}

// DESPUÉS (conectado):
export async function receiveInstances(payload) {
  return apiClient('/api/inventory/receive', { method: 'POST', body: payload })
}
```

**Endpoints propuestos** (pendiente confirmación con backend):

| Función | Método | Ruta propuesta |
|---|---|---|
| `receiveInstances()` | POST | `/api/inventory/receive` |
| `getInstanceBySN()` | GET | `/api/inventory/instances/by-sn/:sn` |
| `getInstances()` | GET | `/api/inventory/instances` |
| `updateInstanceStatus()` | PATCH | `/api/inventory/instances/:id/status` |
| `validateSNForSale()` | GET | `/api/inventory/instances/validate/:sn` |
| `markInstanceAsSold()` | PATCH | `/api/inventory/instances/:id/sell` |

---

## Capa de Hooks

Los hooks encapsulan el estado y la lógica. Los componentes solo los consumen.

### `useProducts(params?)`
```typescript
const { products, categories, loading, error, create, update, remove } = useProducts()
```

### `useCustomers(params?)`
```typescript
const { customers, loading, error, create, update } = useCustomers()
```

### `useSales(params?)`
```typescript
const { sales, loading, error, createSale } = useSales()
```

### `useInventory()`
```typescript
const {
  instances, loading, error,
  receive,          // recepción masiva de SNs
  findBySN,         // buscar unidad por SN
  fetchInstances,   // listar con filtros
  changeStatus,     // cambiar estado de una unidad
  validateForSale,  // validar SN en el POS
  sellInstance,     // marcar como vendido
} = useInventory()
```

---

## Módulo de Inventario Serializado

### ¿Por qué serialización?

| Sin serialización | Con serialización |
|---|---|
| "Tienes 10 laptops" | "Tienes las laptops SN-001 al SN-010" |
| Cliente reclama → "¿cuál de las 10?" | Escaneas SN → ves todo el historial |
| Garantía por ticket (se pierde) | El sistema la calcula automáticamente |
| Recall del fabricante → no sabes a quién contactar | Lista automática de clientes afectados |

### Flujo completo

```
[ALMACÉN - RECEPCIÓN]
Pistola escanea SN → Enter por cada unidad
→ receiveInstances() → backend crea ProductInstance con status: DISPONIBLE
→ adjustStock() → incrementa stockCurrent del producto

[POS - VENTA]
Cajero escanea UPC del producto
→ Si requiere SN: modal pide escanear el SN de la unidad física
→ validateSNForSale() → verifica que esté DISPONIBLE
→ Al confirmar venta: markInstanceAsSold() → status: VENDIDO

[POSTVENTA - GARANTÍA]
Cliente trae el producto
→ Escanear SN → changeStatus(id, 'GARANTIA', detalle, operario)
→ Historial registra el evento con fecha y responsable

[SERVICIO TÉCNICO]
→ changeStatus(id, 'REPARACION', ...)
→ Al devolver: changeStatus(id, 'DISPONIBLE', ...)
```

### Estados y transiciones

```
DISPONIBLE ──venta──▶ VENDIDO
VENDIDO ──reclamo──▶ GARANTIA
GARANTIA ──técnico──▶ REPARACION
REPARACION ──reparado──▶ DISPONIBLE
REPARACION ──irreparable──▶ OBSOLETO
VENDIDO ──devolución──▶ DEVUELTO
DEVUELTO ──revisión──▶ DISPONIBLE | OBSOLETO
```

---

## Sistema de Filtros Técnicos

Definido en `src/data/filterConfig.ts` (datos estáticos, no requieren backend).

Cada categoría tiene:
- **`CAT_META`**: ícono, color de acento, descripción
- **`TECH_FILTERS`**: campos técnicos con opciones como chips
- **`BRANDS`**: marcas disponibles

| Categoría | Filtros técnicos |
|---|---|
| Monitores | Tamaño, Resolución, Tasa de refresco |
| Disco SSD | Capacidad, Tipo (SATA/NVMe), Formato |
| Memoria RAM | Capacidad, Tipo (DDR4/DDR5), Frecuencia |
| Placa Madre | Socket, Chipset, Factor de forma |
| Tarjetas de Video | VRAM, GPU (NVIDIA/AMD), Conector PCIe |
| Fuente de Poder | Potencia, Certificación 80+ |
| Periféricos | Tipo de conexión |

---

## Instalación

```bash
git clone https://github.com/EliasG0nzales/facturacion-frontend.git
cd facturacion-frontend
npm install
npm run dev
```

---

## Variables de Entorno

Crear un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:3000
```

Si no se define, el cliente HTTP usa `http://localhost:3000` por defecto.

---

## Estado del Proyecto

### ✅ Completado

- [x] Autenticación con JWT y contexto global
- [x] Dashboard con 4 módulos navegables
- [x] Módulo POS: búsqueda, filtros técnicos, carrito, modal de detalle
- [x] Búsqueda por código de barras (pistola lectora)
- [x] Gestión de productos con imágenes y galería
- [x] Gestión de clientes con ranking
- [x] Historial de ventas
- [x] Esqueleto completo del módulo de inventario serializado
- [x] Tipos TypeScript para serialización (`inventory.ts`)
- [x] Hook `useInventory` con todas las operaciones
- [x] Stubs en `inventoryApi.ts` listos para conectar al backend

### ⏳ Pendiente de backend

- [ ] Confirmar endpoints del módulo de inventario serializado
- [ ] Conectar `inventoryApi.ts` (descomentar `apiClient` y borrar stubs)
- [ ] Cálculo automático de garantía (`warrantyExpiresAt`)
- [ ] Validación de SN en el POS en tiempo real

---

## Roadmap

- **v1.1** — Conectar módulo de inventario al backend cuando los endpoints estén listos
- **v1.2** — Alertas de stock mínimo y recall por rango de SN
- **v1.3** — Impresión de tickets de venta con SN incluido
- **v1.4** — Reportes: ventas por período, productos más vendidos, stock crítico
- **v2.0** — Roles de usuario (ADMIN / VENDEDOR) con permisos diferenciados

---

## Colaboradores

| Usuario | Rol |
|---|---|
| [@EliasG0nzales](https://github.com/EliasG0nzales) | Frontend — UI, POS, Inventario |

---

*Proyecto en desarrollo activo — 2026*
