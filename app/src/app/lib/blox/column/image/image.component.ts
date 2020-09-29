import { Input, OnInit, OnChanges, Component, OnDestroy, Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'image',
    styleUrls: ['./image.component.scss'],
    templateUrl: './image.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxColumnImageComponent implements OnInit, OnChanges, OnDestroy {

    @Input('src') private src: string;

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;
    };

    public element: HTMLElement;

    private process() {
        this.renderer.setStyle(this.element, 'background-image', ['url(', this.src, ')'].join(''));
    };

    ngOnInit(): void {
        this.process();
    };

    ngOnChanges(): void {
        this.process();
    };

    ngOnDestroy(): void { };

}