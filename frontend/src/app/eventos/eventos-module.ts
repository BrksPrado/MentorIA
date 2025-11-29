import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EventosRoutingModule } from './eventos-routing-module';
import { EventosListComponent } from './eventos/eventos-list/eventos-list.component';
import { EventoFormComponent } from './eventos/evento-form/evento-form.component';
import { SharedModule } from '../shared/shared-module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    EventosListComponent,
    EventoFormComponent
  ],
  imports: [
    CommonModule,
    EventosRoutingModule,
    SharedModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatListModule,
    MatDialogModule
  ],
  providers: [DatePipe]
})
export class EventosModule { }