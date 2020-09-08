import { Output, Component, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'blox',
    styleUrls: ['./blox.component.scss'],
    templateUrl: './blox.component.html',
    encapsulation: ViewEncapsulation.None
})

export class BloxComponent {
    
    @Output('changes') private changes: EventEmitter<any> = new EventEmitter<any>();

    public element: HTMLElement;

    constructor(private _element: ElementRef) {
        this.element = _element.nativeElement;
    };
    
}