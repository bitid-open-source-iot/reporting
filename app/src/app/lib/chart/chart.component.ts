import { Chart } from 'chart.js';
import * as moment from 'moment';
import { Input, Component, OnChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'chart',
    styleUrls: ['./chart.component.scss'],
    templateUrl: './chart.component.html'
})

export class ChartComponent implements OnChanges, AfterViewInit {

    @Input('data') private data: any[] = [];
    @Input('type') private type: string = 'bar';
    @Input('label') private label: string = '';
    @Input('color') private color: string = '#2196F3';
    @ViewChild('canvas', { 'static': true }) private canvas: ElementRef;

    constructor(private el: ElementRef) { };

    private chart: any;

    private rgba(color, alpha) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        if (result) {
            return 'rgba(' + [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16), alpha].join(', ') + ')';
        } else {
            return color;
        };
    };

    ngOnChanges(): void {
        if (this.chart) {
            this.chart.data.labels = this.data.map(item => new Date(item.date));
            this.chart.data.datasets[0].data = this.data.map(item => item.value);
            this.chart.update();
        };
    };

    ngAfterViewInit(): void {
        const values = this.data.map(o => parseFloat(o.value.toFixed(2)));
        const labels = this.data.map(o => moment(o.date).format('YYYY/MM/DD HH:mm'));
        // const labels = this.data.map(o => new Date(o.date));

        const element: HTMLCanvasElement = this.canvas.nativeElement;

        element.width = this.el.nativeElement.offsetWidth;
        element.height = this.el.nativeElement.offsetHeight;

        let data: any;
        switch(this.type) {
            case('bar'):
                data = {
                    'labels': labels,
                    'datasets': [
                        {
                            'fill': false,
                            'data': values,
                            'label': this.label,
                            'borderColor': values.map(o => this.rgba(this.color, 1)),
                            'borderWidth': 1,
                            'backgroundColor': this.rgba(this.color, 0.5)
                        }
                    ]
                }
                break;
            case('line'):
                data = {
                    'labels': labels,
                    'datasets': [
                        {
                            'data': values,
                            'label': this.label,
                            'borderColor': this.rgba(this.color, 1),
                            'borderWidth': 2,
                            'backgroundColor': 'transparent'
                        }
                    ]
                };
                break;
            case('area'):
                data = {
                    'labels': labels,
                    'datasets': [
                        {
                            'data': values,
                            'label': this.label,
                            'borderColor': this.rgba(this.color, 1),
                            'borderWidth': 2,
                            'backgroundColor': this.rgba(this.color, 0.5)
                        }
                    ]
                };
                break;
        };

        this.chart = new Chart(element.getContext('2d'), {
            'type': this.type == 'area' ? 'line' : this.type,
            'data': data,
            'options': {
                'legend': {
                    'display': false
                },
                'layout': {
                    'padding': {
                        'top': 40,
                        'left': 10,
                        'right': 10,
                        'bottom': 20
                    }
                },
                'scales': {
                    'xAxes': [
                        {
                            'display': false,
                        }
                    ],
                    'yAxes': [
                        {
                            'ticks': {
                                'beginAtZero': true
                            }
                        }
                    ]
                },
                'tooltips': {
                    'enabled': true
                }
            }
        });
    };

}