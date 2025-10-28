import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizList} from './quiz-list/quiz-list';
import {QuizRunner} from './quiz-runner/quiz-runner';

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
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
