// Fuente "json": carga /semillas.json con fetch. Se implementa en un CP posterior.
import type { FuenteDatos } from "./contrato";
const pendiente = () => Promise.reject(new Error("Fuente 'json' no implementada aún (CP posterior)"));
export const fuenteJson: FuenteDatos = {
  listarProductos: pendiente,
  listarClientes: pendiente,
  crearCliente: pendiente,
  listarPedidos: pendiente,
  crearPedido: pendiente,
  cancelarPedido: pendiente,
};
