import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialogModule} from "@angular/material/dialog";
import {DialogComponent} from "./components/dialog/dialog.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IMaskModule} from "angular-imask";
import { CardComponent } from './components/card/card.component';
import { LoaderComponent } from './components/loader/loader.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";



@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    CardComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    RouterOutlet,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    IMaskModule,
  ],
  exports: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    DialogComponent,
    CardComponent,
    LoaderComponent,
  ]
})
export class SharedModule { }
