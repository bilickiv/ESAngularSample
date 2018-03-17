import { Component, AfterContentInit,OnInit, Inject, OnChanges, ElementRef, Input  } from '@angular/core';
import * as variable from 'cytoscape';

declare var jQuery: any;

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements AfterContentInit,OnInit, OnChanges {
  @Input() public elements: any;
  @Input() public style: any;
  @Input() public layout: any;
  @Input() public zoom: any;

  node: string;

  constructor(private el: ElementRef) {
    this.layout = this.layout ||
      {
        "name": "preset",
        "fit": true
    };


  this.zoom = this.zoom || {
      min: 2 / 11,
      max: 5
  };

  this.style = this.style || cytoscape.stylesheet()
      .selector('node')
      .css({
          'content': 'data(name)',
          'shape': 'rectangle',
          'text-valign': 'center',
          'background-color': 'data(faveColor)',
          'width': '200px',
          'height': '100px',
          'color': 'black'
      })
      .selector(':selected')
      .css({
          'border-width': 3,
          'border-color': '#333'
      })
      .selector('edge')
      .css({
          'label': 'data(label)',
          'color': 'black',
          'curve-style': 'bezier',
          'opacity': 0.666,
          'width': 'mapData(strength, 70, 100, 2, 6)',
          'target-arrow-shape': 'triangle',
          'line-color': 'data(faveColor)',
          'source-arrow-color': 'data(faveColor)',
          'target-arrow-color': 'data(faveColor)'
      })
      .selector('edge.questionable')
      .css({
          'line-style': 'dotted',
          'target-arrow-shape': 'diamond'
      })
      .selector('.faded')
      .css({
          'opacity': 0.25,
          'text-opacity': 0
      });
  }


  public ngOnChanges(): any {
    this.render();
  }
  public ngAfterContentInit(): any {
   /* const tmp = document.createElement('div');
    const el = this.el.nativeElement.cloneNode(true);
    tmp.appendChild(el);
    this.node = tmp.innerHTML;*/
  }
  ngOnInit() {
    console.log('Before cy init')
    //this.elements = this.graphData
    //this.render()
  }
  public render() {
    console.log('Before render')
    let e = jQuery(this.el.nativeElement)
    console.log('element:')
    console.log(e)
    console.log('element:')

    let g = new cytoscape({
      container: document.getElementById('cy'),
      layout: this.layout,
      minZoom: this.zoom.min,
      maxZoom: this.zoom.max,
      style: this.style,
      elements: this.elements,
    });
  console.log(g)
  console.log('After render')
}

}
