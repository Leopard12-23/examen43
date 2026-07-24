// ============================================================================
// Motor en memoria: implementa el CONTRATO aplicando las 5 reglas de negocio.
// Lo comparten las fuentes "memoria" y "json"; solo cambian CÓMO cargan las
// semillas iniciales (import del código vs fetch del archivo estático).
//   R1 producto activo + cliente existe · R2 cantidad <= disponibles
//   R3 descuento 10% desde 5 uds (calcularTotal) · R4 cancelar solo PENDIENTE
//   R5 al crear descuenta stock; al cancelar lo repone.
// ============================================================================
import type { FuenteDatos } from "./contrato";
import type { Producto, Cliente, NuevoCliente, Pedido, NuevoPedido } from "../dominio";

const DESDE_UNIDADES = 5;
const PORCENTAJE = 10;

export interface Semillas {
  productos: Producto[];
  clientes: Cliente[];
  pedidos: Pedido[];
}

const redondear2 = (n: number) => Math.round(n * 100) / 100;
const clonar = <T>(x: T): T => JSON.parse(JSON.stringify(x));
const siguienteId = (col: { id: number }[]) => col.reduce((m, r) => Math.max(m, r.id), 0) + 1;

// R3: único lugar donde se calcula el total y se decide el descuento.
export function calcularTotal(cantidad: number, precioUnitario: number) {
  const bruto = cantidad * precioUnitario;
  const descuentoAplicado = cantidad >= DESDE_UNIDADES;
  const total = descuentoAplicado ? bruto * (1 - PORCENTAJE / 100) : bruto;
  return { total: redondear2(total), descuentoAplicado };
}

export function crearMotorMemoria(cargar: () => Promise<Semillas> | Semillas): FuenteDatos {
  let estado: Semillas | null = null;
  let cargando: Promise<Semillas> | null = null;

  async function bd(): Promise<Semillas> {
    if (estado) return estado;
    if (!cargando) cargando = Promise.resolve(cargar()).then((s) => (estado = clonar(s)));
    return cargando;
  }

  return {
    async listarProductos(): Promise<Producto[]> {
      return clonar((await bd()).productos);
    },
    async listarClientes(): Promise<Cliente[]> {
      return clonar((await bd()).clientes);
    },
    async crearCliente(datos: NuevoCliente): Promise<Cliente> {
      const db = await bd();
      const nombre = (datos.nombre ?? "").trim();
      const cedula = (datos.cedula ?? "").trim();
      if (!nombre || !cedula) throw new Error("El cliente requiere nombre y cédula");
      const cliente: Cliente = { id: siguienteId(db.clientes), nombre, cedula, telefono: (datos.telefono ?? "").trim() };
      db.clientes.push(cliente);
      return clonar(cliente);
    },
    async listarPedidos(): Promise<Pedido[]> {
      return clonar((await bd()).pedidos);
    },
    async crearPedido(datos: NuevoPedido): Promise<Pedido> {
      const db = await bd();
      const producto = db.productos.find((p) => p.id === datos.productoId);
      if (!producto) throw new Error(`No existe el producto ${datos.productoId}`);   // R1
      if (!producto.activo) throw new Error(`"${producto.nombre}" está inactivo`);   // R1
      const cliente = db.clientes.find((c) => c.id === datos.clienteId);
      if (!cliente) throw new Error(`No existe el cliente ${datos.clienteId}`);      // R1
      if (!Number.isInteger(datos.cantidad) || datos.cantidad < 1) throw new Error("La cantidad mínima es 1");
      if (datos.cantidad > producto.disponibles) throw new Error(`Solo quedan ${producto.disponibles} disponibles`); // R2

      const { total, descuentoAplicado } = calcularTotal(datos.cantidad, producto.precioUnitario); // R3
      const pedido: Pedido = {
        id: siguienteId(db.pedidos),
        productoId: producto.id,
        clienteId: cliente.id,
        cantidad: datos.cantidad,
        total,
        descuentoAplicado,
        estado: "PENDIENTE",
      };
      producto.disponibles -= datos.cantidad; // R5 (crear descuenta)
      db.pedidos.push(pedido);
      return clonar(pedido);
    },
    async cancelarPedido(id: number): Promise<Pedido> {
      const db = await bd();
      const pedido = db.pedidos.find((p) => p.id === id);
      if (!pedido) throw new Error(`No existe el pedido ${id}`);
      if (pedido.estado !== "PENDIENTE") throw new Error(`Solo se puede cancelar en estado PENDIENTE (actual: ${pedido.estado})`); // R4
      pedido.estado = "CANCELADO";
      const producto = db.productos.find((p) => p.id === pedido.productoId);
      if (producto) producto.disponibles += pedido.cantidad; // R5 (cancelar repone)
      return clonar(pedido);
    },
  };
}
