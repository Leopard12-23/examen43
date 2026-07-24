// ============================================================================
// Fuente "memoria": semillas importadas del código; muta arreglos JS en memoria.
// Implementa el CONTRATO completo aplicando las 5 reglas de negocio:
//   R1 producto activo y cliente existe · R2 cantidad <= disponibles
//   R3 descuento 10% desde 5 uds · R4 cancelar solo PENDIENTE->CANCELADO
//   R5 al crear descuenta stock; al cancelar lo repone.
// ============================================================================
import type { FuenteDatos } from "./contrato";
import type { Producto, Cliente, NuevoCliente, Pedido, NuevoPedido } from "../dominio";
import { SEMILLAS } from "./semillas";

const DESDE_UNIDADES = 5;
const PORCENTAJE = 10;

const redondear2 = (n: number) => Math.round(n * 100) / 100;
const clonar = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const siguienteId = (col: { id: number }[]) => col.reduce((m, r) => Math.max(m, r.id), 0) + 1;

// R3: cálculo del TOTAL con descuento. Único lugar donde se decide el descuento.
function calcularTotal(cantidad: number, precioUnitario: number) {
  const bruto = cantidad * precioUnitario;
  const descuentoAplicado = cantidad >= DESDE_UNIDADES;
  const total = descuentoAplicado ? bruto * (1 - PORCENTAJE / 100) : bruto;
  return { total: redondear2(total), descuentoAplicado };
}

// Estado mutable en memoria (copia de las semillas, para no alterar la constante).
const bd = clonar(SEMILLAS);

export const fuenteMemoria: FuenteDatos = {
  async listarProductos(): Promise<Producto[]> {
    return clonar(bd.productos);
  },

  async listarClientes(): Promise<Cliente[]> {
    return clonar(bd.clientes);
  },

  async crearCliente(datos: NuevoCliente): Promise<Cliente> {
    const nombre = (datos.nombre ?? "").trim();
    const cedula = (datos.cedula ?? "").trim();
    if (!nombre || !cedula) throw new Error("El cliente requiere nombre y cédula");
    const cliente: Cliente = { id: siguienteId(bd.clientes), nombre, cedula, telefono: (datos.telefono ?? "").trim() };
    bd.clientes.push(cliente);
    return clonar(cliente);
  },

  async listarPedidos(): Promise<Pedido[]> {
    return clonar(bd.pedidos);
  },

  async crearPedido(datos: NuevoPedido): Promise<Pedido> {
    const producto = bd.productos.find((p) => p.id === datos.productoId);
    if (!producto) throw new Error(`No existe el producto ${datos.productoId}`);   // R1
    if (!producto.activo) throw new Error(`"${producto.nombre}" está inactivo`);   // R1
    const cliente = bd.clientes.find((c) => c.id === datos.clienteId);
    if (!cliente) throw new Error(`No existe el cliente ${datos.clienteId}`);      // R1
    if (!Number.isInteger(datos.cantidad) || datos.cantidad < 1) throw new Error("La cantidad mínima es 1");
    if (datos.cantidad > producto.disponibles) throw new Error(`Solo quedan ${producto.disponibles} disponibles`); // R2

    const { total, descuentoAplicado } = calcularTotal(datos.cantidad, producto.precioUnitario); // R3
    const pedido: Pedido = {
      id: siguienteId(bd.pedidos),
      productoId: producto.id,
      clienteId: cliente.id,
      cantidad: datos.cantidad,
      total,
      descuentoAplicado,
      estado: "PENDIENTE",
    };
    producto.disponibles -= datos.cantidad; // R5 (crear descuenta)
    bd.pedidos.push(pedido);
    return clonar(pedido);
  },

  async cancelarPedido(id: number): Promise<Pedido> {
    const pedido = bd.pedidos.find((p) => p.id === id);
    if (!pedido) throw new Error(`No existe el pedido ${id}`);
    if (pedido.estado !== "PENDIENTE") throw new Error(`Solo se puede cancelar en estado PENDIENTE (actual: ${pedido.estado})`); // R4
    pedido.estado = "CANCELADO";
    const producto = bd.productos.find((p) => p.id === pedido.productoId);
    if (producto) producto.disponibles += pedido.cantidad; // R5 (cancelar repone)
    return clonar(pedido);
  },
};
