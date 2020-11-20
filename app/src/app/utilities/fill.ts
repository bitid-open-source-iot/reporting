export class Fill {

    public color: string = '#000000';
    public opacity: number = 100;

    constructor(fill?: FILL) {
        if (typeof (fill) != 'undefined' && fill !== null) {
            if (typeof (fill.color) != 'undefined' && fill.color !== null) {
                this.color = fill.color;
            };
            if (typeof (fill.opacity) != 'undefined' && fill.opacity !== null) {
                this.opacity = fill.opacity;
            };
        };
    };

}

export interface FILL {
    'color'?: string;
    'opacity'?: number;
}