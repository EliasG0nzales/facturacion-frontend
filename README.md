# 🖥️ VenderApp — Sistema de Facturación Frontend

<div align="center">

![Build](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Estado](https://img.shields.io/badge/estado-en%20desarrollo-orange?style=for-the-badge)

**Sistema integral de Punto de Venta (POS) e inventario para tienda de componentes informáticos.**

[🚀 Demo en vivo](#) · [📋 Reportar un bug](https://github.com/EliasG0nzales/facturacion-frontend/issues) · [💡 Solicitar función](https://github.com/EliasG0nzales/facturacion-frontend/issues)

</div>

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Módulos y Componentes](#-módulos-y-componentes)
   - [Sistema de Autenticación](#sistema-de-autenticación)
   - [Dashboard Principal](#dashboard-principal)
   - [Sidebar de Navegación](#sidebar-de-navegación)
   - [VenderView — Módulo POS](#venderview--módulo-pos)
   - [ProductosView — Gestión de Inventario](#productosview--gestión-de-inventario)
   - [ClientesView — Gestión de Clientes](#clientesview--gestión-de-clientes)
5. [Interfaces TypeScript](#-interfaces-typescript)
6. [Arquitectura localStorage](#-arquitectura-localstorage)
7. [Sistema de Filtros Técnicos](#-sistema-de-filtros-técnicos)
8. [Capa de Datos — mockData.ts](#-capa-de-datos--mockdatats)
9. [Instalación y Configuración](#-instalación-y-configuración)
10. [Uso y Credenciales Demo](#-uso-y-credenciales-demo)
11. [Capturas de Pantalla](#-capturas-de-pantalla)
12. [Checklist de Funcionalidades](#-checklist-de-funcionalidades)
13. [Roadmap](#-roadmap)
14. [Guía de Contribución](#-guía-de-contribución)
15. [Licencia](#-licencia)

---

## 📖 Descripción General

**VenderApp** es un sistema frontend completo de **Punto de Venta (POS)** y **gestión de inventario**, diseñado específicamente para tiendas de componentes informáticos. Permite registrar ventas, administrar productos por categoría, gestionar clientes y mantener un historial de actividad comercial — todo desde el navegador, sin dependencia de un servidor externo gracias al uso de `localStorage` como capa de persistencia.

### ¿Qué problema resuelve?

Las tiendas pequeñas y medianas de hardware informático frecuentemente carecen de herramientas de gestión accesibles y económicas. VenderApp ofrece:

- **Punto de venta visual**: carrito interactivo con tarjetas de producto animadas en 3D.
- **Gestión de inventario completa**: altas, bajas, modificaciones con imágenes y galería de fotos.
- **Filtros técnicos especializados**: propiedades como resolución de monitor, tipo de RAM, socket de placa madre, etc.
- **Gestión de clientes integrada**: historial de compras, badges de fidelidad y ranking de clientes activos.
- **Persistencia sin backend**: toda la información se guarda en `localStorage`, sin necesidad de servidor.

### Características destacadas

| Característica | Descripción |
|----------------|-------------|
| 🎴 Tarjetas 3D | Flip cards con animación CSS para cada producto |
| 🔍 Búsqueda universal | Por nombre de producto o código de barras |
| 🏷️ 10 categorías | Cada una con ícono SVG personalizado dibujado a mano |
| 🔧 Filtros técnicos | Chips de filtro específicos por categoría (resolución, RAM, socket, etc.) |
| 🛒 Carrito deslizante | Panel lateral con controles de cantidad y confirmación de venta |
| 📸 Galería de imágenes | Carrusel con miniaturas en el modal de detalle de producto |
| 👥 CRM básico | Registro automático de clientes al crear cuenta, ranking de activos |
| 💾 Sin backend | Persistencia 100% en `localStorage` |

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Rol |
|------------|---------|-----|
| [React](https://react.dev/) | 19 | Librería principal de UI |
| [TypeScript](https://www.typescriptlang.org/) | 6 | Tipado estático |
| [Vite](https://vitejs.dev/) | 8 | Bundler y servidor de desarrollo |
| CSS puro | — | Estilos (sin librerías externas) |
| localStorage | — | Persistencia de datos en el cliente |
| FileReader API | — | Carga de imágenes en base64 |
| SVG inline | — | Íconos de categorías dibujados a mano |

> **Nota:** No se utiliza ninguna librería de componentes externos (Material UI, Ant Design, Chakra, etc.). Todo el diseño y los componentes están construidos desde cero con CSS puro, lo que hace que el bundle final sea extremadamente liviano.

---

## 📁 Estructura del Proyecto

```
facturacion-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── App.tsx                    # Router principal: login / register / recover / dashboard
│   ├── App.css                    # Estilos globales (1000+ líneas)
│   ├── index.css                  # Reset base
│   ├── main.tsx                   # Punto de entrada de la aplicación
│   ├── types.ts                   # Interfaces TypeScript: User, Product, Client
│   │
│   ├── data/
│   │   ├── mockData.ts            # Capa de persistencia con localStorage
│   │   └── filterConfig.ts        # Configuración de filtros técnicos por categoría
│   │
│   └── components/
│       ├── LoginPage.tsx          # Formulario de login con persistencia de sesión
│       ├── RegisterPage.tsx       # Registro que crea User + Client simultáneamente
│       ├── RecoverPage.tsx        # Simulación de recuperación de contraseña por email
│       ├── Dashboard.tsx          # Contenedor principal del panel de control
│       │
│       └── dashboard/
│           ├── Sidebar.tsx        # Barra lateral de navegación izquierda
│           ├── VenderView.tsx     # Módulo POS de ventas (componente más complejo)
│           ├── ProductosView.tsx  # Gestión de productos: formulario + tabla
│           ├── ClientesView.tsx   # Gestión de clientes con ranking
│           └── ProductCard.tsx    # Tarjeta individual de producto con flip 3D
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

### Descripción de archivos clave

| Archivo | Descripción |
|---------|-------------|
| `App.tsx` | Controla el estado global de vista (`login`, `register`, `recover`, `dashboard`) y la sesión del usuario |
| `types.ts` | Define las tres interfaces principales: `User`, `Product` y `Client` |
| `App.css` | Más de 1000 líneas de CSS, incluyendo variables de color, animaciones, layout de dashboard, tarjetas flip y modales |
| `mockData.ts` | Funciones genéricas de lectura/escritura en `localStorage`, datos de ejemplo y lista de categorías |
| `filterConfig.ts` | Metadatos por categoría (color, ícono, descripción) y definición de filtros técnicos con opciones |

---

## 🧩 Módulos y Componentes

### Sistema de Autenticación

El sistema de autenticación está completamente basado en `localStorage`. No existe comunicación con ningún servidor externo.

#### `LoginPage.tsx`

- Formulario con campos `email` y `password`.
- Al iniciar sesión, busca el usuario en `venderapp_users` de `localStorage`.
- Si las credenciales son correctas, guarda el objeto `User` en `venderapp_session`.
- Al recargar la página, `App.tsx` detecta la sesión guardada y muestra el Dashboard directamente.
- Enlace a `RegisterPage` y `RecoverPage`.

#### `RegisterPage.tsx`

- Formulario con campos: nombre, email y contraseña.
- Al registrarse, crea **dos registros simultáneos**:
  1. Un objeto `User` → guardado en `venderapp_users`.
  2. Un objeto `Client` con historial vacío → guardado en `venderapp_clients`.
- Esto garantiza que el nuevo usuario aparezca automáticamente en la lista de clientes de `ClientesView`.

#### `RecoverPage.tsx`

- Simula el flujo de recuperación de contraseña por email.
- Muestra un mensaje de confirmación indicando que se ha enviado un enlace al correo ingresado.
- No realiza ninguna acción real (simulación de UI/UX).

#### Flujo de autenticación

```
┌──────────────┐    email/pass OK    ┌───────────────────┐
│  LoginPage   │ ─────────────────▶  │    Dashboard      │
└──────────────┘                     └───────────────────┘
       │  no cuenta                          ▲
       ▼                                     │ auto-login
┌──────────────┐    crea User+Client  ┌──────────────────┐
│ RegisterPage │ ────────────────────▶│  venderapp_      │
└──────────────┘                      │  session         │
       │  olvidé contraseña           └──────────────────┘
       ▼
┌──────────────┐
│ RecoverPage  │ (simulación)
└──────────────┘
```

---

### Dashboard Principal

#### `Dashboard.tsx`

Contenedor principal que recibe el usuario de sesión y controla qué vista del dashboard se muestra. Compone:
- `Sidebar` (navegación izquierda, siempre visible)
- `VenderView` | `ProductosView` | `ClientesView` (área de contenido principal)

El estado de vista activa (`vender`, `productos`, `clientes`) se gestiona localmente en `Dashboard.tsx` y se pasa al `Sidebar` para resaltar el ítem activo.

---

### Sidebar de Navegación

#### `Sidebar.tsx`

Barra lateral izquierda fija con tres secciones:

**Cabecera (Avatar de usuario)**
- Muestra la primera letra del nombre del usuario en un círculo de color.
- Debajo, el nombre completo del usuario.

**Navegación principal**

| Ícono | Sección | Descripción |
|-------|---------|-------------|
| 🏷️ | Vender | Abre el módulo POS |
| 📦 | Productos | Abre la gestión de inventario |
| 👤 | Clientes | Abre la gestión de clientes |

**Pie del sidebar**

| Ícono | Función |
|-------|---------|
| ❓ | Ayuda (placeholder) |
| ⚙️ | Configuración (placeholder) |
| 🚪 | Cerrar sesión: limpia `venderapp_session` y retorna al `LoginPage` |

---

### VenderView — Módulo POS

`VenderView.tsx` es el componente más extenso y complejo del proyecto. Implementa el punto de venta completo.

#### Estructura visual

```
┌─────────────────────────────────────────────────────┐ ┌──────────────┐
│  [🔍 Buscar por nombre o código...]  [Categoría ▼]  │ │   CARRITO    │
│  [🔧 Filtros]                                        │ │              │
├─────────────────────────────────────────────────────┤ │  Item 1      │
│                                                     │ │  Item 2      │
│  [Tarjeta] [Tarjeta] [Tarjeta] [Tarjeta]           │ │  ...         │
│  [Tarjeta] [Tarjeta] [Tarjeta] [Tarjeta]           │ ├──────────────┤
│                                                     │ │ Subtotal: $x │
│                                                     │ │ Total:   $x  │
│                                                     │ │[Confirmar 🛒]│
└─────────────────────────────────────────────────────┘ └──────────────┘
```

#### 1. Barra de búsqueda

- Campo de texto que filtra productos en tiempo real por **nombre** o **código de barras**.
- Al presionar `Enter` con un código que coincida exactamente con un producto, ese producto se **agrega automáticamente al carrito** — facilitando el uso con lectores de código de barras HID.

#### 2. Selector de categoría

Dropdown con las 10 categorías del sistema más la opción "Todos los Productos". Cada opción muestra un SVG personalizado dibujado inline para esa categoría.

| Categoría | Color | Descripción |
|-----------|-------|-------------|
| Monitores 🖥️ | `#3b82f6` Azul | Pantallas y displays |
| Case 🖨️ | `#6b7280` Gris | Gabinetes de PC |
| PC Completa 💻 | `#8b5cf6` Violeta | Equipos completos armados |
| Disco SSD 💾 | `#f59e0b` Ámbar | Almacenamiento sólido |
| Estabilizador 🔋 | `#10b981` Verde | Reguladores de voltaje |
| Fuente de Poder ⚡ | `#ef4444` Rojo | PSU y fuentes ATX |
| Memoria RAM 🧩 | `#06b6d4` Cian | Módulos de memoria |
| Periféricos 🖱️ | `#84cc16` Lima | Teclados, mouse, auriculares |
| Placa Madre 🔌 | `#f97316` Naranja | Motherboards |
| Tarjetas de Video 🎮 | `#a855f7` Violeta | GPUs y tarjetas gráficas |

#### 3. Sistema de filtros

Botón `🔧 Filtros` que abre un panel desplegable con **chips de selección múltiple** específicos para la categoría activa. Los filtros se describen en detalle en la sección [Sistema de Filtros Técnicos](#-sistema-de-filtros-técnicos).

#### 4. Grilla de productos — Tarjetas 3D Flip

Cada producto se renderiza como una `ProductCard` con animación **CSS 3D flip** al pasar el mouse. La tarjeta tiene dos caras:

**Cara trasera (back face)** — visible en reposo:
- Imagen de portada del producto en tamaño completo.
- Borde animado con rotación continua (`@keyframes rotateBorder`) en el color de la categoría del producto.
- Botón `🔍 Zoom` para abrir el modal de detalle.

**Cara delantera (front face)** — visible al hacer hover:
- Fondo con círculos de colores animados (efecto decorativo generativo).
- Badge de categoría con el color correspondiente.
- Nombre del producto, precio formateado, stock disponible, marca.
- Botón **"Agregar al carrito"** con icono de carrito.

#### 5. Carrito de compras

Panel lateral deslizante desde la derecha.

**Estado vacío:**
- Ilustración SVG de carrito vacío dibujada a mano.
- Texto: *"Tu Carrito está vacío."*
- Subtexto de instrucción.

**Con ítems:**
| Elemento | Descripción |
|----------|-------------|
| Imagen | Miniatura del producto |
| Nombre | Nombre completo del producto |
| Precio unitario | Precio formateado en moneda |
| Controles `−` / `+` | Modifican la cantidad; `−` con qty=1 elimina el ítem |
| Subtotal | Precio × cantidad |

**Pie del carrito:**
- Subtotal acumulado.
- Total final.
- Botón **"Confirmar Venta 🛒"** — descuenta stock, registra la venta.
- Botón **"Vaciar carrito 🗑"** — limpia todos los ítems.

#### 6. Modal de detalle de producto

Se activa con el botón 🔍 en la cara trasera de la tarjeta.

- **Carrusel de imágenes** con flechas anterior/siguiente.
- **Miniaturas (thumbnails)** de todas las imágenes de la galería.
- Nombre, marca, modelo, categoría, precio, stock.
- Tags / etiquetas del producto.
- Descripción larga.
- Botón **"Agregar al carrito"** desde el modal.

#### 7. Modal de historial de ventas

Muestra el registro de transacciones previas (en desarrollo).

---

### ProductosView — Gestión de Inventario

`ProductosView.tsx` presenta en la misma pantalla un formulario de alta/edición en la parte superior y la tabla de inventario debajo.

#### Formulario de producto — 3 columnas

**Columna 1 — Imágenes**

| Elemento | Descripción |
|----------|-------------|
| Imagen principal | Área de carga con `<input type="file">`. Convierte la imagen a base64 mediante `FileReader` y la guarda en `localStorage` |
| 4 slots de galería | Miniaturas con placeholder SVG. Al hacer clic, abre el selector de archivo para esa posición |

**Columna 2 — Datos principales**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nombre | `text` | Nombre del producto |
| Marca | `text` | Fabricante / marca |
| Modelo | `text` | Referencia de modelo |
| Precio de venta | `number` | Precio al público |
| Categoría | `select` | Lista de las 10 categorías |
| Descripción | `textarea` | Descripción larga del producto |
| Código de producto | `text` | Código único / código de barras |
| Costo | `number` | Precio de costo (para cálculo de margen) |

**Columna 3 — Stock y controles**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Stock actual | `number` | Unidades disponibles |
| Stock mínimo | `number` | Umbral para alerta de stock bajo |
| Botón Guardar/Actualizar | `button` | Cambia a "Actualizar Producto" cuando se edita |

**Barra superior del formulario**

| Control | Descripción |
|---------|-------------|
| Hint de instrucciones | *"Registre sus productos..."* |
| ⭐ Destacado | Checkbox que marca el producto como featured |
| Etiqueta | `select`: Sin etiqueta / Nuevo / Oferta / Destacado / Agotado |
| Cancelar edición | Botón visible solo en modo edición; limpia el formulario |

#### Tabla de inventario

| Columna | Descripción |
|---------|-------------|
| Código | Código de barras o ID del producto |
| Nombre | Miniatura de imagen + nombre. Estrella ★ si es featured |
| Marca | Fabricante |
| Modelo | Referencia |
| Categoría | Nombre de categoría |
| Precio | Precio de venta formateado |
| Stock | Cantidad disponible |
| Estado | Badge dinámico: `En stock` (verde) / `Stock bajo` (amarillo) / `Sin stock` (rojo) |
| Acciones | ✏️ Cargar en formulario · 🗑 Eliminar |

**Comportamiento de edición:**
- Al hacer clic en ✏️, la fila se resalta en amarillo.
- Todos los campos del formulario se completan con los datos del producto.
- El botón cambia a **"Actualizar Producto"**.
- Al guardar, se actualiza el registro en `localStorage` y la tabla se refresca.

---

### ClientesView — Gestión de Clientes

#### Estructura visual

```
┌─────────────────────────────────────┐ ┌──────────────────────────┐
│  [🔍 Buscar cliente]  [+ Cliente]  │ │  CLIENTES MÁS ACTIVOS   │
├─────────────────────────────────────┤ │                          │
│ 🤖 username  3 órdenes | S/450     │ │  1. Ana García   🥇      │
│    Último: 15/01/2025              │ │     S/1,200 · Frecuente  │
│ 🤖 username  1 orden   | S/120     │ │                          │
│    Último: 10/01/2025              │ │  2. Carlos M.    🥈      │
│ ...                                │ │     S/890 · Regular      │
└─────────────────────────────────────┘ │                          │
                                        │  3. Pedro L.    🥉      │
                                        │     S/530 · Ocasional   │
                                        └──────────────────────────┘
```

#### Lista de clientes

- Barra de búsqueda filtra por nombre en tiempo real.
- Botón **"+ Cliente"** abre un modal para agregar cliente manualmente (nombre + email).
- Cada fila muestra:
  - Avatar robot 🤖 generado por CSS.
  - Etiqueta `username`.
  - Contador de órdenes y monto total gastado.
  - Fecha de última actividad.

#### Panel "Clientes Más Activos"

Sidebar derecho fijo que muestra el **top 3 de clientes** ordenados por `totalSpent`:

| Elemento | Descripción |
|----------|-------------|
| Posición | Ícono 🥇🥈🥉 según ranking |
| Nombre | Nombre del cliente |
| Badge | Badge de fidelidad según frecuencia de compra |
| Acumulado | Total gastado formateado |
| Frecuencia | Etiqueta: Frecuente / Regular / Ocasional |
| Enlace | "Ver Actividad →" (placeholder para historial detallado) |

#### Registro automático desde Register

Cuando un usuario nuevo se registra en `RegisterPage`, se crea automáticamente un objeto `Client` con:

```typescript
{
  id: user.id,
  name: user.name,
  email: user.email,
  purchases: 0,
  totalSpent: 0,
  lastActivity: new Date().toISOString(),
  registeredAt: new Date().toISOString(),
  frequency: "Nuevo"
}
```

Esto garantiza que todos los usuarios del sistema aparezcan en la lista de clientes desde el primer día.

---

## 📐 Interfaces TypeScript

Definidas en `src/types.ts`:

### `User`

Representa a un usuario autenticado del sistema (vendedor, administrador, etc.).

```typescript
interface User {
  id: string;          // UUID o timestamp como string
  name: string;        // Nombre completo del usuario
  email: string;       // Email (usado como credencial de login)
  password: string;    // Contraseña en texto plano (⚠️ sin hashear — solo demo)
}
```

> ⚠️ **Aviso de seguridad:** Las contraseñas se guardan en texto plano en `localStorage`. Esto es aceptable para un prototipo frontend, pero **no debe usarse en producción**. Al migrar a backend, se implementará bcrypt o similar.

---

### `Product`

Representa un producto del inventario.

```typescript
interface Product {
  id: string;             // Identificador único
  name: string;           // Nombre del producto
  brand: string;          // Marca / fabricante
  model: string;          // Modelo específico
  price: number;          // Precio de venta al público
  cost: number;           // Precio de costo (para margen)
  code: string;           // Código de barras o SKU
  description: string;    // Descripción larga del producto
  stock: number;          // Unidades disponibles actualmente
  minStock: number;       // Stock mínimo antes de alerta
  sold: number;           // Unidades vendidas históricamente
  category: string;       // Una de las 10 categorías predefinidas
  label: string;          // "Sin etiqueta" | "Nuevo" | "Oferta" | "Destacado" | "Agotado"
  featured: boolean;      // Si aparece como destacado (★)
  cover?: string;         // Imagen principal en base64 (opcional)
  gallery: string[];      // Array de imágenes adicionales en base64
}
```

**Lógica de estado de stock:**

| Condición | Badge | Color |
|-----------|-------|-------|
| `stock > minStock` | En stock | 🟢 Verde |
| `0 < stock <= minStock` | Stock bajo | 🟡 Amarillo |
| `stock === 0` | Sin stock | 🔴 Rojo |

---

### `Client`

Representa un cliente del negocio, con historial de compras.

```typescript
interface Client {
  id: string;             // Mismo id que el User si se registró
  name: string;           // Nombre completo del cliente
  email: string;          // Email de contacto
  purchases: number;      // Número total de órdenes/compras
  totalSpent: number;     // Monto acumulado gastado (en moneda local)
  lastActivity: string;   // ISO date string de la última compra o actividad
  registeredAt: string;   // ISO date string del registro
  frequency: string;      // "Nuevo" | "Ocasional" | "Regular" | "Frecuente" | "VIP"
  badge?: string;         // Badge opcional de fidelidad (puede ser undefined)
}
```

**Lógica de frecuencia sugerida** (a implementar en versión completa):

| Compras | Frecuencia |
|---------|-----------|
| 0 | Nuevo |
| 1–2 | Ocasional |
| 3–5 | Regular |
| 6–10 | Frecuente |
| 11+ | VIP |

---

## 💾 Arquitectura localStorage

VenderApp utiliza `localStorage` del navegador como base de datos cliente. Toda la información persiste entre sesiones de usuario sin necesidad de un servidor.

### Claves de almacenamiento

| Clave | Tipo | Contenido |
|-------|------|-----------|
| `venderapp_users` | `User[]` | Todos los usuarios registrados |
| `venderapp_clients` | `Client[]` | Todos los clientes |
| `venderapp_products` | `Product[]` | Catálogo completo de productos |
| `venderapp_session` | `User` | Usuario actualmente autenticado |

### Formato de almacenamiento

Todos los valores se guardan como **JSON serializado** mediante `JSON.stringify` y se leen con `JSON.parse`:

```typescript
// Ejemplo: guardar productos
localStorage.setItem('venderapp_products', JSON.stringify(products));

// Ejemplo: leer productos
const raw = localStorage.getItem('venderapp_products');
const products: Product[] = raw ? JSON.parse(raw) : [];
```

### Diagrama de flujo de datos

```
┌──────────────────────────────────────────────────────────┐
│                     LOCALSTORAGE                         │
│                                                          │
│  venderapp_users    ──────▶  LoginPage, RegisterPage     │
│  venderapp_clients  ──────▶  ClientesView, RegisterPage  │
│  venderapp_products ──────▶  VenderView, ProductosView   │
│  venderapp_session  ──────▶  App.tsx (auth guard)        │
└──────────────────────────────────────────────────────────┘
         ▲                              │
         │ saveToStorage()              │ loadFromStorage()
         │                              ▼
      Componentes React ──── Estado local (useState)
```

### Consideraciones de capacidad

`localStorage` tiene un límite de ~5 MB por dominio. Dado que las imágenes se guardan en **base64** (que incrementa el tamaño en ~33%), es importante considerar:

- Una imagen de 1 MB → ~1.33 MB en base64.
- Con 4 imágenes por producto y 100 productos: ~533 MB (excede el límite).
- **Recomendación para producción:** migrar las imágenes a un almacenamiento externo (S3, Cloudinary, etc.) y guardar solo la URL en `localStorage`.

---

## 🔧 Sistema de Filtros Técnicos

Definido en `src/data/filterConfig.ts`, este sistema permite filtrar productos por propiedades técnicas específicas según su categoría.

### Arquitectura del sistema de filtros

```typescript
// Metadatos visuales por categoría
interface CatMeta {
  icon: string;         // Emoji representativo
  color: string;        // Color hex del tema
  description: string;  // Descripción de la categoría
}

// Campo de filtro individual
interface FilterField {
  key: string;          // Identificador único del filtro
  label: string;        // Etiqueta visible al usuario
  icon: string;         // Emoji o ícono del filtro
  unit?: string;        // Unidad de medida (opcional: "Hz", "GB", "W", etc.)
  options: string[];    // Opciones disponibles como chips seleccionables
}
```

### Exports del módulo

| Export | Tipo | Descripción |
|--------|------|-------------|
| `CAT_META` | `Record<string, CatMeta>` | Ícono, color y descripción por categoría |
| `TECH_FILTERS` | `Record<string, FilterField[]>` | Grupos de filtros por categoría |
| `BRANDS` | `Record<string, string[]>` | Marcas disponibles por categoría |

### Filtros por categoría

#### 🖥️ Monitores

| Filtro | Opciones |
|--------|---------|
| Tamaño | 21", 24", 27", 32", 34", 43", 49" |
| Resolución | 1080p (FHD), 1440p (QHD), 4K (UHD) |
| Tasa de refresco | 60 Hz, 75 Hz, 100 Hz, 144 Hz, 165 Hz, 240 Hz, 360 Hz |
| Tipo de panel | IPS, VA, TN, OLED |
| Conectividad | HDMI, DisplayPort, USB-C, VGA |

#### 🖨️ Case (Gabinetes)

| Filtro | Opciones |
|--------|---------|
| Factor de forma | Mini-ITX, Micro-ATX, ATX, Full Tower, EATX |
| Material | Acero, Aluminio, Vidrio templado |
| Ventilación | 1 fan, 2 fans, 3 fans, 4+ fans |
| Color | Negro, Blanco, Gris, RGB |

#### 💻 PC Completa

| Filtro | Opciones |
|--------|---------|
| Procesador | Intel Core i3, Intel Core i5, Intel Core i7, Ryzen 5, Ryzen 7, Ryzen 9 |
| RAM incluida | 8 GB, 16 GB, 32 GB, 64 GB |
| Almacenamiento | 256 GB SSD, 512 GB SSD, 1 TB SSD, 2 TB SSD |
| GPU | Integrada, GTX 1650, RTX 3060, RTX 4070, RX 6600, RX 7700 |
| Uso | Oficina, Gaming, Diseño, Workstation |

#### 💾 Disco SSD

| Filtro | Opciones |
|--------|---------|
| Capacidad | 128 GB, 256 GB, 512 GB, 1 TB, 2 TB |
| Interfaz | SATA III, NVMe PCIe 3.0, NVMe PCIe 4.0, NVMe PCIe 5.0 |
| Factor de forma | 2.5", M.2 2242, M.2 2280 |
| Velocidad de lectura | hasta 550 MB/s, hasta 3500 MB/s, hasta 5000 MB/s, hasta 7000 MB/s |

#### 🔋 Estabilizador

| Filtro | Opciones |
|--------|---------|
| Potencia | 500 VA, 750 VA, 1000 VA, 1500 VA, 2000 VA, 3000 VA |
| Tipo | Offline, Online, Interactivo |
| Número de salidas | 4, 6, 8, 10 |

#### ⚡ Fuente de Poder (PSU)

| Filtro | Opciones |
|--------|---------|
| Potencia | 450 W, 550 W, 650 W, 750 W, 850 W, 1000 W |
| Certificación 80 Plus | White, Bronze, Gold, Platinum, Titanium |
| Modularidad | No modular, Semi-modular, Totalmente modular |

#### 🧩 Memoria RAM

| Filtro | Opciones |
|--------|---------|
| Capacidad | 4 GB, 8 GB, 16 GB, 32 GB, 64 GB |
| Tipo | DDR4, DDR5 |
| Velocidad | 2400 MHz, 2666 MHz, 3200 MHz, 3600 MHz, 4800 MHz, 5200 MHz, 6000 MHz |
| Canales | 1 módulo (Single), 2 módulos (Dual), 4 módulos (Quad) |

#### 🖱️ Periféricos

| Filtro | Opciones |
|--------|---------|
| Tipo | Teclado, Mouse, Auriculares, Webcam, Mousepad, Headset |
| Conectividad | USB, USB-C, Bluetooth, Inalámbrico 2.4 GHz |
| Iluminación | Sin iluminación, RGB, ARGB |

#### 🔌 Placa Madre

| Filtro | Opciones |
|--------|---------|
| Socket | LGA 1700, AM4, AM5, LGA 1200 |
| Chipset | B450, B550, X570, B660, B760, Z790, X670, X670E |
| Factor de forma | Mini-ITX, Micro-ATX, ATX, EATX |
| Ranuras RAM | 2 ranuras, 4 ranuras |

#### 🎮 Tarjetas de Video

| Filtro | Opciones |
|--------|---------|
| Marca de GPU | NVIDIA, AMD |
| Modelo | GTX 1650, RTX 3060, RTX 3070, RTX 4070, RTX 4080, RX 6600, RX 6700, RX 7700 |
| VRAM | 4 GB, 6 GB, 8 GB, 10 GB, 12 GB, 16 GB |
| Uso recomendado | Casual, 1080p Gaming, 1440p Gaming, 4K Gaming, Diseño 3D |

### Implementación de filtros multi-select

Los filtros utilizan un sistema de selección múltiple basado en chips (badge buttons). Al seleccionar un chip:

1. Se agrega el valor al array de filtros activos para esa categoría.
2. El array de productos se filtra en tiempo real.
3. Al deseleccionar, se elimina del array.
4. Al cambiar de categoría, se limpian los filtros activos.

```typescript
// Ejemplo simplificado de lógica de filtrado
const filteredProducts = products.filter(product => {
  if (activeCategory !== "Todos" && product.category !== activeCategory) return false;
  if (searchQuery && !product.name.includes(searchQuery) && !product.code.includes(searchQuery)) return false;
  // Para cada grupo de filtros activo, verificar que el producto coincida
  return activeFilters.every(filter => productMatchesFilter(product, filter));
});
```

---

## 📦 Capa de Datos — `mockData.ts`

`src/data/mockData.ts` centraliza toda la lógica de persistencia y provee datos de ejemplo iniciales.

### Funciones genéricas

```typescript
// Carga desde localStorage con fallback a valores por defecto
function loadFromStorage<T>(key: string, defaults: T[]): T[]

// Guarda en localStorage (serializa a JSON)
function saveToStorage<T>(key: string, data: T[]): void
```

### Funciones específicas

```typescript
// Usuarios
function addUser(user: User): void
// Busca venderapp_users, agrega el nuevo usuario, persiste

// Clientes
function addClient(client: Client): void
// Busca venderapp_clients, agrega el nuevo cliente, persiste

// Productos
function addProduct(product: Product): void
// Agrega producto nuevo al catálogo

function updateProduct(updated: Product): void
// Encuentra el producto por `id`, reemplaza el objeto completo, persiste
```

### Lista de categorías

```typescript
export const categories: string[] = [
  "Todos los Productos",
  "Monitores",
  "Case",
  "PC Completa",
  "Disco SSD",
  "Estabilizador",
  "Fuente de Poder",
  "Memoria RAM",
  "Periféricos",
  "Placa Madre",
  "Tarjetas de Video"
];
```

### Datos de ejemplo (seed data)

`mockData.ts` incluye un conjunto de productos de ejemplo que se cargan la primera vez que se ejecuta la aplicación (cuando `localStorage` está vacío). Esto permite demostrar las funcionalidades del sistema inmediatamente.

---

## ⚙️ Instalación y Configuración

### Requisitos previos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js | 18.x o superior |
| npm | 9.x o superior |
| Navegador moderno | Chrome 90+, Firefox 88+, Edge 90+ |

### Pasos de instalación

**1. Clonar el repositorio**

```bash
git clone https://github.com/EliasG0nzales/facturacion-frontend.git
cd facturacion-frontend
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Iniciar el servidor de desarrollo**

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5173` (puerto por defecto de Vite).

**4. Compilar para producción**

```bash
npm run build
```

Los archivos compilados se generarán en el directorio `dist/`.

**5. Vista previa de la build de producción**

```bash
npm run preview
```

### Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compilación optimizada para producción |
| `npm run preview` | Servidor local de la build de producción |
| `npm run lint` | Análisis estático con ESLint |
| `npm run type-check` | Verificación de tipos TypeScript sin compilar |

---

## 🔑 Uso y Credenciales Demo

### Acceso con cuenta demo

Al iniciar la aplicación por primera vez, se puede usar la cuenta de demostración pre-cargada:

| Campo | Valor |
|-------|-------|
| 📧 Email | `user@demo.com` |
| 🔒 Contraseña | `123456` |

### Primeros pasos

1. **Iniciar sesión** con las credenciales demo o crear una cuenta nueva.
2. Ir a **📦 Productos** → Registrar algunos productos con imágenes y datos.
3. Ir a **🏷️ Vender** → Buscar productos, aplicar filtros, agregar al carrito.
4. **Confirmar la venta** para descontar stock automáticamente.
5. Ir a **👤 Clientes** → Ver el listado y el ranking de clientes más activos.

### Limpiar datos de prueba

Para resetear completamente la aplicación a su estado inicial, ejecutar en la consola del navegador:

```javascript
localStorage.removeItem('venderapp_users');
localStorage.removeItem('venderapp_clients');
localStorage.removeItem('venderapp_products');
localStorage.removeItem('venderapp_session');
location.reload();
```

---

## 📸 Capturas de Pantalla

> 📌 *Las capturas de pantalla se agregarán en la próxima actualización.*

| Vista | Descripción |
|-------|-------------|
| ![Login](#) | Pantalla de inicio de sesión |
| ![Dashboard - Vender](#) | Módulo POS con tarjetas 3D y carrito |
| ![Filtros técnicos](#) | Panel de filtros desplegado con chips de selección |
| ![Carrito con ítems](#) | Panel lateral del carrito con productos agregados |
| ![Modal de producto](#) | Detalle de producto con carrusel de imágenes |
| ![Gestión de productos](#) | Formulario de alta y tabla de inventario |
| ![Clientes](#) | Lista de clientes y ranking de más activos |

---

## ✅ Checklist de Funcionalidades

### Autenticación

- [x] Login con email y contraseña
- [x] Persistencia de sesión (recarga de página)
- [x] Registro de nuevo usuario
- [x] Creación automática de cliente al registrarse
- [x] Cierre de sesión
- [x] Simulación de recuperación de contraseña
- [ ] Hash de contraseñas (pendiente migración a backend)
- [ ] Roles de usuario (admin / vendedor / solo lectura)

### Módulo POS (VenderView)

- [x] Búsqueda por nombre de producto
- [x] Búsqueda por código de barras (Enter para agregar)
- [x] Filtro por categoría con ícono SVG personalizado
- [x] Filtros técnicos por categoría con chips multi-select
- [x] Tarjetas de producto con flip 3D animado
- [x] Borde animado en cara trasera de la tarjeta
- [x] Modal de detalle con carrusel de imágenes y thumbnails
- [x] Carrito lateral deslizante
- [x] Estado vacío del carrito con ilustración SVG
- [x] Controles de cantidad en el carrito (− / +)
- [x] Cálculo automático de subtotal y total
- [x] Confirmación de venta con descuento de stock
- [x] Vaciado completo del carrito
- [ ] Historial de ventas con transacciones
- [ ] Integración con lector de código de barras HID real
- [ ] Impresión de ticket/recibo en PDF

### Gestión de Productos (ProductosView)

- [x] Formulario de alta de producto en 3 columnas
- [x] Carga de imagen principal vía FileReader (base64)
- [x] Galería de hasta 4 imágenes adicionales
- [x] Todos los campos: nombre, marca, modelo, precio, costo, stock, etc.
- [x] Selector de categoría y etiqueta
- [x] Checkbox de producto destacado
- [x] Tabla de inventario con todas las columnas
- [x] Badge de estado de stock dinámico
- [x] Edición en línea (carga en formulario + resaltado de fila)
- [x] Eliminación de producto
- [x] Persistencia inmediata en localStorage
- [ ] Alertas cuando el stock baje del mínimo
- [ ] Exportar catálogo a Excel/CSV
- [ ] Importación masiva de productos

### Gestión de Clientes (ClientesView)

- [x] Lista de clientes con información resumida
- [x] Búsqueda por nombre en tiempo real
- [x] Modal para agregar cliente manualmente
- [x] Registro automático desde la pantalla de registro
- [x] Ranking "Clientes Más Activos" (top 3 por totalSpent)
- [x] Badges de fidelidad
- [ ] Historial detallado de compras por cliente
- [ ] Edición de datos de cliente
- [ ] Eliminación de cliente

### Infraestructura y datos

- [x] Persistencia completa en localStorage
- [x] Tipado estático con TypeScript en todos los componentes
- [x] Cero dependencias de UI externas
- [x] Datos de ejemplo (seed data) precargados
- [x] Filtros técnicos configurables en archivo separado
- [ ] Migración a API REST + PostgreSQL
- [ ] Tests unitarios (Jest + React Testing Library)
- [ ] Tests E2E (Playwright o Cypress)
- [ ] PWA con modo offline

---

## 🗺️ Roadmap

### Versión 1.1 — Ventas y Reportes *(Prioridad Alta)*

- [ ] **Historial de ventas**: registrar cada transacción con timestamp, productos, total y cliente.
- [ ] **Reportes básicos**: gráficas de ventas por período (semana / mes).
- [ ] **Top productos vendidos**: ranking por unidades vendidas.
- [ ] **Alertas de stock crítico**: notificación visual cuando un producto llega al mínimo.

### Versión 1.2 — Mejoras UX *(Prioridad Media)*

- [ ] **Modo oscuro / claro** con toggle.
- [ ] **Impresión de ticket**: generar PDF del comprobante de venta.
- [ ] **Exportar datos**: catálogo y clientes a Excel/CSV.
- [ ] **Búsqueda avanzada** con múltiples campos simultáneos.

### Versión 2.0 — Backend y Multi-usuario *(Prioridad Alta)*

- [ ] **API REST** con Node.js/Express o FastAPI.
- [ ] **Base de datos PostgreSQL** para persistencia real.
- [ ] **Autenticación JWT** con tokens seguros.
- [ ] **Roles de usuario**: Administrador, Vendedor, Solo lectura.
- [ ] **Multi-sucursal**: gestionar inventario por sede.

### Versión 2.1 — Integraciones *(Prioridad Baja)*

- [ ] **Integración con lector HID**: soporte real para scanner de código de barras USB/Bluetooth.
- [ ] **Integración con impresora térmica**: impresión directa de tickets.
- [ ] **PWA offline**: funcionar sin conexión con sincronización posterior.
- [ ] **Notificaciones push**: alertas de stock, ventas importantes.

### Versión 3.0 — Escala empresarial *(Futuro)*

- [ ] **Dashboard analítico** con gráficas avanzadas (ventas, márgenes, tendencias).
- [ ] **CRM completo**: historial de interacciones, notas, seguimiento de cotizaciones.
- [ ] **Gestión de compras / órdenes a proveedor**.
- [ ] **Facturación electrónica** (integración con SUNAT u organismos locales).
- [ ] **App móvil** (React Native o PWA).

---

## 🤝 Guía de Contribución

¡Las contribuciones son bienvenidas! Sigue estos pasos para contribuir al proyecto:

### Flujo de trabajo

```bash
# 1. Hacer fork del repositorio en GitHub

# 2. Clonar tu fork
git clone https://github.com/TU_USUARIO/facturacion-frontend.git
cd facturacion-frontend

# 3. Crear una rama para tu feature o corrección
git checkout -b feat/nombre-del-feature
# o para correcciones:
git checkout -b fix/descripcion-del-bug

# 4. Hacer tus cambios
# ...

# 5. Verificar el tipado
npm run type-check

# 6. Ejecutar el linter
npm run lint

# 7. Commit con mensaje descriptivo (Conventional Commits)
git add .
git commit -m "feat: agregar historial de ventas con filtro por fecha"

# 8. Push a tu fork
git push origin feat/nombre-del-feature

# 9. Abrir un Pull Request en GitHub
```

### Convenciones de commits

Seguimos el estándar [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de bug |
| `docs:` | Cambios en documentación |
| `style:` | Cambios de formato/estilo (sin lógica) |
| `refactor:` | Refactoring sin cambio de funcionalidad |
| `test:` | Agregar o modificar tests |
| `chore:` | Tareas de mantenimiento |

### Estándares de código

- **TypeScript estricto**: todos los componentes y funciones deben estar tipados.
- **Componentes funcionales**: usar React hooks, evitar componentes de clase.
- **CSS puro**: no agregar librerías de UI (TailwindCSS, MUI, etc.) sin discusión previa.
- **Nombres en español**: las variables de dominio de negocio pueden ir en español para consistencia.
- **localStorage centralizado**: no acceder a `localStorage` directamente desde los componentes — usar las funciones de `mockData.ts`.

### Reportar bugs

Usa el [issue tracker de GitHub](https://github.com/EliasG0nzales/facturacion-frontend/issues) con la plantilla de bug report, incluyendo:

1. Pasos para reproducir.
2. Comportamiento esperado.
3. Comportamiento actual.
4. Screenshots si aplica.
5. Navegador y versión.

---

## 📄 Licencia

Este proyecto está bajo la **Licencia MIT**.

```
MIT License

Copyright (c) 2025 Elias Gonzales

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

Hecho con ❤️ por [Elias Gonzales](https://github.com/EliasG0nzales)

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub

[![GitHub stars](https://img.shields.io/github/stars/EliasG0nzales/facturacion-frontend?style=social)](https://github.com/EliasG0nzales/facturacion-frontend/stargazers)

</div>