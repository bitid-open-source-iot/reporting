import { Component, Renderer2, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
    selector:       'message',
    styleUrls:      ['./message.scss'],
    templateUrl:    './message.html',
    encapsulation:  ViewEncapsulation.None
})

export class MessageComponent {

    constructor(private renderer: Renderer2, private element: ElementRef) {
        this.renderer.setStyle(this.element.nativeElement, 'margin', 'auto');
        this.renderer.setStyle(this.element.nativeElement, 'display', 'flex');
        this.renderer.setStyle(this.element.nativeElement, 'align-items', 'center');
        this.renderer.setStyle(this.element.nativeElement, 'flex-direction', 'column');
        this.renderer.setStyle(this.element.nativeElement, 'justify-content', 'center');
    };

}