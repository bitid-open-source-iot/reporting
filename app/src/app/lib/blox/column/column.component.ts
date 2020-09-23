import { ObjectId } from 'src/app/id';
import { BloxService } from '../blox.service';
import { Input, Component, Renderer2, OnChanges, ElementRef, SimpleChanges, AfterContentInit } from '@angular/core';

@Component({
    selector: 'column',
    styleUrls: ['./column.component.scss'],
    templateUrl: './column.component.html'
})

export class BloxColumnComponent implements OnChanges, AfterContentInit {
    
    @Input('id') public id: string = ObjectId();
    @Input('width') public width: number = 0;
    @Input('position') public position: number = 0;
    @Input('background') public background: string;
    
    constructor(private blox: BloxService, private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;

        this.process();
    };

    public resize: boolean = false;
    public element: HTMLElement;

    private async process() {
        this.renderer.setStyle(this.element, 'background', this.background);
        this.renderer.setStyle(this.element, 'flex', '0 calc(' + this.width + '% - 10px)');
    };

    public async hold(event: MouseEvent|TouchEvent) {
        this.blox.selected.next({
            'id': this.id,
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
                    'id': this.id,
                    'width': this.width,
                    'background': this.background
                }
            });
        };
    };

    ngAfterContentInit(): void {
        this.process();
    };

}