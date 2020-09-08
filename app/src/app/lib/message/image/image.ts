import { Input, Component } from '@angular/core';

@Component({
    selector:       'message-image',
    styleUrls:      ['./image.scss'],
    templateUrl:    './image.html'
})

export class ImageComponent {

    @Input('alt') public alt: string;
    @Input('src') public src: string;

    constructor() {};

}