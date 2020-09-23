import { ObjectId } from 'src/app/id';
import { BloxService } from '../blox.service';
import { BloxColumnComponent } from '../column/column.component';
import { Input, OnInit, Component, OnDestroy, Renderer2, OnChanges, QueryList, ElementRef, ContentChildren, AfterContentInit, SimpleChanges } from '@angular/core';

@Component({
    selector: 'row',
    styleUrls: ['./row.component.scss'],
    templateUrl: './row.component.html'
})

export class BloxRowComponent implements OnInit, OnDestroy, OnChanges, AfterContentInit {
    
    @Input('id') public id: string = ObjectId();
    @Input('type') public type: string = 'static';
    @Input('width') public width: number = 100;
    @Input('height') public height: number = 0;
    @Input('background') public background: string;
    
    @ContentChildren(BloxColumnComponent) public columns: QueryList<BloxColumnComponent>;

    constructor(private blox: BloxService, private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;

        this.process();
    };

    public resize: boolean;
    public element: HTMLElement;

    private x: number;
    private y: number;
    private min: number = 50;
    private subscriptions: any = {};

    private async process() {
        this.renderer.setStyle(this.element, 'height', this.height + 'px');
        this.renderer.setStyle(this.element, 'background', this.background);
        this.renderer.setStyle(this.element, 'flex', '0 calc(' + this.width + '% - 10px)');

        if (this.type == 'dynamic') {
            this.resize = true;
        };

        if (this.columns) {
            this.columns.forEach(column => {
                column.resize = true;
            });
            this.columns.last.resize = false;
        };
    };

    public async hold(event: MouseEvent|TouchEvent) {
        this.blox.selected.next({
            'id': this.id,
            'type': 'row'
        });
        event.preventDefault();
        this.blox.resizing.next(true);
    };

    public async release(event: MouseEvent|TouchEvent) {
        if (this.blox.selected.value) {
            if (this.blox.selected.value.type == 'row') {
                this.blox.selected.next(null);
            };
        };
        event.preventDefault();
        this.blox.resizing.next(false);
    };

    ngOnInit(): void {
        this.subscriptions.end = this.blox.end.subscribe(event => {
            this.blox.resizing.next(false);
        });

        this.subscriptions.move = this.blox.move.subscribe(event => {
            if (this.blox.selected.value && this.blox.resizing.value) {
                if (this.blox.selected.value.type == 'row' && this.blox.selected.value.id == this.id) {
                    if (event instanceof MouseEvent) {
                        const height = this.height + (event.pageY - this.y);
                        if (height > this.min) {
                            this.height = height;
                            this.y = event.pageY;
                        };
                    } else if (event instanceof TouchEvent) {
                        const height = this.height + (event.touches[0].pageY - this.y);
                        if (height > this.min) {
                            this.height = height;
                            this.y = event.touches[0].pageY;
                        };
                    };
                    this.renderer.setStyle(this.element, 'height', this.height + 'px');
                } else if (this.blox.selected.value.type == 'column') {
                    this.columns.forEach(column => {
                        if (this.blox.selected.value.id == column.id) {
                            let diff: number = 0;
                            if (event instanceof MouseEvent) {
                                diff = parseFloat((((event.pageX - this.x) / this.element.clientWidth) * 100).toFixed(2));
                                column.width += diff;    
                                this.x = event.pageX;
                            } else if (event instanceof TouchEvent) {
                                diff = parseFloat((((event.touches[0].pageX - this.x) / this.element.clientWidth) * 100).toFixed(2));
                                column.width += diff;  
                                this.x = event.touches[0].pageX;
                            };
                            
                            this.renderer.setStyle(column.element, 'flex', '0 calc(' + column.width + '% - 10px)');
                            
                            this.columns.forEach(col => {
                                if (col.position == column.position + 1) {
                                    col.width -= diff;
                                    this.renderer.setStyle(col.element, 'flex', '0 calc(' + col.width + '% - 10px)');
                                };
                            });
                        };
                    });
                };
            };
        });

        this.subscriptions.start = this.blox.start.subscribe(event => {
            if (event instanceof MouseEvent) {
                this.x = event.pageX;
                this.y = event.pageY;
            } else {
                this.x = event.touches[0].pageX;
                this.y = event.touches[0].pageY;
            };
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.end.unsubscribe();
        this.subscriptions.move.unsubscribe();
        this.subscriptions.start.unsubscribe();
    };

    ngOnChanges(changes: SimpleChanges): void {
        let first: boolean = true;
        Object.keys(changes).map(key => {
            if (!changes[key].firstChange) {
                first = false;
            };
        });
        if (!first) {
            this.blox.changes.next({
                'row': {
                    'columns': this.columns.map(column => {
                        return {
                            'id': column.id,
                            'width': column.width,
                            'background': column.background
                        };
                    }),
                    'id': this.id,
                    'height': this.height,
                    'background': this.background
                }
            });
        };
    };

    ngAfterContentInit(): void {
        this.process();
    };

}