import { BloxService } from './blox.service';
import { BloxRowComponent } from './row/row.component';
import { Input, OnInit, Output, Component, QueryList, OnDestroy, OnChanges, Renderer2, ElementRef, EventEmitter, ViewEncapsulation, ContentChildren } from '@angular/core';

@Component({
    selector: 'blox',
    styleUrls: ['./blox.component.scss'],
    templateUrl: './blox.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxComponent implements OnInit, OnDestroy, OnChanges {
    
    public element: HTMLElement;

    @Input('editing') public editing: boolean;
    @Input('background') public background: string;
    
    @Output('end') public end: EventEmitter<MouseEvent|TouchEvent> = new EventEmitter<MouseEvent|TouchEvent>();
    @Output('move') public move: EventEmitter<MouseEvent|TouchEvent> = new EventEmitter<MouseEvent|TouchEvent>();
    @Output('start') public start: EventEmitter<MouseEvent|TouchEvent> = new EventEmitter<MouseEvent|TouchEvent>();
    @Output('changes') public changes: EventEmitter<any> = new EventEmitter<any>();
    @Output('resizing') public resizing: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    @ContentChildren(BloxRowComponent) public rows: QueryList<BloxRowComponent>

    constructor(private el: ElementRef, private blox: BloxService, private renderer: Renderer2) {
        this.renderer.setStyle(this.el.nativeElement, 'background', this.background);
        this.element = this.el.nativeElement;

        this.element.onmouseup = (event: MouseEvent) => this.blox.end.next(event);
        this.element.ontouchend = (event: TouchEvent) => this.blox.end.next(event);
        this.element.onmousemove = (event: MouseEvent) => this.blox.move.next(event);
        this.element.onmousedown = (event: MouseEvent) => this.blox.start.next(event);
        this.element.ontouchmove = (event: TouchEvent) => this.blox.move.next(event);
        this.element.ontouchstart = (event: TouchEvent) => this.blox.start.next(event);
    };

    private subscriptions: any = {};

    ngOnInit(): void {
        this.blox.editing.next(this.editing);

        this.subscriptions.end = this.blox.end.subscribe(event => {
            if (this.blox.selected.value && this.blox.selected.value.id && this.blox.selected.value.type) {
                this.blox.changes.next(true);
            };
        });
        
        this.subscriptions.move = this.blox.move.subscribe(event => this.move.next(event));

        this.subscriptions.start = this.blox.start.subscribe(event => this.start.next(event));

        this.subscriptions.changes = this.blox.changes.subscribe(change => {
            if (this.rows) {
                const rows = this.rows.filter(row => row.type != 'static').map(row => {
                    return {
                        'columns': row.columns.map(column => {
                            return {
                                'config': column.config,
                                'widget': column.widget,
                                'widgetId': column.widgetId,
                                'columnId': column.columnId,
                                'position': column.position
                            };
                        }),
                        'rowId': row.rowId,
                        'config': row.config,
                        'position': row.position
                    };
                });
                this.changes.next(rows);
            };
        });
    
        this.subscriptions.resizing = this.blox.resizing.subscribe(event => this.resizing.next(event));
    };

    ngOnDestroy(): void {
        this.subscriptions.end.unsubscribe();
        this.subscriptions.move.unsubscribe();
        this.subscriptions.start.unsubscribe();
        this.subscriptions.changes.unsubscribe();
        this.subscriptions.resizing.unsubscribe();
    };

    ngOnChanges(): void {
        this.blox.editing.next(this.editing);
    };

}