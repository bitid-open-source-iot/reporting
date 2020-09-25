import { Input, OnInit, OnChanges, Component, OnDestroy, Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'banner',
    styleUrls: ['./banner.component.scss'],
    templateUrl: './banner.component.html',
    encapsulation: ViewEncapsulation.None
})

export class WidgetBannerComponent implements OnInit, OnChanges, OnDestroy {

    @Input('font') private font: any = {};

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;
    };

    public element: HTMLElement;

    private process() {
        /* --- FONT --- */
        this.renderer.setStyle(this.element, 'color', this.font.color);
        this.renderer.setStyle(this.element, 'opacity', this.font.opacity / 100);
        this.renderer.setStyle(this.element, 'font-size', [this.font.size, 'px'].join(''));
        this.renderer.setStyle(this.element, 'line-height', [this.font.size, 'px'].join(''));
        this.renderer.setStyle(this.element, 'font-family', this.font.family);

        this.renderer.setStyle(this.element, 'top', 'auto');
        this.renderer.setStyle(this.element, 'left', 'auto');
        this.renderer.setStyle(this.element, 'right', 'auto');
        this.renderer.setStyle(this.element, 'bottom', 'auto');

        switch(this.font.vertical) {
            case('top'):
                this.renderer.setStyle(this.element, 'top', '0px');
                break;
            case('bottom'):
                this.renderer.setStyle(this.element, 'bottom', '0px');
                break;
        };

        switch(this.font.horizontal) {
            case('left'):
                this.renderer.setStyle(this.element, 'left', '0px');
                break;
            case('right'):
                this.renderer.setStyle(this.element, 'right', '0px');
                break;
        };
    };

    ngOnInit(): void {
        this.process();
    };

    ngOnChanges(): void {
        this.process();
    };

    ngOnDestroy(): void { };

}