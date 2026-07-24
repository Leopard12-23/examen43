import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PanelComponent } from "../componentes/panel.component";
import type { Producto, Cliente } from "../dominio";
import { obtenerFuenteDatos } from "../datos";

// Pantalla "Nuevo pedido" (02-crear.png). Las REGLAS DE CREACIÓN se aplican en vivo.
@Component({
  selector: "app-crear",
  standalone: true,
  imports: [CommonModule, FormsModule, PanelComponent],
  template: `
    <app-panel titulo="Nuevo pedido">
      <!-- Producto: el selector SOLO ofrece los activos (R1 en vivo) -->
      <label>Producto <span class="req">*</span></label>
      <select [(ngModel)]="productoId">
        <option *ngFor="let p of productosActivos" [ngValue]="p.id">
          {{ p.nombre }} — {{ p.precioUnitario | currency: 'USD':'symbol':'1.2-2' }}
        </option>
      </select>
      <p class="pista" *ngIf="productoSel">Quedan {{ productoSel.disponibles }} disponibles</p>

      <!-- Cliente: sin cliente no se puede registrar -->
      <label>Cliente <span class="req">*</span></label>
      <div class="fila-cliente">
        <select [(ngModel)]="clienteId">
          <option [ngValue]="null" disabled>— selecciona un cliente —</option>
          <option *ngFor="let c of clientes" [ngValue]="c.id">{{ c.nombre }} — {{ c.cedula }}</option>
        </select>
        <button type="button" class="btn btn-contorno" (click)="mostrarNuevoCliente = !mostrarNuevoCliente">
          + Nuevo cliente
        </button>
      </div>

      <div class="nuevo-cliente" *ngIf="mostrarNuevoCliente">
        <input placeholder="Nombre" [(ngModel)]="ncNombre" />
        <input placeholder="Cédula" [(ngModel)]="ncCedula" />
        <input placeholder="Teléfono" [(ngModel)]="ncTelefono" />
        <button type="button" class="btn btn-primario" (click)="guardarCliente()">Guardar cliente</button>
        <p *ngIf="errorCliente" class="error">{{ errorCliente }}</p>
      </div>

      <!-- Cantidad: si supera la disponibilidad, se bloquea el registro (R2 en vivo) -->
      <label>Cantidad <span class="req">*</span></label>
      <input type="number" min="1" [(ngModel)]="cantidad" />
      <p class="error" *ngIf="excedeStock">Solo quedan {{ productoSel?.disponibles }} disponibles</p>

      <!-- Total en vivo con nota de descuento (R3) -->
      <div class="caja-total">
        <div class="grande">Total: {{ totalPrevio | currency: 'USD':'symbol':'1.2-2' }}</div>
        <div class="sub" [class.activo]="descuentoActivo">Desde 5 unidades: 10% de descuento</div>
      </div>

      <button class="btn btn-primario" (click)="registrar()" [disabled]="!puedeRegistrar">
        Registrar pedido
      </button>

      <p *ngIf="error" class="error">{{ error }}</p>
      <p *ngIf="exito" class="pista">{{ exito }}</p>
    </app-panel>
  `,
  styles: [`
    select, input { max-width: 420px; }
    .req { color: #dc2626; }
    label { display: block; font-weight: 600; font-size: 14px; margin: 14px 0 6px; }
    select, input { width: 100%; padding: 9px 11px; font-size: 15px; border: 1px solid #94a3b8; border-radius: 4px; background: #fff; }
    .pista { color: #0e7490; font-size: 13px; margin-top: 5px; }
    .fila-cliente { display: flex; gap: 12px; align-items: center; max-width: 620px; }
    .fila-cliente select { flex: 1; }
    .fila-cliente .btn { white-space: nowrap; }
    .nuevo-cliente { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 12px; max-width: 620px; }
    .nuevo-cliente input { max-width: 190px; }
    .btn { border: none; border-radius: 6px; padding: 11px 18px; font-size: 15px; font-weight: 700; cursor: pointer; }
    .btn-primario { background: #06b6d4; color: #fff; }
    .btn-primario:disabled { background: #94a3b8; cursor: not-allowed; }
    .btn-contorno { background: #fff; color: #0e7490; border: 1px solid #06b6d4; }
    .caja-total { background: #eef2f7; border-radius: 8px; padding: 16px; margin: 18px 0; max-width: 420px; }
    .caja-total .grande { font-size: 20px; font-weight: 800; }
    .caja-total .sub { color: #64748b; font-size: 13px; margin-top: 4px; }
    .caja-total .sub.activo { color: #0e7490; font-weight: 700; }
    .error { color: #dc2626; font-size: 14px; margin-top: 10px; }
  `],
})
export class CrearComponent implements OnInit {
  private fuente = obtenerFuenteDatos();
  productos: Producto[] = [];
  clientes: Cliente[] = [];

  productoId: number | null = null;
  clienteId: number | null = null;
  cantidad = 1;

  mostrarNuevoCliente = false;
  ncNombre = ""; ncCedula = ""; ncTelefono = "";
  errorCliente = "";

  error = ""; exito = "";

  async ngOnInit(): Promise<void> {
    await this.recargar();
  }

  private async recargar(): Promise<void> {
    try {
      this.productos = await this.fuente.listarProductos();
      this.clientes = await this.fuente.listarClientes();
      if (this.productoId === null && this.productosActivos.length) this.productoId = this.productosActivos[0].id;
    } catch (e) {
      this.error = (e as Error).message;
    }
  }

  // R1 en vivo: el selector solo ofrece registros activos.
  get productosActivos(): Producto[] {
    return this.productos.filter((p) => p.activo);
  }

  get productoSel(): Producto | undefined {
    return this.productos.find((p) => p.id === this.productoId);
  }

  get excedeStock(): boolean {
    const p = this.productoSel;
    return !!p && Number(this.cantidad) > p.disponibles;
  }

  get descuentoActivo(): boolean {
    return Number(this.cantidad) >= 5;
  }

  // R3 en vivo: mismo cálculo que la fuente (el definitivo lo hace crearPedido).
  get totalPrevio(): number {
    const p = this.productoSel;
    const cant = Number(this.cantidad);
    if (!p || !Number.isFinite(cant) || cant < 1) return 0;
    const bruto = cant * p.precioUnitario;
    const total = cant >= 5 ? bruto * 0.9 : bruto;
    return Math.round(total * 100) / 100;
  }

  // Sin cliente no registra; cantidad válida y dentro del stock.
  get puedeRegistrar(): boolean {
    return this.productoId !== null && this.clienteId !== null
      && Number(this.cantidad) >= 1 && !this.excedeStock;
  }

  async guardarCliente(): Promise<void> {
    this.errorCliente = "";
    try {
      const nuevo = await this.fuente.crearCliente({ nombre: this.ncNombre, cedula: this.ncCedula, telefono: this.ncTelefono });
      await this.recargar();
      this.clienteId = nuevo.id;
      this.mostrarNuevoCliente = false;
      this.ncNombre = this.ncCedula = this.ncTelefono = "";
    } catch (e) {
      this.errorCliente = (e as Error).message;
    }
  }

  async registrar(): Promise<void> {
    this.error = ""; this.exito = "";
    try {
      const pedido = await this.fuente.crearPedido({
        productoId: this.productoId!, clienteId: this.clienteId!, cantidad: Number(this.cantidad),
      });
      this.exito = `Pedido #${pedido.id} registrado por ${pedido.total.toFixed(2)}. Stock actualizado.`;
      await this.recargar(); // R5: la disponibilidad ya viene descontada de la fuente
      this.cantidad = 1;
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
}
