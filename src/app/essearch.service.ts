import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client } from 'elasticsearch'
@Injectable()
export class EssearchService {
  clientConfig = {
    host: "http://localhost:9200/"
  };
  source = ["authors"];
  counter = 0;
  client = new Client(this.clientConfig);
  resultJSONarray = []
  connIndex = {
    index: "estc"
  };
  _options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
      , 'Authorization': 'Basic ' + btoa("tamas" + ":" + "53yxUsbQYLRoVy6"),
      'Access-Control-Request-Headers': 'authorization, content-type', 'Origin': '*'
    })
  };
  constructor(private http: HttpClient) { }
  test(): void {
    console.log("Init in service");
    this.http.get('http://localhost:9200/estc/_search?pretty=true&q=manualTags:W.%20Gillman*&size=500')
      .subscribe(data => {
        console.log("The data");
        console.log(data);
      });
  }
  getNodesAndEdges = (response) => {
    return new Promise((resolve, reject) => {
      console.log('HERE')
      this.resultJSONarray.push(response)
      //initialiseNodesAndEdges(response);
      //console.log(JSON.stringify(response, null, 2))
      console.log(response.hits.total)
      this.counter += response.hits.hits.length;
      if (response.hits.total !== this.counter) {
        this.client.scroll({
          scrollId: response._scroll_id,
          scroll: "30s"
        }).then(this.getNodesAndEdges, function (error) {
          reject(error.message)
          console.trace(error.message);
        })
      } else {
        resolve();
        //drawFullGraph()
      }
    });
  };

  doSearch() {
    return new Promise((resolve, reject) => {
      this.client.search({
        "index": this.connIndex["index"],
        "scroll": "30s",
        "_source": this.source
      }).then(this.getNodesAndEdges, function (error) {
        console.trace(error.message);
      }
      ).then(resolve())
    })
  }
}
