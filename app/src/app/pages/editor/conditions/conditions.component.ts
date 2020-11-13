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

    public style: EventEmitter<any> = new EventEmitter<any>();
    public change: EventEmitter<any> = new EventEmitter<any>();
    public columns: string[] = ['preview', 'trigger', 'options'];
    public element: HTMLElement;
    public conditions: MatTableDataSource<any> = new MatTableDataSource<any>();

    public set(data) {
        this.conditions.data = data;
        let found = false;
        this.conditions.data.map(o => {
            if (o.type == 'default') {
                found = true;
                o.active = true;
                this.style.emit(o);
            } else {
                o.active = false;
            };
        });
        if (!found && this.conditions.data.length > 0) {
            this.conditions.data[0].active = true;
            this.style.emit(this.conditions.data[0]);
        };
    };

    public reset() {};
    
    public toggle() {
        if (this.element.classList.contains('visible')) {
            this.renderer.removeClass(this.element, 'visible');
        } else {
            this.renderer.addClass(this.element, 'visible');
        };
    };

    public preview(condition) {
        this.conditions.data.map(o => {
            if (o.conditionId == condition.conditionId) {
                o.active = true;
                this.style.emit(o);
            } else {
                o.active = false;
            };
        });
    };

    ngOnInit(): void { };

    ngOnDestroy(): void { };

}