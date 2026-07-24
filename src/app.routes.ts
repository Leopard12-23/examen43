import { Routes } from "@angular/router";
import { ListadoComponent } from "./pantallas/listado.component";
import { CrearComponent } from "./pantallas/crear.component";

export const RUTAS: Routes = [
  { path: "", pathMatch: "full", redirectTo: "catalogo" },
  { path: "catalogo", component: ListadoComponent },
  { path: "nuevo", component: CrearComponent },
  { path: "**", redirectTo: "catalogo" },
];
