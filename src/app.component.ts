import { Component } from "@angular/core";
import { RouterOutlet, RouterLink, RouterLinkActive } from "@angular/router";
import { CabeceraComponent } from "./componentes/cabecera.component";
import { FUENTE_ACTIVA } from "./datos";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CabeceraComponent],
  template: `
    <app-cabecera
      negocio="Panadería La Espiga"
      subtitulo="Sistema de pedidos"
      [fuente]="fuente"
    ></app-cabecera>

    <nav class="tabs">
      <div class="contenedor tabs-in">
        <a routerLink="/catalogo" routerLinkActive="activo">Catálogo</a>
        <a routerLink="/nuevo" routerLinkActive="activo">Nuevo pedido</a>
      </div>
    </nav>

    <main class="contenedor">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .tabs { background: #fff; border-bottom: 1px solid #e2e8f0; }
    .tabs-in { display: flex; gap: 8px; padding-top: 0; padding-bottom: 0; }
    .tabs a { padding: 14px 16px; text-decoration: none; color: #64748b; font-weight: 600; border-bottom: 3px solid transparent; }
    .tabs a.activo { color: #0e7490; border-bottom-color: #06b6d4; }
  `],
})
export class AppComponent {
  readonly fuente = FUENTE_ACTIVA;
}
