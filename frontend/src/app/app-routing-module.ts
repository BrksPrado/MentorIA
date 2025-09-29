import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

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
  {
    path: '',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) 
  },
  {
    path: 'home',
    loadChildren: () => import('./homepage-module/homepage-module-module').then(m => m.HomepageModuleModule),
    canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
