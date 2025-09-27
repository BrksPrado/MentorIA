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
  ,
  // Rota padrão: carrega o módulo da homepage
  {
    path: '',
    loadChildren: () => import('./homepage-module/homepage-module-module').then(m => m.HomepageModuleModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
