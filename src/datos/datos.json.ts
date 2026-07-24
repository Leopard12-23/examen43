// Fuente "json": carga /semillas.json con fetch al iniciar; luego opera en memoria.
import type { FuenteDatos } from "./contrato";
import { crearMotorMemoria, type Semillas } from "./motor-memoria";
import { RUTA_SEMILLAS_JSON } from "./configuracion";

export const fuenteJson: FuenteDatos = crearMotorMemoria(async () => {
  const resp = await fetch(RUTA_SEMILLAS_JSON);
  if (!resp.ok) throw new Error(`No se pudo cargar ${RUTA_SEMILLAS_JSON} (HTTP ${resp.status})`);
  const d = await resp.json();
  return { productos: d.productos, clientes: d.clientes, pedidos: d.pedidos } as Semillas;
});
