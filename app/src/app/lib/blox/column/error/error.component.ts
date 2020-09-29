import { Input, OnInit, OnChanges, Component, OnDestroy, Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'error',
    styleUrls: ['./error.component.scss'],
    templateUrl: './error.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxColumnErrorComponent implements OnInit, OnChanges, OnDestroy {

    @Input('font') private font: any = {};

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;
    };

    public element: HTMLElement;

    private process() {
        /* --- FONT --- */
        if (typeof(this.font) != 'undefined' && this.font != null && this.font != '') {
            this.renderer.setStyle(this.element, 'color', this.font.color);
            this.renderer.setStyle(this.element, 'opacity', this.font.opacity / 100);
            this.renderer.setStyle(this.element, 'font-size', [this.font.size, 'px'].join(''));
            this.renderer.setStyle(this.element, 'line-height', [this.font.size, 'px'].join(''));
            this.renderer.setStyle(this.element, 'font-family', this.font.family);
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