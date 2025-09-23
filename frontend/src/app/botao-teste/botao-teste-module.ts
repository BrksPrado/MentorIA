import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BotaoTesteRoutingModule } from './botao-teste-routing-module';
import { Botao } from './botao/botao';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    Botao
  ],
  imports: [
    CommonModule,
    BotaoTesteRoutingModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class BotaoTesteModule { }
