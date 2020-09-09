import { Output, Component, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'blox',
    styleUrls: ['./blox.component.scss'],
    templateUrl: './blox.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxComponent {
    
    public element: HTMLElement;

    constructor(el: ElementRef) {
        this.element = el.nativeElement;
    };

}