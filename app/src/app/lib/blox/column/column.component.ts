import { color } from '../color';
import { ObjectId } from 'src/app/id';
import { BloxService } from '../blox.service';
import { Fill, Font, Stroke } from 'src/app/interfaces/condition';
import { Input, Component, Renderer2, OnChanges, ViewChild, ElementRef, SimpleChanges, AfterContentInit } from '@angular/core';

@Component({
    selector: 'column',
    styleUrls: ['./column.component.scss'],
    templateUrl: './column.component.html'
})

export class BloxColumnComponent implements OnChanges, AfterContentInit {
    
    @Input('id') public id: string = ObjectId();
    @Input('font') public font: Font = {};
    @Input('fill') public fill: Fill = {};
    @Input('width') public width: number = 100;
    @Input('stroke') public stroke: Stroke = {};
    @Input('position') public position: number;

    @ViewChild('resizer', {'static': true}) private _resizer: ElementRef;
    
    constructor(private blox: BloxService, private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;

        this.process();
    };

    public resize: boolean = false;
    public element: HTMLElement;

    private async process() {
        this.renderer.setStyle(this.element, 'flex', '0 calc(' + this.width + '% - 10px)');
        /* --- FONT --- */
        if (typeof(this.font) != 'undefined' && this.font != null && this.font != '') {
            this.renderer.setStyle(this.element, 'color', color(this.font.color, this.font.opacity / 100));
            this.renderer.setStyle(this.element, 'font-size', this.font.size);
            this.renderer.setStyle(this.element, 'font-family', this.font.family);
        };
        /* --- FILL --- */
        if (typeof(this.fill) != 'undefined' && this.fill != null && this.fill != '') {
            this.renderer.setStyle(this.element, 'background-color', color(this.fill.color, this.fill.opacity / 100));
        };
        /* --- STROKE --- */
        if (typeof(this.stroke) != 'undefined' && this.stroke != null && this.stroke != '') {
            this.renderer.setStyle(this.element, 'border-width', this.stroke.width + 'px');
            this.renderer.setStyle(this.element, 'border-style', this.stroke.style);
            this.renderer.setStyle(this.element, 'border-color', color(this.stroke.color, this.stroke.opacity / 100));
        };
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
            'id': this.id,
            'type': 'column'
        });
        event.preventDefault();
        this.blox.start.next(event);
        this.blox.resizing.next(true);
    };

    ngOnChanges(changes: SimpleChanges): void {
        this.process();
    };

    ngAfterContentInit(): void {
        this.process();
    };

}