# Angular 2 Cytoscape example

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Elasticsearch server

run the follwing docker command:
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" -v $(pwd)/x.txt:/usr/share/elasticsearch/config/elasticsearch.yml -v $(pwd)/data:/usr/share/elasticsearch/data docker.elastic.co/elasticsearch/elasticsearch-oss:6.2.2

This will setup the x.txt as the config file and the local data directory as the data directory

The data directory is puplated wih ESTC_Freemasonry_English_Irish_Scottish_sellers_kulon_Openoffice

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
