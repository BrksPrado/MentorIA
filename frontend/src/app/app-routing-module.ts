import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
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
  },
  {
    path: 'enem',
    loadChildren: () => import('./quiz/quiz-module').then(m => m.QuizModule)
  },
  {
    path: 'generativa',
    loadChildren: () => import('./generativa/generativa-module').then(m => m.GenerativaModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
