import { color } from './color';
import { Fill, Font } from 'src/app/interfaces/condition';
import { BloxService } from './blox.service';
import { BloxRowComponent } from './row/row.component';
import { Input, OnInit, Output, Component, QueryList, OnDestroy, Renderer2, OnChanges, ElementRef, EventEmitter, ViewEncapsulation, ContentChildren } from '@angular/core';

@Component({
    selector: 'blox',
    styleUrls: ['./blox.component.scss'],
    templateUrl: './blox.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxComponent implements OnInit, OnDestroy, OnChanges {
    
    public element: HTMLElement;

    @Input('font') public font: Font = {};
    @Input('fill') public fill: Fill = {};
    @Input('editing') public editing: boolean;
    
    @Output('changes') public changes: EventEmitter<any> = new EventEmitter<any>();
    @Output('resizing') public resizing: EventEmitter<boolean> = new EventEmitter<boolean>(false);

    @ContentChildren(BloxRowComponent) public rows: QueryList<BloxRowComponent>

    constructor(private el: ElementRef, private blox: BloxService, private renderer: Renderer2) {
        this.element = this.el.nativeElement;

        this.element.onmouseup = (event: MouseEvent) => this.blox.end.next(event);
        this.element.ontouchend = (event: TouchEvent) => this.blox.end.next(event);
        this.element.onmousemove = (event: MouseEvent) => this.blox.move.next(event);
        this.element.ontouchmove = (event: TouchEvent) => this.blox.move.next(event);
    };

    private subscriptions: any = {};

    private process() {
        /* --- FONT --- */
        if (typeof(this.font) != 'undefined' && this.font != null && this.font != '') {
            this.renderer.setStyle(this.element, 'color', color(this.font.color, this.font.opacity / 100));
        };
        /* --- FILL --- */
        if (typeof(this.fill) != 'undefined' && this.fill != null && this.fill != '') {
            this.renderer.setStyle(this.element, 'background-color', color(this.fill.color, this.fill.opacity / 100));
        };
    };

    ngOnInit(): void {
        this.process();

        this.blox.editing.next(this.editing);

        this.subscriptions.end = this.blox.end.subscribe(event => {
            if (this.blox.selected.value && this.blox.selected.value.id && this.blox.selected.value.type) {
                this.blox.selected.next(null);
                this.blox.changes.next(true);
            };
        });

        this.subscriptions.changes = this.blox.changes.subscribe(change => {
            if (this.rows) {
                const rows = this.rows.filter(row => row.type != 'static').map(row => {
                    return {
                        'columns': row.columns.map(column => {
                            return {
                                'id': column.id,
                                'width': column.width,
                                'position': column.position
                            };
                        }),
                        'id': row.id,
                        'height': row.height,
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
        this.subscriptions.changes.unsubscribe();
        this.subscriptions.resizing.unsubscribe();
    };

    ngOnChanges(): void {
        this.process();
        this.blox.editing.next(this.editing);
    };

}