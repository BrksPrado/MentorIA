import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing-module';
import { QuizList } from './quiz-list/quiz-list';
import { QuizRunner } from './quiz-runner/quiz-runner';
import {SharedModule} from '../shared/shared-module';


@NgModule({
  declarations: [
    QuizList,
    QuizRunner
  ],
  imports: [
    CommonModule,
    QuizRoutingModule,
    
    SharedModule
  ]
})
export class QuizModule { }
