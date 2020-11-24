import { PointComponent } from './point/point.component';
import { Input, QueryList, Component, ElementRef, ContentChildren, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'series',
    styleUrls: ['./series.component.scss'],
    templateUrl: './series.component.html',
    encapsulation: ViewEncapsulation.None
})

export class SeriesComponent {

    @Input('type') public type: string;
    @Input('label') public label: string;
    @Input('color') public color: any = '#000000';
    @Input('opacity') public opacity: number = 100;

    @ContentChildren(PointComponent) public points: QueryList<PointComponent>;

    constructor(private el: ElementRef) {
        this.element = this.el.nativeElement;
    };

    public element: HTMLElement;

}