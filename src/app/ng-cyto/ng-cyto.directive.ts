import { Component, OnChanges, Renderer, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { initialiseNodesAndEdges, nodes, edges, style, elements, bookseller, getNodesInPosition, showOnlySelectedNodes } from '../aupubnetwork'

declare var cytoscape: any;

@Component({
  selector: 'ng2-cytoscape',
  template: '<div id="cy"></div>',
  styles: [`#cy {
        height: 100%;
        width: 100%;
        position: relative;
        left: 0;
        top: 0;
    }`]
})


export class NgCyto implements OnChanges {

  @Input() public elements: any;
  @Input() public style: any;
  @Input() public layout: any;
  @Input() public zoom: any;

  @Output() select: EventEmitter<any> = new EventEmitter<any>();

  public constructor(private renderer: Renderer, private el: ElementRef) {

    this.layout = this.layout || {
      name: 'grid',
      directed: true,
      padding: 0
    };

    this.zoom = this.zoom || {
      min: 0.1,
      max: 1.5
    };

    this.style = this.style || cytoscape.stylesheet()

      .selector('.pubs')
      .css({
        "background-color": "#de2222",
        "border-color": "#000000",
        "border-style": "solid",
        "border-width": 1,
        "shape": "ellipse",
        "label": "data(name)",
        "text-halign": "right",
        "text-valign": "center",
        "text-margin-x": 5
      })
      .selector('.authors')
      .css({
        "background-color": "#2222de",
        "border-color": "#000000",
        "border-style": "solid",
        "border-width": 1,
        "shape": "ellipse",
        "label": "data(name)",
        "text-halign": "left",
        "text-valign": "center",
        "text-margin-x": -5
      })
      .selector('.seller')
      .css({
        "background-color": "#22de22",
          "border-color": "#000000",
          "border-style": "solid",
          "border-width": 1,
          "shape": "ellipse",
          "label": "data(name)",
          "text-valign": "center",
          "text-halign": "right",
          "text-rotation": 45,
          "text-margin-x": -3,
          "text-margin-y": 14
      })
      .selector('edge')
      .css({
        "line-color": "#000000",
        "curve-style": "haystack"
      })
      .selector('.toNotShow')
      .css({
        "display": "none"
      }).selector('node:selected')
      .css({
        "background-color": "#ffff00",
        "border-color": "#000000",
        "color": "#000000"
      }).selector('.second')
      .css({
        "text-valign": "bottom"
      });
  }

  public ngOnChanges(): any {
    this.render();
    //console.log(this.el.nativeElement);
  }

  public render() {
    let cy_contianer = this.renderer.selectRootElement("#cy");
    let localselect = this.select;
    let cy = cytoscape({
      container: cy_contianer,
      layout: this.layout,
      minZoom: this.zoom.min,
      maxZoom: this.zoom.max,
      style: this.style,
      elements: this.elements,
    });
    cy.on("select", "node", function (event) {

      showOnlySelectedNodes(cy);

    }
    );
    cy.on("click", function (event) {
      if (event.target === cy) {
          cy.elements().removeClass("toNotShow");
          getNodesInPosition(cy.elements());
      }
  });

  cy.on("mouseover", "node, edge", function (event) {
      let target = event.target;
      if (target.isNode()) {
          target.style("label", target.width() - 14);
          target.style("text-margin-x", 0);
          target.style("text-margin-y", 0);


          if (!target.selected()) {
              target.style("color", "white");
          }
          target.style("font-size", 10);
          target.style("text-valign", "center");
          target.style("text-halign", "center");

      } else {
          target.style("label", target.width());
      }

  });
  cy.on("mouseout", "node, edge", function (event) {
      let target = event.target;
      //console.log(target.data("name"))
      if (target.isNode()) {
          target.style("label", target.data("name"));
          target.style("color", "black");
          target.style("font-size", 16);

          if (target.hasClass("seller")) {
              target.style("text-halign", "right");
              target.style("text-margin-x", -3);
              target.style("text-margin-y", 14);
          }
          if (!target.hasClass("seller")) {
              target.style("text-valign", "center");

          }
          if (target.hasClass("authors")) {
              target.style("text-halign", "left");
              target.style("text-margin-x", -5);
          }

          if (target.hasClass("pubs")) {
              target.style("text-halign", "right");
              target.style("text-margin-x", 5);
          }


      } else {
          target.style("label", "");
      }
  })
  }

}
