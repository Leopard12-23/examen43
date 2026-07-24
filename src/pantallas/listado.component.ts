import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PanelComponent } from "../componentes/panel.component";
import { BadgeComponent } from "../componentes/badge.component";
import type { Producto } from "../dominio";
import { obtenerFuenteDatos } from "../datos";

// Pantalla "Catálogo de productos" (01-listado.png).
// Consume SÓLO la fuente de datos; no sabe cuál está detrás.
@Component({
  selector: "app-listado",
  standalone: true,
  imports: [CommonModule, PanelComponent, BadgeComponent],
  template: `
    <app-panel titulo="Catálogo de productos">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th class="num">Precio</th>
            <th class="centro">Disponibles</th>
            <th class="centro">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of productos">
            <td>{{ p.nombre }}</td>
            <td class="num">{{ p.precioUnitario | currency: 'USD':'symbol':'1.2-2' }}</td>
            <td class="centro">{{ p.disponibles }}</td>
            <td class="centro">
              <app-badge
                [texto]="p.activo ? 'Activo' : 'Inactivo'"
                [tono]="p.activo ? 'exito' : 'neutro'"
              ></app-badge>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="error" class="error">{{ error }}</p>
    </app-panel>
  `,
})
export class ListadoComponent implements OnInit {
  private fuente = obtenerFuenteDatos();
  productos: Producto[] = [];
  error = "";

  async ngOnInit(): Promise<void> {
    try {
      this.productos = await this.fuente.listarProductos();
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
}
