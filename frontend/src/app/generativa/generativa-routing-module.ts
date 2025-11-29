import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Formulario } from './formulario/formulario';
import { Runner } from './runner/runner';

const routes: Routes = [
  {
    path: '',
    component: Formulario
  },
  {
    path: 'generativa-runner',
    component: Runner
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerativaRoutingModule { }
