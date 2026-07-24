import { Component, Input } from "@angular/core";

// Cabecera de la app. Muestra el negocio, el subtítulo y la FUENTE ACTIVA.
// Todo por @Input: no sabe de dónde salen los datos.
@Component({
  selector: "app-cabecera",
  standalone: true,
  template: `
    <header class="cab">
      <span class="titulo">{{ negocio }}</span>
      <span class="derecha">
        <span class="fuente" title="Fuente de datos activa">fuente: {{ fuente }}</span>
        <span class="sub">{{ subtitulo }}</span>
      </span>
    </header>
  `,
  styles: [`
    .cab { background: #1e293b; color: #fff; display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; }
    .titulo { font-size: 20px; font-weight: 800; }
    .derecha { display: flex; align-items: center; gap: 16px; }
    .sub { color: #94a3b8; font-size: 14px; }
    .fuente { background: #0e7490; color: #e0f2fe; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: .5px; }
  `],
})
export class CabeceraComponent {
  @Input() negocio = "";
  @Input() subtitulo = "";
  @Input() fuente = "";
}
