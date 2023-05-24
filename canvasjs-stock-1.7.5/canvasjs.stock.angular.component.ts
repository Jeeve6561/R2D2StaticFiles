/*
CanvasJS Angular StockCharts - https://canvasjs.com/
Copyright 2023 fenopix

--------------------- License Information --------------------
CanvasJS is a commercial product which requires purchase of license. Without a commercial license you can use it for evaluation purposes for upto 30 days. Please refer to the following link for further details.
https://canvasjs.com/license/

*/
/*tslint:disable*/
/*eslint-disable*/
/*jshint ignore:start*/
import { Component, AfterViewInit, OnChanges, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
declare var require: any;
var CanvasJS = require('./canvasjs.stock.min');

@Component({
  selector: 'canvasjs-stockchart',
  template: '<div id="{{stockChartContainerId}}" [ngStyle]="styles"></div>'
})

class CanvasJSStockChart implements AfterViewInit, OnChanges, OnDestroy {
	static _cjsStockChartContainerId = 0;
	stockChart: any;
	stockChartContainerId: any;
	prevStockChartOptions: any;
	shouldUpdateChart = false;

	@Input()
		options: any;
	@Input()
		styles: any;
		
	@Output()
		stockChartInstance = new EventEmitter<object>();
		
	constructor() {
		this.options = this.options ? this.options : {};
		this.styles = this.styles ? this.styles : { width: "100%", position: "relative" };
		this.styles.height = this.options.height ? this.options.height + "px" : "400px";
		
		this.stockChartContainerId = 'canvasjs-angular-stockchart-container-' + CanvasJSStockChart._cjsStockChartContainerId++;
	}

	ngDoCheck() {
		if(this.prevStockChartOptions != this.options) {
			this.shouldUpdateChart = true;
		}
	}
	
	ngOnChanges() {		
		//Update Chart Options & Render
		if(this.shouldUpdateChart && this.stockChart) {
			this.stockChart.options = this.options;
			this.stockChart.render();
			this.shouldUpdateChart = false;
			this.prevStockChartOptions = this.options;
		}
	}
	
	ngAfterViewInit() {		
	  this.stockChart = new CanvasJS.StockChart(this.stockChartContainerId, this.options);
	  this.stockChart.render();
	  this.prevStockChartOptions = this.options;
	  this.stockChartInstance.emit(this.stockChart);
	}

	ngOnDestroy() {
		if(this.stockChart)
			this.stockChart.destroy();
	}
}

export {
	CanvasJSStockChart,
	CanvasJS
};
/*tslint:enable*/
/*eslint-enable*/
/*jshint ignore:end*/