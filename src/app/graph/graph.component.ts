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
   graphData = {
            nodes: [
                { data: { id: 'a', name: 'Signup', weight: 100, colorCode: 'blue', shapeType: 'roundrectangle' } },
                { data: { id: 'b', name: 'User Profile', weight: 100, colorCode: 'magenta', shapeType: 'roundrectangle' } },
                { data: { id: 'c', name: 'Billing', weight: 100, colorCode: 'magenta', shapeType: 'roundrectangle' } },
                { data: { id: 'd', name: 'Sales', weight: 100, colorCode: 'orange', shapeType: 'roundrectangle' } },
                { data: { id: 'e', name: 'Referral', weight: 100, colorCode: 'orange', shapeType: 'roundrectangle' } },
                { data: { id: 'f', name: 'Loan', weight: 100, colorCode: 'orange', shapeType: 'roundrectangle' } },
                { data: { id: 'j', name: 'Support', weight: 100, colorCode: 'red', shapeType: 'ellipse' } },
                { data: { id: 'k', name: 'Sink Event', weight: 100, colorCode: 'green', shapeType: 'ellipse' } }
            ],
            edges: [
                { data: { source: 'a', target: 'b', colorCode: 'blue', strength: 10 } },
                { data: { source: 'b', target: 'c', colorCode: 'blue', strength: 10 } },
                { data: { source: 'c', target: 'd', colorCode: 'blue', strength: 10 } },
                { data: { source: 'c', target: 'e', colorCode: 'blue', strength: 10 } },
                { data: { source: 'c', target: 'f', colorCode: 'blue', strength: 10 } },
                { data: { source: 'e', target: 'j', colorCode: 'red', strength: 10 } },
                { data: { source: 'e', target: 'k', colorCode: 'green', strength: 10 } }
            ]
    };

    constructor(private essearch: EssearchService) {
    }
    ngOnInit(): void {
      console.log("Init");
      this.essearch.test()
      this.essearch.doSearch().then(this.tt)
        //function (val) { console.log(val);})
    }
    tt = (result:any)=>{
      console.log("In TT")
      this.graphData = result.e
      this.style = result.s
      //console.log(JSON.stringify(result))
    }
    nodeChange(event) {
        this.node_name = event;
    }

}
