import {Client} from 'elasticsearch'
export {initialiseNodesAndEdges, nodes, edges, style, elements, bookseller}
var clientConfig = {
  host: "http://localhost:9200/"
};

/*var client = new elasticsearch.Client(clientConfig);
var connIndex = {
  index: "estc_english_irish_scottish_freemasonry"
};*/

var defStyle = [
  {
      "selector": ".pubs",
      "style": {
          "background-color": "#de2222",
          "border-color": "#000000",
          "border-style": "solid",
          "border-width": 1,
          "shape": "ellipse",
          "label": "data(name)",
          "text-halign": "right",
          "text-valign": "center",
          "text-margin-x": 5

      }
  },
  {
      "selector": ".authors",
      "style": {
          "background-color": "#2222de",
          "border-color": "#000000",
          "border-style": "solid",
          "border-width": 1,
          "shape": "ellipse",
          "label": "data(name)",
          "text-halign": "left",
          "text-valign": "center",
          "text-margin-x": -5
      }
  },
  {
      "selector": ".seller",
      "style": {
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
      }
  },
  {
      "selector": "edge",
      "style": {
          "line-color": "#000000",
          "curve-style": "haystack"

      }
  },
  {
      "selector": ".toNotShow",
      "style": {
          "display": "none"
      }
  },
  {
      "selector": "node:selected",
      "style": {
          "background-color": "#ffff00",
          "border-color": "#000000",
          "color": "#000000"
      }

  },
  {
      "selector": ".second",
      "style": {
          "text-valign": "bottom"
      }
  }


];

var mapping;
var pub = "";
var source = ["authors"];

var style = [];
var elements = [];

var nodes = new Set();
var edges = new Set();
var edgeStyles = new Set();
var nodeStyles = new Set();

var counter = 0;

var ctrlDown = false;
var bookseller = false;

var second = false;
var document ;

var cy = cytoscape();
function setup(document)
{
  document.addEventListener('keydown', function (event) {

    if (event.keyCode === 17) {
        ctrlDown = true;

    }

  });
  document.addEventListener('keyup', function (event) {

    if (event.keyCode === 17) {
        ctrlDown = false;
        showOnlySelectedNodes(cy);

    }

  });
}



Set.prototype.increment = function (data) {

  var edgeSelector = "";
  var nodeSelector = "";

  if (typeof data === "string") {
      edgeSelector = "edge[id=\"" + data + "\"]";
  } else {
      nodeSelector = "node[id=\"" + data["id"] + "\"]";
  }

  this.forEach(function (element) {

          if (element["selector"] === edgeSelector) {
              element["style"]["width"] += 1;
          }


          if (element["selector"] === nodeSelector) {
              element["style"]["width"] += 1;
              element["style"]["height"] += 1;
          }


      }
  )
  ;
};


/*client.indices.getMapping(connIndex, function (error, response) {
  if (error) {
      console.log(error);
  } else {
      mapping = response[connIndex["index"]]["mappings"];
      var dbType;

      if (Object.keys(mapping).toString() === "xml") {
          dbType = "xml";
      } else {
          dbType = "csv";
      }
      if (Object.keys(mapping[dbType]["properties"]).indexOf("publisher") > -1) {
          pub = "publisher";
      } else {
          pub = "publication";
      }

      if (Object.keys(mapping[dbType]["properties"]).indexOf("Bookseller") > -1) {
          source.push("Bookseller");
          bookseller = true;
      }

      source.push(pub);
      doSearch();

  }
});*/

/*function doSearch() {
  client.search({
      "index": connIndex["index"],
      "scroll": "30s",
      "_source": source

  }, function getNodesAndEdges(error, response) {
      if (error) {
          console.log(error);
      }
      else {
          initialiseNodesAndEdges(response);
          counter += response.hits.hits.length;
          if (response.hits.total !== counter) {
              client.scroll({
                  scrollId: response._scroll_id,
                  scroll: "30s"
              }, getNodesAndEdges)
          } else {

              drawFullGraph();


          }
      }
  })
}
*/

