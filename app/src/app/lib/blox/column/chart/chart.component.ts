import { SERIES } from 'src/app/lib/utilities';
import { ObjectId } from 'src/app/id';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { Input, Component, OnChanges, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'chart',
    styleUrls: ['./chart.component.scss'],
    templateUrl: './chart.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxColumnChartComponent implements OnChanges, AfterViewInit {

    @Input('id') private id: string = ObjectId();
    @Input('font') private font: any = {};
    @Input('fill') private fill: any = {};
    @Input('stroke') private stroke: any = {};
    @Input('series') private series: SERIES[] = [];

    constructor(private el: ElementRef, private service: ReportsService) {
        this.element = this.el.nativeElement;
        this.element.id = this.id;
    };

    private element: HTMLElement;

    ngOnChanges(): void { };

    ngAfterViewInit(): void { };

}