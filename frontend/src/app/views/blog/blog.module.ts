import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { BlogComponent } from './blog/blog.component';
import {MatMenuModule} from "@angular/material/menu";
import {SharedModule} from "../../shared/shared.module";
import {BlogRoutingModule} from "./blog-routing.module";
import { ArticleComponent } from './article/article.component';
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    BlogComponent,
    ArticleComponent
  ],
    imports: [
        CommonModule,
        MatMenuModule,
        SharedModule,
        BlogRoutingModule,
        NgOptimizedImage,
        FormsModule
    ]
})
export class BlogModule { }
