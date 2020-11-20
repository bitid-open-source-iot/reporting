export class Font {

    public size: number = 24;
    public color: string = '#FFFFFF';
    public family: string = 'Arial';
    public opacity: number = 100;
    public vertical: string = 'center';
    public horizontal: string = 'center';

    constructor(font?: FONT) {
        if (typeof (font) != 'undefined' && font != null) {
            if (typeof (font.size) != 'undefined' && font.size !== null) {
                this.size = font.size;
            };
            if (typeof (font.color) != 'undefined' && font.color !== null) {
                this.color = font.color;
            };
            if (typeof (font.opacity) != 'undefined' && font.opacity !== null) {
                this.opacity = font.opacity;
            };
            if (typeof (font.family) != 'undefined' && font.family !== null) {
                this.family = font.family;
            };
            if (typeof (font.vertical) != 'undefined' && font.vertical !== null) {
                this.vertical = font.vertical;
            };
            if (typeof (font.horizontal) != 'undefined' && font.horizontal !== null) {
                this.horizontal = font.horizontal;
            };
        };
    };

}

export interface FONT {
    'size'?: number;
    'color'?: string;
    'family'?: string;
    'opacity'?: number;
    'vertical'?: string;
    'horizontal'?: string;
}