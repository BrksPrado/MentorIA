import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerativaRoutingModule } from './generativa-routing-module';
import { Formulario } from './formulario/formulario';
import { SharedModule } from '../shared/shared-module';


@NgModule({
  declarations: [
    Formulario
  ],
  imports: [
    CommonModule,
    GenerativaRoutingModule,
    SharedModule
  ]
})
export class GenerativaModule { }