function drawFullGraph() {

  configSetup();

  var bigGraphOptions = {
      "container": document.getElementById("networkDiv"),
      "elements": elements,
      "style": style,
      "boxSelectionEnabled": true,
      "minZoom": 2 / 11,
      "maxZoom": 5,
      "layout": {
          "name": "preset",
          "fit": true
      }

  };

  cy = cytoscape(bigGraphOptions);

  cy.on("select", "node", function (event) {
          if (!ctrlDown) {
              showOnlySelectedNodes(cy);
          }
      }
  );

  cy.on("click", function (event) {
      if (event.target === cy) {
          cy.elements().removeClass("toNotShow");
          getNodesInPosition(cy.elements());
      }
  });

  cy.on("mouseover", "node, edge", function (event) {
      target = event.target;
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
      target = event.target;

      if (target.isNode()) {
          target.style("label", target.data.name);
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

function showOnlySelectedNodes(cy) {

  cy.elements().removeClass("toNotShow");

  var diff = cy.collection();

  diff = diff.add(cy.$("node:selected"));
  diff = diff.add(cy.$("node:selected").connectedEdges());
  diff = diff.add(cy.$("node:selected").connectedEdges().connectedNodes().connectedEdges());
  diff = diff.add(cy.$("node:selected").connectedEdges().connectedNodes().connectedEdges().connectedNodes());


  if (diff.length > 0) {
      cy.elements().difference(diff).addClass("toNotShow");
      getNodesInPosition(diff);
      cy.fit();

  }
}

function getNodesInPosition(collection) {

  var allPubs = 0;
  var allAuth = 0;
  var allSell = 0;

  var stepPub = 0;
  var stepAuth = 0;
  var stepSell = 0;

  var startAuth = 0;
  var startPub = 0;
  var startSell = 0;

  var startPuX = 0;
  var startAuX = 0;

  var stepAuX = 0;
  var stepPuX = 0;

  var length = 0;

  for (let i = 0; i < collection.length; i++) {

      if (collection[i].isNode()) {
          if (collection[i].hasClass("pubs")) {
              allPubs++;
          } else {
              if (collection[i].hasClass("seller")) {
                  allSell++;
              } else {
                  allAuth++;
              }


          }
      }
  }


  if (allAuth > allPubs) {
      if (allAuth > allSell) {
          stepAuth = 35;
          stepPub = allAuth * 35 / allPubs;
          stepSell = allAuth * 35 / allSell;
      } else {
          stepSell = 35;
          stepAuth = allSell * 35 / allAuth;
          stepPub = allSell * 35 / allPubs;

      }
  } else {
      if (allPubs > allSell) {
          stepPub = 35;
          stepAuth = allPubs * 35 / allAuth;
          stepSell = allPubs * 35 / allSell;
      } else {
          stepSell = 35;
          stepAuth = allSell * 35 / allAuth;
          stepPub = allSell * 35 / allPubs;
      }

  }


  if (!bookseller) {
      collection.positions(function (point) {
          if (point.isNode()) {
              if (point.hasClass("pubs")) {
                  startPub += stepPub;
                  return {
                      "x": 400,
                      "y": startPub - stepPub
                  }
              } else {
                  startAuth += stepAuth;
                  return {
                      "x": -400,
                      "y": startAuth - stepAuth
                  }

              }
          }
      })
  } else {
      length = stepAuth * allAuth;

      startAuth -= stepAuth / 2;
      startPub -= stepPub / 2;

      stepAuX = (length / 2) / (length / stepAuth);
      stepPuX = (length / 2) / (length / stepPub);
      startPuX = length;

      stepSell = length / allSell;
      startSell += stepSell / 2;

      collection.positions(function (point) {
          if (point.isNode()) {
              if (point.hasClass("pubs")) {
                  startPub -= stepPub;
                  startPuX -= stepPuX;
                  return {
                      "x": startPuX + stepPuX,
                      "y": startPub + stepPub
                  }
              } else {
                  if (point.hasClass("seller")) {
                      startSell += stepSell;
                      return {
                          "x": startSell - stepSell,
                          "y": 0
                      }
                  } else {
                      startAuth -= stepAuth;
                      startAuX += stepAuX;
                      return {
                          "x": startAuX - stepAuX,
                          "y": startAuth + stepAuth
                      }
                  }

              }
          }
      })

  }
}

var initialiseNodesAndEdges = (response, pub, source, bookseller)=> {
  //console.log("Inside")
  //console.log(response, pub, source, bookseller)

  response.hits.hits.forEach(function (hit) {
          var hitDatas = hit["_source"];
         // console.log(hitDatas.hasOwnProperty("authors") && hitDatas.hasOwnProperty(pub))
         // console.log(hitDatas)
          if (hitDatas.hasOwnProperty("authors") && hitDatas.hasOwnProperty(pub)) {
         //   console.log("INSIDE")
              for (var key in hitDatas) {

                  var newNodeFull = {
                      "data": {
                          "id": "",
                          "name": ""

                      },
                      "classes": ""
                  };

                  switch (key) {
                      case "authors": {
                          newNodeFull["classes"] = "authors";
                          break;
                      }
                      case pub: {
                          newNodeFull["classes"] = "pubs";
                          break;
                      }
                      case "Bookseller" : {
                          newNodeFull["classes"] = "seller";
                          break;
                      }
                  }


                  var wholeData = deleteLastChars(hitDatas[key]);


                  newNodeFull["data"]["id"] = wholeData + key;
                  newNodeFull["data"]["name"] = wholeData;

                  if (nodes.has(JSON.stringify(newNodeFull))) {
                      nodeStyles.increment(newNodeFull["data"]);
                  }
                  else {
                      let newNodeStyle = {
                          "selector": "node[id=\"" + wholeData + key + "\"]",
                          "style": {
                              "height": 15,
                              "width": 15
                          }
                      };

                      nodes.add(JSON.stringify(newNodeFull));
                      nodeStyles.add(newNodeStyle);
                  }
                  if (deleteLastChars(hitDatas[key]).split(";").length > 1) {

                      var splittedData = deleteLastChars(hitDatas[key]).split(";");


                      for (let i = 0; i < splittedData.length; i++) {
                          var newNode = {
                              "data": {
                                  "id": "",
                                  "name": ""
                              },
                              "classes": ""
                          };

                          switch (key) {
                              case "authors": {
                                  newNode["classes"] = "authors";
                                  break;
                              }
                              case pub: {
                                  newNode["classes"] = "pubs";
                                  break;
                              }
                              case "Bookseller" : {
                                  newNode["classes"] = "seller";
                                  break;
                              }
                          }

                          var data = deleteLastChars(splittedData[i]);


                          newNode["data"]["id"] = data + key;
                          newNode["data"]["name"] = data;

                          if (nodes.has(JSON.stringify(newNode))) {
                              nodeStyles.increment(newNode["data"]);
                          }
                          else {

                              let newNodeStyle = {
                                  "selector": "node[id=\"" + data + key + "\"]",
                                  "style": {
                                      "height": 15,
                                      "width": 15
                                  }
                              };

                              nodes.add(JSON.stringify(newNode));
                              nodeStyles.add(newNodeStyle);

                          }


                      }

                  }
              }


              let edgePubArray = deleteLastChars(hitDatas[pub]).split(";");

              for (let i = 0; i < edgePubArray.length; i++) {
                  let publisher = deleteLastChars(edgePubArray[i]) + pub;


                  let edgeAuArray = deleteLastChars(hitDatas["authors"]).split(";");

                  for (let j = 0; j < edgeAuArray.length; j++) {
                      let author = deleteLastChars(edgeAuArray[j]) + "authors";

                      if (hitDatas.hasOwnProperty("Bookseller")) {

                          let edgeSellArray = deleteLastChars(hitDatas["Bookseller"]).split(";");

                          for (let k = 0; k < edgeSellArray.length; k++) {
                              let seller = deleteLastChars(edgeSellArray[k]) + "Bookseller";
                              let newEdge1 = {
                                  "data": {
                                      "id": seller + publisher,
                                      "source": seller,
                                      "target": publisher
                                  }
                              };

                              let newEdge2 = {
                                  "data": {
                                      "id": seller + author,
                                      "source": seller,
                                      "target": author
                                  }
                              };

                              if (edges.has(JSON.stringify(newEdge1))) {
                                  edgeStyles.increment(newEdge1["data"]["id"]);
                              }
                              else {
                                  let newEdgeStyle = {
                                      "selector": "edge[id=\"" + seller + publisher + "\"]",
                                      "style": {
                                          "width": 1
                                      }
                                  };
                                  edges.add(JSON.stringify(newEdge1));
                                  edgeStyles.add(newEdgeStyle);
                              }
                              if (edges.has(JSON.stringify(newEdge2))) {
                                  edgeStyles.increment(newEdge2["data"]["id"]);

                              }
                              else {
                                  let newEdgeStyle = {
                                      "selector": "edge[id=\"" + seller + author + "\"]",
                                      "style": {
                                          "width": 1
                                      }
                                  };
                                  edges.add(JSON.stringify(newEdge2));
                                  edgeStyles.add(newEdgeStyle);
                              }
                          }
                      }


                      let newEdge = {
                          "data": {
                              "id": publisher + author,
                              "source": publisher,
                              "target": author
                          }
                      };

                      if (edges.has(JSON.stringify(newEdge))) {
                          edgeStyles.increment(newEdge["data"]["id"]);

                      }
                      else {
                          let newEdgeStyle = {
                              "selector": "edge[id=\"" + publisher + author + "\"]",
                              "style": {
                                  "width": 1
                              }
                          };
                          edges.add(JSON.stringify(newEdge));
                          edgeStyles.add(newEdgeStyle);
                      }


                  }

              }

              let edgePubFull = deleteLastChars(hitDatas[pub]) + pub;
              let edgeAuFull = deleteLastChars(hitDatas["authors"]) + "authors";


              {
                  let newEdgeAuPub = {
                      "data":
                          {
                              "id": edgeAuFull + edgePubFull,
                              "source": edgeAuFull,
                              "target": edgePubFull
                          }
                  };


                  if (edges.has(JSON.stringify(newEdgeAuPub))) {
                      edgeStyles.increment(newEdgeAuPub["data"]["id"]);
                  } else {
                      let newEdgeStyle = {
                          "selector": "edge[id=\"" + edgeAuFull + edgePubFull + "\"]",
                          "style": {
                              "width": 1
                          }
                      };
                      edges.add(JSON.stringify(newEdgeAuPub));
                      edgeStyles.add(newEdgeStyle);
                  }

                  if (hitDatas.hasOwnProperty("Bookseller")) {
                      let edgeSellFull = deleteLastChars(hitDatas["Bookseller"]) + "Bookseller";
                      let newEdgeAuSell = {
                          "data":
                              {
                                  "id": edgeAuFull + edgeSellFull,
                                  "source": edgeAuFull,
                                  "target": edgeSellFull
                              }
                      };

                      let newEdgePubSell = {
                          "data":
                              {
                                  "id": edgePubFull + edgeSellFull,
                                  "source": edgePubFull,
                                  "target": edgeSellFull
                              }
                      };

                      if (edges.has(JSON.stringify(newEdgeAuSell))) {
                          edgeStyles.increment(newEdgeAuSell["data"]["id"]);
                      } else {
                          let newEdgeStyle = {
                              "selector": "edge[id=\"" + edgeAuFull + edgeSellFull + "\"]",
                              "style": {
                                  "width": 1
                              }
                          };
                          edges.add(JSON.stringify(newEdgeAuSell));
                          edgeStyles.add(newEdgeStyle);
                      }


                      if (edges.has(JSON.stringify(newEdgePubSell))) {
                          edgeStyles.increment(newEdgePubSell["data"]["id"]);
                      } else {
                          let newEdgeStyle = {
                              "selector": "edge[id=\"" + edgePubFull + edgeSellFull + "\"]",
                              "style": {
                                  "width": 1
                              }
                          };
                          edges.add(JSON.stringify(newEdgePubSell));
                          edgeStyles.add(newEdgeStyle);
                      }
                  }
              }

              {

                  if (edgePubFull.split(";").length > 1) {
                      let localEdgePubArray = hitDatas[pub].split(";");
                      for (let i = 0; i < localEdgePubArray.length; i++) {
                          let publisher = deleteLastChars(localEdgePubArray[i]) + pub;

                          let newEdge1 = {
                              "data": {
                                  "id": edgeAuFull + publisher,
                                  "source": edgeAuFull,
                                  "target": publisher
                              }
                          };

                          if (edges.has(JSON.stringify(newEdge1))) {
                              edgeStyles.increment(newEdge1["data"]["id"]);

                          }
                          else {
                              let newEdgeStyle = {
                                  "selector": "edge[id=\"" + edgeAuFull + publisher + "\"]",
                                  "style": {
                                      "width": 1
                                  }
                              };
                              edges.add(JSON.stringify(newEdge1));
                              edgeStyles.add(newEdgeStyle);
                          }

                          if (hitDatas.hasOwnProperty("Bookseller")) {
                              let newEdge2 = {
                                  "data": {
                                      "id": edgeSellFull + publisher,
                                      "source": edgeSellFull,
                                      "target": publisher
                                  }
                              };

                              if (edges.has(JSON.stringify(newEdge2))) {
                                  edgeStyles.increment(newEdge2["data"]["id"]);

                              }
                              else {
                                  let newEdgeStyle = {
                                      "selector": "edge[id=\"" + edgeSellFull + publisher + "\"]",
                                      "style": {
                                          "width": 1
                                      }
                                  };
                                  edges.add(JSON.stringify(newEdge2));
                                  edgeStyles.add(newEdgeStyle);
                              }
                          }

                      }
                  }

                  if (edgeAuFull.split(";").length > 1) {
                      localEdgeAuArray = hitDatas["authors"].split(";");
                      for (let i = 0; i < localEdgeAuArray.length; i++) {
                          let author = deleteLastChars(localEdgeAuArray[i]) + "authors";

                          let newEdge1 = {
                              "data": {
                                  "id": edgePubFull + author,
                                  "source": edgePubFull,
                                  "target": author
                              }
                          };

                          if (edges.has(JSON.stringify(newEdge1))) {
                              edgeStyles.increment(newEdge1["data"]["id"]);

                          }
                          else {
                              let newEdgeStyle = {
                                  "selector": "edge[id=\"" + edgePubFull + author + "\"]",
                                  "style": {
                                      "width": 1
                                  }
                              };
                              edges.add(JSON.stringify(newEdge1));
                              edgeStyles.add(newEdgeStyle);
                          }
                          if (hitDatas.hasOwnProperty("Booksller")) {
                              let newEdge2 = {
                                  "data": {
                                      "id": edgeSellFull + author,
                                      "source": edgeSellFull,
                                      "target": author
                                  }
                              };

                              if (edges.has(JSON.stringify(newEdge2))) {
                                  edgeStyles.increment(newEdge2["data"]["id"]);

                              }
                              else {
                                  let newEdgeStyle = {
                                      "selector": "edge[id=\"" + edgeSellFull + author + "\"]",
                                      "style": {
                                          "width": 1
                                      }
                                  };
                                  edges.add(JSON.stringify(newEdge2));
                                  edgeStyles.add(newEdgeStyle);
                              }
                          }

                      }
                  }
                  if (hitDatas.hasOwnProperty("Bookseller")) {
                      if (edgeSellFull.split(";").length > 1) {
                          localEdgeSellArray = hitDatas["Bookseller"].split(";");
                          for (let i = 0; i < localEdgeSellArray.length; i++) {
                              let seller = deleteLastChars(localEdgeSellArray[i]) + "Bookseller";

                              let newEdge1 = {
                                  "data": {
                                      "id": edgePubFull + seller,
                                      "source": edgePubFull,
                                      "target": seller
                                  }
                              };

                              let newEdge2 = {
                                  "data": {
                                      "id": edgeAuFull + seller,
                                      "source": edgeAuFull,
                                      "target": seller
                                  }
                              };

                              if (edges.has(JSON.stringify(newEdge1))) {
                                  edgeStyles.increment(newEdge1["data"]["id"]);

                              }
                              else {
                                  let newEdgeStyle = {
                                      "selector": "edge[id=\"" + edgePubFull + seller + "\"]",
                                      "style": {
                                          "width": 1
                                      }
                                  };
                                  edges.add(JSON.stringify(newEdge1));
                                  edgeStyles.add(newEdgeStyle);
                              }
                              if (edges.has(JSON.stringify(newEdge2))) {
                                  edgeStyles.increment(newEdge2["data"]["id"]);

                              }
                              else {
                                  let newEdgeStyle = {
                                      "selector": "edge[id=\"" + edgeAuFull + seller + "\"]",
                                      "style": {
                                          "width": 1
                                      }
                                  };
                                  edges.add(JSON.stringify(newEdge2));
                                  edgeStyles.add(newEdgeStyle);
                              }
                          }
                      }
                  }
              }

          }
      }
  )
  //console.log("Before configsetup")
  //console.log(elements)

  configSetup()
  //console.log(edges)

  //console.log("Finished inside")
}



function deleteLastChars(string) {
  var regexp1 = new RegExp("\\s[A-Za-z0-9ÖÜÓŐÚÉÁŰÍ][.]$");
  if (!regexp1.test(string)) {
      string = string.replace(/[^A-Za-z0-9ÖÜÓŐÚÉÁŰÍ)]*$/i, "");
  }
  return string;

}

var configSetup = () => {


  edgeStyles.forEach(function (edgeStyle) {
      style.push(edgeStyle);
  });

  nodeStyles.forEach(function (nodeStyle) {
      style.push(nodeStyle);
  });

  edges.forEach(function (edge) {
      elements.push(JSON.parse(edge));
  });

  for (let i = 0; i < defStyle.length; i++) {
      style.push(defStyle[i]);
  }

  let cy2 = cytoscape();

  nodes.forEach(function (node) {

      cy2.add(JSON.parse(node))

  });

  getNodesInPosition(cy2.elements());

  cy2.elements().forEach(function (node) {
      elements.push(node.json());
  });

  //delete cy2;

}


function getTime() {
  var date = new Date();
  var time = date.toLocaleTimeString();
  console.log(time);
}

function saveBase64AsFile() {
  var link = document.createElement("a");
  document.body.appendChild(link);

  jpg64 = cy.jpg({
      "quality": 1
  });

  link.setAttribute("href", jpg64);
  link.setAttribute("download", "network.jpeg");
  link.click();

}

function saveData() {
  var csvContent = "data:text/csv;charset=utf-8,";
  cy.elements().forEach(function (element) {
      if (element.isEdge()) {
          if (element.style("display") !== "none") {
              for (i = 0; i < element.width(); i++) {
                  csvContent += element.source().data("name") + "," + element.target().data("name") + "\n";
              }
          }
      }
  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "data.csv");
  document.body.appendChild(link);

  link.click();
}


function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          callback(xmlHttp.responseText);
  };
  xmlHttp.open("GET", theUrl, true);
  xmlHttp.send(null);
}
