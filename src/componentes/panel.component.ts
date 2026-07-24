import { Component, Input } from "@angular/core";

// Tarjeta blanca reutilizable con título. Ignora completamente los datos.
@Component({
  selector: "app-panel",
  standalone: true,
  template: `
    <section class="panel">
      <h2>{{ titulo }}</h2>
      <ng-content></ng-content>
    </section>
  `,
  styles: [`
    .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 22px 24px; box-shadow: 0 1px 2px rgba(15,23,42,.04); }
  `],
})
export class PanelComponent {
  @Input() titulo = "";
}
