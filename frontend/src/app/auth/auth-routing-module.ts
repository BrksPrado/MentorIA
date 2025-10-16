import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Cadastro } from './cadastro/cadastro';
import { Redefinir } from './redefinir/redefinir';

const routes: Routes = [
  {
     path: '', component: Login 
  },
  {
    path: 'login', component: Login
  },
  {
    path: 'cadastrar', component: Cadastro
  },
  {
    path: 'redefinir', component: Redefinir
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
