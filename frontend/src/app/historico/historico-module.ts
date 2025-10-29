import { NgModule } from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';

import { HistoricoRoutingModule } from './historico-routing-module';
import { Historico } from './historico/historico';
import {SharedModule} from '../shared/shared-module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    Historico
  ],
  imports: [
    CommonModule,
    HistoricoRoutingModule,
    SharedModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    NgClass,
    FormsModule
  ]
})
export class HistoricoModule { }
