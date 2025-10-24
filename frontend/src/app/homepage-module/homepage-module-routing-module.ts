import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage-component/homepage-component';
import { Configuracao } from './configuracao/configuracao';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'configuracao', component: Configuracao }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageModuleRoutingModule { }
