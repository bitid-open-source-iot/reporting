import * as CanvasJS from './canvasjs.min';
import { color } from 'src/app/lib/color';
import { SERIES } from 'src/app/lib/utilities';
import { ObjectId } from 'src/app/id';
import { interval } from 'rxjs';
import { Font, FONT } from 'src/app/utilities/font';
import { Stroke, STROKE } from 'src/app/utilities/stroke';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { Input, DoCheck, Component, OnChanges, ElementRef, AfterViewInit, ViewEncapsulation, SimpleChanges, IterableDiffers } from '@angular/core';

@Component({
    selector: 'chart',
    styleUrls: ['./chart.component.scss'],
    templateUrl: './chart.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxColumnChartComponent implements DoCheck, OnChanges, AfterViewInit {

    @Input('id') private id: string = ObjectId();
    @Input('font') private font: FONT = new Font();
    @Input('stroke') private stroke: STROKE = new Stroke();
    @Input('series') private series: SERIES[] = [];

    constructor(private el: ElementRef, private service: ReportsService, private iterableDiffers: IterableDiffers) {
        this.element = this.el.nativeElement;
        this.element.id = this.id;
        this.iterableDiffer = iterableDiffers.find([]).create(null);
    };

    private chart: CanvasJS.Chart;
    private width: number;
    private height: number;
    private element: HTMLElement;
    private iterableDiffer: any;

    ngDoCheck() {
        let changes = this.iterableDiffer.diff(this.series);
        if (changes) {
            if (typeof(this.chart) != 'undefined' && this.chart !== null) {
                this.series.map(series => {
                    let found = false;
                    this.chart.data.map(chart => {
                        if (chart.name == series.id) {
                            found = true;
                            chart.type = series.type;
                        };
                    });
                    if (!found) {
                        this.chart.data.push({
                            'name': series.id,
                            'type': series.type,
                            'dataPoints': []
                        });
                    };
                });
                this.chart.render();
            };
        };
    };

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.series) { };
    };

    ngAfterViewInit(): void {
        this.chart = new CanvasJS.Chart(this.id, {
            'data': this.series.map(series => {
                return {
                    'name': series.id,
                    'type': series.type,
                    'color': series.color,
                    'dataPoints': [
                        {
                            'x': new Date(2020, 1, 1),
                            'y': 0
                        },
                        {
                            'x': new Date(2020, 1, 2),
                            'y': 10
                        },
                        {
                            'x': new Date(2020, 1, 3),
                            'y': 22
                        },
                        {
                            'x': new Date(2020, 1, 4),
                            'y': 30
                        },
                        {
                            'x': new Date(2020, 1, 5),
                            'y': 0
                        },
                        {
                            'x': new Date(2020, 1, 6),
                            'y': 50
                        },
                        {
                            'x': new Date(2020, 1, 7),
                            'y': 10
                        }
                    ],
                    'fillOpacity': series.opacity / 100
                };
            }),
            'axisX': {
                'labelFontColor': color(this.font.color, this.font.opacity / 100),
                'valueFormatString': 'YYYY/MM/DD'
            },
            'axisY': {
                'labelFontColor': color(this.font.color, this.font.opacity / 100),
            },
            'backgroundColor': 'transparent'
        });
        
        this.chart.render();

        this.width = this.element.offsetWidth;
        this.height = this.element.offsetHeight;

        interval(10).subscribe(() => {
            if (this.width != this.element.offsetWidth) {
                this.width = this.element.offsetWidth;
                this.chart.render();
            };
            if (this.height != this.element.offsetHeight) {
                this.height = this.element.offsetHeight;
                this.chart.render();
            };
        });
    };

}