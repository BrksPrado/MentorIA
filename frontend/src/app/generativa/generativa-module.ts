import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerativaRoutingModule } from './generativa-routing-module';
import { Formulario } from './formulario/formulario';


@NgModule({
  declarations: [
    Formulario
  ],
  imports: [
    CommonModule,
    GenerativaRoutingModule
  ]
})
export class GenerativaModule { }
