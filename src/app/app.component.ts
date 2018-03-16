import { Component, OnInit } from '@angular/core';
import { GraphComponent } from './graph/graph.component';
import { EssearchService } from './essearch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  graphData = {
    nodes: [
        {data: {id: 'j', name: 'Jerry', faveColor: '#6FB1FC', faveShape: 'triangle'}},
        {data: {id: 'e', name: 'Elaine', faveColor: '#EDA1ED', faveShape: 'ellipse'}},
        {data: {id: 'k', name: 'Kramer', faveColor: '#86B342', faveShape: 'octagon'}},
        {data: {id: 'g', name: 'George', faveColor: '#F5A45D', faveShape: 'rectangle'}}
    ],
    edges: [
        {data: {source: 'j', target: 'e', faveColor: '#6FB1FC'}},
        {data: {source: 'j', target: 'k', faveColor: '#6FB1FC'}},
        {data: {source: 'j', target: 'g', faveColor: '#6FB1FC'}},

        {data: {source: 'e', target: 'j', faveColor: '#EDA1ED'}},
        {data: {source: 'e', target: 'k', faveColor: '#EDA1ED'}},

        {data: {source: 'k', target: 'j', faveColor: '#86B342'}},
        {data: {source: 'k', target: 'e', faveColor: '#86B342'}},
        {data: {source: 'k', target: 'g', faveColor: '#86B342'}},

        {data: {source: 'g', target: 'j', faveColor: '#F5A45D'}}
    ]
};

  constructor( private essearch: EssearchService){
  }
  ngOnInit(): void {
    console.log("Init");
    this.essearch.test()
    this.essearch.doSearch().then()
      //function (val) { console.log(val);})
  }
  tt(){

  }
}
