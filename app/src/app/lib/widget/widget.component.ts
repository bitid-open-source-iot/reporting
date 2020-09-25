import { Input, OnInit, OnChanges, Component, ViewChild, Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'widget',
    styleUrls: ['./widget.component.scss'],
    templateUrl: './widget.component.html',
    encapsulation: ViewEncapsulation.None
})

export class WidgetComponent implements OnInit, OnChanges {

    @Input('fill') private fill: any = {};
    @Input('stroke') private stroke: any = {};

    @ViewChild('backdropfill', {'static': true}) private backdropfill: ElementRef;
    @ViewChild('backdropstroke', {'static': true}) private backdropstroke: ElementRef;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;
    };

    public element: HTMLElement;

    private process() {
        /* --- FILL --- */
        this.renderer.setStyle(this.backdropfill.nativeElement, 'opacity', this.fill.opacity / 100);
        this.renderer.setStyle(this.backdropfill.nativeElement, 'background', this.fill.color);
        /* --- STROKE --- */
        this.renderer.setStyle(this.backdropstroke.nativeElement, 'border', [this.stroke.width, 'px', ' ', this.stroke.style, ' ', this.stroke.color].join(''));
        this.renderer.setStyle(this.backdropstroke.nativeElement, 'opacity', this.fill.opacity / 100);
        /* --- BACKDROP --- */
        this.renderer.setStyle(this.backdropfill.nativeElement, 'top', [this.stroke.width, 'px'].join(''));
        this.renderer.setStyle(this.backdropfill.nativeElement, 'left', [this.stroke.width, 'px'].join(''));
        this.renderer.setStyle(this.backdropfill.nativeElement, 'right', [this.stroke.width, 'px'].join(''));
        this.renderer.setStyle(this.backdropfill.nativeElement, 'bottom', [this.stroke.width, 'px'].join(''));
    };

    ngOnInit(): void {
        this.process();
    };

    ngOnChanges(): void {
        this.process();
    };

}