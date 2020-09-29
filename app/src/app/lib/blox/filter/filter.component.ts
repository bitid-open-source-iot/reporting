import { color } from '../color';
import { Fill, Font, Stroke } from 'src/app/interfaces/condition';
import { Input, Component, OnChanges, Renderer2, ElementRef, AfterContentInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'filter',
    styleUrls: ['./filter.component.scss'],
    templateUrl: './filter.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxFilterComponent implements OnChanges, AfterContentInit {
    
    @Input('fill') public fill: Fill = {};
    @Input('font') public font: Font = {};
    @Input('stroke') public stroke: Stroke = {};
    
    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;

        this.process();
    };

    public element: HTMLElement;

    private async process() {
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

    ngOnChanges(): void {
        this.process();
    };

    ngAfterContentInit(): void {
        this.process();
    };

}