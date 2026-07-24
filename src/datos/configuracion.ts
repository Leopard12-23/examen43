// ============================================================================
// CONFIGURACIÓN DE LA CAPA DE DATOS — variante ANGULAR (única línea editable
// para conmutar de fuente: src/environments/environment.ts -> fuenteDatos).
// ============================================================================
import { environment } from "../environments/environment";

export const FUENTE_POR_DEFECTO = "memoria";
export const URL_API = "http://localhost:3000";
export const RUTA_SEMILLAS_JSON = "/semillas.json";

export function leerFuente(): string {
  return environment.fuenteDatos ?? FUENTE_POR_DEFECTO;
}
