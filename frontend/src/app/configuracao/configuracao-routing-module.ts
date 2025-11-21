import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Configuracao } from './configuracao-component/configuracao-component';

const routes: Routes = [
  { path: '', component: Configuracao } // '' significa que é a rota base do módulo
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracaoRoutingModule { }
