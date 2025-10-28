import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerativaRoutingModule } from './generativa-routing-module';
import { Formulario } from './formulario/formulario';
import { SharedModule } from '../shared/shared-module';
import { Runner } from './runner/runner';


@NgModule({
  declarations: [
    Formulario,
    Runner
  ],
  imports: [
    CommonModule,
    GenerativaRoutingModule,
    SharedModule
  ]
})
export class GenerativaModule { }
