// Semillas embebidas en el código — las consume la fuente "memoria".
// Coinciden exactamente con mock/semillas.json (estado inicial de las pantallas).
import type { Semillas } from "./motor-memoria";

export const SEMILLAS: Semillas = {
  productos: [
    { id: 1, nombre: "Pan campesino",      precioUnitario: 8.5,  disponibles: 10, activo: true  },
    { id: 2, nombre: "Torta de chocolate", precioUnitario: 6.0,  disponibles: 4,  activo: true  },
    { id: 3, nombre: "Empanada de queso",  precioUnitario: 5.0,  disponibles: 2,  activo: true  },
    { id: 4, nombre: "Torta de bodas",     precioUnitario: 15.0, disponibles: 3,  activo: false },
  ],
  clientes: [
    { id: 1, nombre: "Ana Zambrano", cedula: "1310000001", telefono: "0990000001" },
    { id: 2, nombre: "Luis Mero",    cedula: "1310000002", telefono: "0990000002" },
    { id: 3, nombre: "Carla Vera",   cedula: "1310000003", telefono: "0990000003" },
  ],
  pedidos: [
    { id: 1, productoId: 1, clienteId: 1, cantidad: 3, total: 25.5, descuentoAplicado: false, estado: "PENDIENTE" },
    { id: 2, productoId: 2, clienteId: 2, cantidad: 5, total: 27.0, descuentoAplicado: true,  estado: "ENTREGADO" },
    { id: 3, productoId: 3, clienteId: 3, cantidad: 2, total: 10.0, descuentoAplicado: false, estado: "CANCELADO" },
  ],
};
