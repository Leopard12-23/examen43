# Decisiones — CP1

- Framework: Angular 18 standalone (sin NgModules).
- Estructura: `dominio/` (tipos, sin imports), `datos/` (contrato+fábrica bloqueados, config y 3 fuentes), `componentes/` (Badge/Panel/Cabecera reutilizables), `pantallas/` (solo consumen la fábrica).
- Conmutación de fuente: `src/environments/environment.ts` → `fuenteDatos`; lo lee `configuracion.ts` (`leerFuente`). Ninguna otra línea cambia.
- Fuente activa visible en la cabecera.
- Fuentes: `memoria` y `json` (fetch a `public/semillas.json`) comparten el motor con las 5 reglas; `api` es stub (CP3).
- Total y descuento (R3) se calculan en `motor-memoria.ts` (`calcularTotal`), único lugar de esa regla.
- Separación: el dominio no importa nada; los componentes reciben datos por `@Input`; las pantallas no definen tipos ni acceden a datos directamente.
