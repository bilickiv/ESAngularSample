import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { GraphComponent } from './graph/graph.component';
import { AppComponent } from './app.component';
import {NgCyto} from './ng-cyto/ng-cyto.directive';
import { EssearchService } from './essearch.service';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NgCyto,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    HttpModule
  ],
  providers: [EssearchService],
  bootstrap: [AppComponent]
})
export class AppModule { }
