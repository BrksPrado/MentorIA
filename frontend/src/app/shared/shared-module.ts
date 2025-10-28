import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import {Loading} from './loading/loading';
import { Sidebar } from './sidebar/sidebar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { Header } from './header/header';

@NgModule({
  declarations: [
    Loading,
    Sidebar,
    Header
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
    MatSidenavModule,
    Header
  ]
})
export class SharedModule { }
