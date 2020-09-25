import { Widget } from 'src/app/interfaces/widget';
import { ObjectId } from 'src/app/id';
import { BloxService } from '../blox.service';
import { Input, Component, Renderer2, OnChanges, ViewChild, ElementRef, SimpleChanges, AfterContentInit } from '@angular/core';

@Component({
    selector: 'column',
    styleUrls: ['./column.component.scss'],
    templateUrl: './column.component.html'
})

export class BloxColumnComponent implements OnChanges, AfterContentInit {
    
    @Input('config') public config: any = {
        'width': 100,
        'background': 'rgba(0, 0, 0, 1)'
    };
    @Input('widget') public widget: Widget;
    @Input('widgetId') public widgetId: string;
    @Input('columnId') public columnId: string = ObjectId();
    @Input('position') public position: number = 0;

    @ViewChild('resizer', {'static': true}) private _resizer: ElementRef;
    
    constructor(private blox: BloxService, private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;

        this.process();
    };

    public resize: boolean = false;
    public element: HTMLElement;

    private async process() {
        this.renderer.setStyle(this.element, 'background', this.config.background);
        this.renderer.setStyle(this.element, 'flex', '0 calc(' + this.config.width + '% - 10px)');
    };

    public resizer(enabled: boolean) {
        if (this._resizer) {
            if (enabled) {
                this.renderer.setStyle(this._resizer.nativeElement, 'display', 'block');
            } else {
                this.renderer.setStyle(this._resizer.nativeElement, 'display', 'none');
            };
        };
    };

    public async hold(event: MouseEvent|TouchEvent) {
        this.blox.selected.next({
            'id': this.columnId,
            'type': 'column'
        });
        event.preventDefault();
        this.blox.resizing.next(true);
    };

    public async release(event: MouseEvent|TouchEvent) {
        if (this.blox.selected.value) {
            if (this.blox.selected.value.type == 'column') {
                this.blox.selected.next(null);
            };
        };
        event.preventDefault();
        this.blox.resizing.next(false);
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
                'column': {
                    'id': this.columnId,
                    'width': this.config.width,
                    'background': this.config.background
                }
            });
        };
    };

    ngAfterContentInit(): void {
        this.process();
    };

}