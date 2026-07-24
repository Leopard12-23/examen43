# Decisiones — CP1

- Framework: Angular 18 standalone (sin NgModules).
- Estructura: `dominio/` (tipos, sin imports), `datos/` (contrato+fábrica bloqueados, config y 3 fuentes), `componentes/` (Badge/Panel/Cabecera reutilizables), `pantallas/` (solo consumen la fábrica).
- Conmutación de fuente: `src/environments/environment.ts` → `fuenteDatos`; lo lee `configuracion.ts` (`leerFuente`). Ninguna otra línea cambia.
- Fuente activa visible en la cabecera.
- CP1: `memoria` implementa el contrato y las 5 reglas; `json` y `api` existen como stubs.
- Total y descuento (R3) se calculan en `datos.memoria.ts` (`calcularTotal`), único lugar de esa regla.
- Separación: el dominio no importa nada; los componentes reciben datos por `@Input`; las pantallas no definen tipos ni acceden a datos directamente.
