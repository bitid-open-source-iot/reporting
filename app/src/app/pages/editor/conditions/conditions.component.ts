import { MatTableDataSource } from '@angular/material/table';
import { OnInit, Component, OnDestroy, Renderer2, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'conditions',
    styleUrls: ['./conditions.component.scss'],
    templateUrl: './conditions.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ConditionsComponent implements OnInit, OnDestroy {

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;
    };

    public change: EventEmitter<any> = new EventEmitter<any>();
    public columns: string[] = ['preview', 'trigger', 'options'];
    public element: HTMLElement;
    public conditions: MatTableDataSource<any> = new MatTableDataSource<any>();

    public set() {};

    public reset() {};
    
    public toggle() {
        if (this.element.classList.contains('visible')) {
            this.renderer.removeClass(this.element, 'visible');
        } else {
            this.renderer.addClass(this.element, 'visible');
        };
    };

    public preview(element) {};

    ngOnInit(): void {
        this.conditions.data = [
            {
                'type': 'default',
                'active': true
            }
        ];
    };

    ngOnDestroy(): void { };

}