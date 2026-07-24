import { Component, Input } from "@angular/core";

// Insignia reutilizable. Recibe texto + tono por @Input; NO conoce datos ni su origen.
type Tono = "exito" | "neutro" | "aviso" | "info" | "descuento";

@Component({
  selector: "app-badge",
  standalone: true,
  template: `<span class="badge" [class]="'t-' + tono">{{ texto }}</span>`,
  styles: [`
    .badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; letter-spacing: .3px; }
    .t-exito { background: #dcfce7; color: #166534; }
    .t-neutro { background: #e2e8f0; color: #64748b; }
    .t-aviso { background: #fef9c3; color: #854d0e; }
    .t-info { background: #dbeafe; color: #1e40af; }
    .t-descuento { background: #cffafe; color: #0e7490; }
  `],
})
export class BadgeComponent {
  @Input() texto = "";
  @Input() tono: Tono = "neutro";
}
