export type TipoDocumento = 'DNI' | 'RUC' | 'CE' | 'PASAPORTE' | 'SIN_DOC'

export interface Customer {
  id: number
  nombre: string
  tipoDocumento: TipoDocumento
  nroDocumento?: string | null
  email?: string | null
  telefono?: string | null
  direccion?: string | null
  isActive: boolean
  createdAt: string
}

export interface CreateCustomerPayload {
  nombre: string
  tipoDocumento?: TipoDocumento
  nroDocumento?: string
  email?: string
  telefono?: string
  direccion?: string
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>