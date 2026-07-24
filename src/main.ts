import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { AppComponent } from "./app.component";
import { RUTAS } from "./app.routes";

bootstrapApplication(AppComponent, {
  providers: [provideRouter(RUTAS)],
}).catch((e) => console.error(e));
