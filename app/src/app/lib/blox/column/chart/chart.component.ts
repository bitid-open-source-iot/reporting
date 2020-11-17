import * as moment from 'moment';
import { Font } from 'src/app/interfaces/condition';
import { color } from '../../color';
import { Chart } from 'chart.js';
import { SERIES } from 'src/app/lib/utilities';
import { Input, Component, OnChanges, ViewChild, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'chart',
    styleUrls: ['./chart.component.scss'],
    templateUrl: './chart.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxColumnChartComponent implements OnChanges, AfterViewInit {

    @Input('font') private font: Font = {};
    @Input('series') private series: SERIES[] = [];
    @Input('format') private format: string = 'YYYY/MM/DD HH:mm';
    
    @ViewChild('canvas', { 'static': true }) private canvas: ElementRef;

    constructor(private el: ElementRef) { };

    private chart: any;

    ngOnChanges(): void {
        this.series.map(item => {

        });
        // if (this.chart) {
        //     if (this.type == 'bar') {
        //         this.chart.config.data.datasets[0].borderColor = this.chart.config.data.datasets[0].borderColor.map(c => color(this.chartfill.color, this.chartfill.opacity / 100));
        //         this.chart.config.data.datasets[0].backgroundColor = color(this.chartfill.color, this.chartfill.opacity / 100);
        //     } else if (this.type == 'area') {
        //         this.chart.config.data.datasets[0].borderColor = color(this.chartfill.color, this.chartfill.opacity / 100);
        //         this.chart.config.data.datasets[0].backgroundColor = 'transparent';
        //     } else if (this.type == 'line') {
        //         this.chart.config.data.datasets[0].borderColor = color(this.chartfill.color, this.chartfill.opacity / 100);
        //         this.chart.config.data.datasets[0].backgroundColor = color(this.chartfill.color, this.chartfill.opacity / 100);
        //     };
    
        //     this.chart.config.options.scales.xAxes[0].ticks.fontColor = color(this.font.color, this.font.opacity / 100);
        //     this.chart.config.options.scales.yAxes[0].ticks.fontColor = color(this.font.color, this.font.opacity / 100);
        //     this.chart.config.options.scales.xAxes[0].gridLines.color = color(this.gridlines.color, this.gridlines.opacity / 100);
        //     this.chart.config.options.scales.yAxes[0].gridLines.color = color(this.gridlines.color, this.gridlines.opacity / 100);
        //     this.chart.config.options.scales.xAxes[0].gridLines.lineWidth = this.gridlines.width
        //     this.chart.config.options.scales.yAxes[0].gridLines.lineWidth = this.gridlines.width
        //     this.chart.data.labels = this.data.map(o => o.date);
        //     this.chart.data.datasets[0].data = this.data.map(o => parseInt(o.value));
        //     this.chart.update();
        // };
    };

    ngAfterViewInit(): void {
        // const labels = this.data.map(o => o.date);
        // const values = this.data.map(o => parseFloat(o.value.toFixed(2)));

        // const element: HTMLCanvasElement = this.canvas.nativeElement;

        // element.width = this.el.nativeElement.offsetWidth;
        // element.height = this.el.nativeElement.offsetHeight;

        // let data: any;
        // switch(this.type) {
        //     case('bar'):
        //         data = {
        //             'labels': labels,
        //             'datasets': [
        //                 {
        //                     'fill': false,
        //                     'data': values,
        //                     'label': this.label,
        //                     'borderColor': values.map(o => color(this.chartfill.color, this.chartfill.opacity / 100)),
        //                     'borderWidth': 1,
        //                     'backgroundColor': color(this.chartfill.color, this.chartfill.opacity / 100)
        //                 }
        //             ]
        //         }
        //         break;
        //     case('line'):
        //         data = {
        //             'labels': labels,
        //             'datasets': [
        //                 {
        //                     'data': values,
        //                     'label': this.label,
        //                     'borderColor': color(this.chartfill.color, this.chartfill.opacity / 100),
        //                     'borderWidth': 2,
        //                     'backgroundColor': 'transparent'
        //                 }
        //             ]
        //         };
        //         break;
        //     case('area'):
        //         data = {
        //             'labels': labels,
        //             'datasets': [
        //                 {
        //                     'data': values,
        //                     'label': this.label,
        //                     'borderColor': color(this.chartfill.color, this.chartfill.opacity / 100),
        //                     'borderWidth': 2,
        //                     'backgroundColor': color(this.chartfill.color, this.chartfill.opacity / 100)
        //                 }
        //             ]
        //         };
        //         break;
        // };

        // this.chart = new Chart(element.getContext('2d'), {
        //     'type': this.type == 'area' ? 'line' : this.type,
        //     'data': data,
        //     'options': {
        //         'legend': {
        //             'display': false
        //         },
        //         'layout': {
        //             'padding': {
        //                 'top': 40,
        //                 'left': 10,
        //                 'right': 10,
        //                 'bottom': 20
        //             }
        //         },
        //         'scales': {
        //             'xAxes': [
        //                 {
        //                     'gridLines': {
        //                         'color': color(this.gridlines.color, this.gridlines.opacity / 100),
        //                         'lineWidth': this.gridlines.width
        //                     },
        //                     'ticks': {
        //                         'callback': (value) => moment(new Date(value)).format(this.format),
        //                         'fontColor': color(this.font.color, this.font.opacity / 100)
        //                     },
        //                     'display': true
        //                 }
        //             ],
        //             'yAxes': [
        //                 {
        //                     'gridLines': {
        //                         'color': color(this.gridlines.color, this.gridlines.opacity / 100),
        //                         'lineWidth': this.gridlines.width
        //                     },
        //                     'ticks': {
        //                         'fontColor': color(this.font.color, this.font.opacity / 100),
        //                         'beginAtZero': true
        //                     },
        //                     'display': true
        //                 }
        //             ]
        //         },
        //         'tooltips': {
        //             'enabled': true,
        //             'callbacks': {
        //                 label: (item) => ([this.label, ': ', item.value, ' ', this.units].join(''))
        //             }
        //         }
        //     }
        // });
    };

}