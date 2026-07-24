// Fuente "memoria": semillas importadas del código; opera en memoria.
import type { FuenteDatos } from "./contrato";
import { crearMotorMemoria } from "./motor-memoria";
import { SEMILLAS } from "./semillas";

export const fuenteMemoria: FuenteDatos = crearMotorMemoria(() => SEMILLAS);
