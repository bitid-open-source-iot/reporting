import { Input, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'point',
    styleUrls: ['./point.component.scss'],
    templateUrl: './point.component.html',
    encapsulation: ViewEncapsulation.None
})

export class PointComponent {

    @Input('date') public date: string|Date;
    @Input('value') public value: number;

    constructor() { };

}