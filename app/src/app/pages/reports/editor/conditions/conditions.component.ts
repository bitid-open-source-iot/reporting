import { MatTableDataSource } from '@angular/material/table';
import { OnInit, Component, OnDestroy, Renderer2, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'column-conditions',
    styleUrls: ['./conditions.component.scss'],
    templateUrl: './conditions.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ColumnConditionsComponent implements OnInit, OnDestroy {

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;
    };

    public style: EventEmitter<any> = new EventEmitter<any>();
    public change: EventEmitter<any> = new EventEmitter<any>();
    public columns: string[] = ['preview', 'trigger', 'options'];
    public element: HTMLElement;
    public conditions: MatTableDataSource<any> = new MatTableDataSource<any>();

    ngOnInit(): void { };

    ngOnDestroy(): void { };

}