import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Formulario } from './formulario/formulario';

const routes: Routes = [
  {
    path:'',
    component: Formulario
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerativaRoutingModule { }
