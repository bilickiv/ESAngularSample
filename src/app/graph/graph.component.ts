import {Component, Output, EventEmitter} from "@angular/core";
import { EssearchService } from '../essearch.service';
@Component({
    selector: 'cy-graph',
    templateUrl: './graph.component.html',
    styles: [`
      ng2-cytoscape {
        height: 100vh;
        float: left;
        width: 100%;
        position: relative;
    }`,],
})

export class GraphComponent {

    node_name: string;

    layout = {
      "name": "preset",
      "fit": true
  };
            style: any
   graphData = {};

    constructor(private essearch: EssearchService) {
    }
    ngOnInit(): void {
      this.essearch.test()
      this.essearch.doSearch().then(this.tt)
        //function (val) { console.log(val);})
    }
    tt = (result:any)=>{
      this.graphData = result.e
      this.style = result.s
      //console.log(JSON.stringify(result))
    }
    nodeChange(event) {
        this.node_name = event;
    }

}
