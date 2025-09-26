import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'botao',
    loadChildren: () => import('./botao-teste/botao-teste-module').then(m => m.BotaoTesteModule)
  },
  {
     path: 'auth', 
     loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
