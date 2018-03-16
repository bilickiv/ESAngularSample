import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GraphComponent } from './graph/graph.component';

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
  _options = { headers: new HttpHeaders({ 'Content-Type': 'application/json'
  , 'Authorization': 'Basic ' + btoa("tamas" + ":" + "53yxUsbQYLRoVy6"),
  'Access-Control-Request-Headers': 'authorization, content-type', 'Origin': '*'}) };
  constructor(private http: HttpClient){
  }
  ngOnInit(): void {
    console.log("Init");
    this.http.get('http://localhost:9200/estc/_search?pretty=true&q=manualTags:W.%20Gillman*&size=500',this._options).subscribe(data => {
      console.log(data);
    });
  }
}
