import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizList} from './quiz-list/quiz-list';
import {QuizRunner} from './quiz-runner/quiz-runner';
import {AuthGuard} from '../auth/auth.guard';
import {Historico} from '../historico/historico/historico';

const routes: Routes = [
  {
    path: '',
    component: QuizList
  },
  {
    path: ':year/:area',
    component: QuizRunner
  },
  {
    path: ':year',
    component: QuizRunner
  },
  {
    path: 'historico',
    component: Historico,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
