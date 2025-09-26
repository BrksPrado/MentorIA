import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Footer } from './components/footer/footer';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';



@NgModule({
  declarations: [
    Footer
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatToolbarModule
  ],
  exports: [
    Footer
  ]
})
export class SharedModule { }
