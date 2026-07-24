// Fuente "api": REST contra el mock. Se implementa en un CP posterior.
import type { FuenteDatos } from "./contrato";
const pendiente = () => Promise.reject(new Error("Fuente 'api' no implementada aún (CP posterior)"));
export const fuenteApi: FuenteDatos = {
  listarProductos: pendiente,
  listarClientes: pendiente,
  crearCliente: pendiente,
  listarPedidos: pendiente,
  crearPedido: pendiente,
  cancelarPedido: pendiente,
};
