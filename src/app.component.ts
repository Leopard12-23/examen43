import { Component } from "@angular/core";
import { CabeceraComponent } from "./componentes/cabecera.component";
import { ListadoComponent } from "./pantallas/listado.component";
import { FUENTE_ACTIVA } from "./datos";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CabeceraComponent, ListadoComponent],
  template: `
    <app-cabecera
      negocio="Panadería La Espiga"
      subtitulo="Sistema de pedidos"
      [fuente]="fuente"
    ></app-cabecera>
    <main class="contenedor">
      <app-listado></app-listado>
    </main>
  `,
})
export class AppComponent {
  readonly fuente = FUENTE_ACTIVA;
}
