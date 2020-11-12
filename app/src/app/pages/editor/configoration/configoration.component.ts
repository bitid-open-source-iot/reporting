import { OnInit, Component, OnDestroy, Renderer2, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'configoration',
    styleUrls: ['./configoration.component.scss'],
    templateUrl: './configoration.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ConfigorationComponent implements OnInit, OnDestroy {

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;
    };

    public change: EventEmitter<any> = new EventEmitter<any>();
    public element: HTMLElement;

    ngOnInit(): void { };

    ngOnDestroy(): void { };

}