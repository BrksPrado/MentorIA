import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfiguracaoRoutingModule } from './configuracao-routing-module';
import { Configuracao } from './configuracao-component/configuracao-component';
import { SharedModule } from '../shared/shared-module';

@NgModule({
  declarations: [
    Configuracao
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    SharedModule,
    ConfiguracaoRoutingModule // ✅ módulo de rota vai aqui
  ]
})
export class ConfiguracaoModule { }
