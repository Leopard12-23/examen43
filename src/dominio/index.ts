// ============================================================================
// DOMINIO — el lenguaje de la app. NO importa nada de nadie.
// Campos derivados de las 3 pantallas del examen.
// ============================================================================

export interface Producto {
  id: number;
  nombre: string;
  precioUnitario: number;
  disponibles: number;
  activo: boolean;
}

export interface Cliente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
}

export type NuevoCliente = {
  nombre: string;
  cedula: string;
  telefono: string;
};

export type EstadoPedido = "PENDIENTE" | "ENTREGADO" | "CANCELADO";

export interface Pedido {
  id: number;
  productoId: number;
  clienteId: number;
  cantidad: number;
  total: number;
  descuentoAplicado: boolean;
  estado: EstadoPedido;
}

export type NuevoPedido = {
  productoId: number;
  clienteId: number;
  cantidad: number;
};
