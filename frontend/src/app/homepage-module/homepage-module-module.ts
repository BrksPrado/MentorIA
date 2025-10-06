import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageModuleRoutingModule } from './homepage-module-routing-module';
import { HomepageComponent } from './homepage-component/homepage-component';
import { SharedModule } from '../shared/shared-module';


@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    HomepageModuleRoutingModule,
    SharedModule
  ]
})
export class HomepageModuleModule { }
