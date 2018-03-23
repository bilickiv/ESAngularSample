import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Client } from 'elasticsearch'
import { initialiseNodesAndEdges, nodes, edges, style, elements, bookseller } from './aupubnetwork'

@Injectable()
export class EssearchService {
  clientConfig = {
    host: "http://localhost:9200/"
  };
  elements: any;
  bookseller = false
  pub: any
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
  public doSearch = async () => {
    let response: any
    await this.setIndices()
    //console.log('The source')
    //console.log(this.source)
    response = await this.client.search({
      "index": this.connIndex["index"],
      "scroll": "30s",
      "_source": this.source
    })
    this.counter += response.hits.hits.length;
    this.resultJSONarray.push(response)
    initialiseNodesAndEdges(response, this.pub, this.source, this.bookseller)

    while (response.hits.total !== this.counter) {
      response = await this.client.scroll({
        scrollId: response._scroll_id,
        scroll: "30s"
      })
      //console.log("Befere----")
      //console.log(elements)
      initialiseNodesAndEdges(response, this.pub, this.source, this.bookseller)
      //console.log("After----")
      //console.log(elements)


     // this.resultJSONarray.push(response)
      this.counter += response.hits.hits.length;
      // console.log(this.counter)
    }
    return {e:elements,s:style}
  }
  private setIndices = async () => {
    let response: any
    response = await this.client.indices.getMapping(this.connIndex)
    let mapping = response[this.connIndex["index"]]["mappings"];
   // console.log(mapping)
    let dbType;
    if (Object.keys(mapping).toString() === "xml") {
      dbType = "xml";
    } else {
      dbType = "csv";
    }
    if (Object.keys(mapping[dbType]["properties"]).indexOf("publisher") > -1) {
      this.pub = "publisher";
    } else {
      this.pub = "publication";
    }
    if (Object.keys(mapping[dbType]["properties"]).indexOf("Bookseller") > -1) {
      this.source.push("Bookseller");
      this.bookseller = true;
    }
    this.source.push(this.pub);

    console.log("From setindices")
    console.log(this.source)
  }
}
