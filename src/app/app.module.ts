import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GraphComponent } from './graph/graph.component';
import { EssearchService } from './essearch.service';



@NgModule({
  declarations: [
    AppComponent,
    GraphComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
    ],
  providers: [EssearchService],
  bootstrap: [AppComponent]
})
export class AppModule {

}

