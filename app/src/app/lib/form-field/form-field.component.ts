import { AfterContentInit, Component, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'form-field',
    styleUrls: ['./form-field.component.scss'],
    templateUrl: './form-field.component.html',
    encapsulation: ViewEncapsulation.None
})

export class FormFieldComponent implements AfterContentInit {

    constructor(private el: ElementRef, private renderer: Renderer2) {
        this.element = this.el.nativeElement;
    };

    public element: HTMLElement;

    ngAfterContentInit(): void {
        this.element.addEventListener('click', (event: MouseEvent|TouchEvent) => {
            const input: HTMLInputElement = this.element.querySelector('input');
            if (typeof(input) != 'undefined' && input != null) {
                if (input.type == 'color') {
                    input.click();
                } else {
                    input.focus();
                };
            };
        });
    };

}