import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomepageModuleRoutingModule } from './homepage-module-routing-module';
import { HomepageComponent } from './homepage-component/homepage-component';


@NgModule({
  declarations: [
    HomepageComponent
  ],
  imports: [
    CommonModule,
    HomepageModuleRoutingModule
  ]
})
export class HomepageModuleModule { }
