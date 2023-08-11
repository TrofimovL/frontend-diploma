import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EnterRoutingModule} from './enter-routing.module';
import {LoginComponent} from "./login/login.component";
import {SignupComponent} from "./singup/singup.component";
import {ReactiveFormsModule} from "@angular/forms";
import { PolicyTermsComponent } from './policy-terms/policy-terms.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    PolicyTermsComponent,
  ],
  imports: [
    CommonModule,
    EnterRoutingModule,
    ReactiveFormsModule
  ]
})
export class EnterModule {
}
