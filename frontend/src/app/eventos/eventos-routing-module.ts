import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventosListComponent } from './eventos/eventos-list/eventos-list.component';
import { EventoFormComponent } from './eventos/evento-form/evento-form.component';

const routes: Routes = [
  {
    path: '',
    component: EventosListComponent
  },
  {
    path: 'novo',
    component: EventoFormComponent
  },
  {
    path: 'editar/:id',
    component: EventoFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }