import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Historico} from './historico/historico';

const routes: Routes = [
  {
    path: '',
    component: Historico
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricoRoutingModule { }
