import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import {Loading} from './loading/loading';
import { Sidebar } from './sidebar/sidebar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    Loading,
    Sidebar
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule
],
  exports: [
    Loading,
    Sidebar,
    MatSidenavModule
  ]
})
export class SharedModule { }
