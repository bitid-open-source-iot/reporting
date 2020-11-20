export class Stroke {

    public width: number = 1;
    public style: string = 'solid';
    public color: string = '#000000';
    public opacity: number = 100;

    constructor(stroke?: STROKE) {
        if (typeof (stroke) != 'undefined' && stroke !== null) {
            if (typeof (stroke.width) != 'undefined' && stroke.width !== null) {
                this.width = stroke.width;
            };
            if (typeof (stroke.style) != 'undefined' && stroke.style !== null) {
                this.style = stroke.style;
            };
            if (typeof (stroke.color) != 'undefined' && stroke.color !== null) {
                this.color = stroke.color;
            };
            if (typeof (stroke.opacity) != 'undefined' && stroke.opacity !== null) {
                this.opacity = stroke.opacity;
            };
        };
    };

}

export interface STROKE {
    'width'?: number;
    'style'?: string;
    'color'?: string;
    'opacity'?: number;
}