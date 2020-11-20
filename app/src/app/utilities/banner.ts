export class Banner {

    public size: number = 14;
    public color: string = '#FFFFFF';
    public family: string = 'Arial';
    public opacity: number = 100;
    public vertical: string = 'center';
    public horizontal: string = 'center';

    constructor(banner?: BANNER) {
        if (typeof (banner) != 'undefined' && banner != null) {
            if (typeof (banner.size) != 'undefined' && banner.size !== null) {
                this.size = banner.size;
            };
            if (typeof (banner.color) != 'undefined' && banner.color !== null) {
                this.color = banner.color;
            };
            if (typeof (banner.opacity) != 'undefined' && banner.opacity !== null) {
                this.opacity = banner.opacity;
            };
            if (typeof (banner.family) != 'undefined' && banner.family !== null) {
                this.family = banner.family;
            };
            if (typeof (banner.vertical) != 'undefined' && banner.vertical !== null) {
                this.vertical = banner.vertical;
            };
            if (typeof (banner.horizontal) != 'undefined' && banner.horizontal !== null) {
                this.horizontal = banner.horizontal;
            };
        };
    };

}

export interface BANNER {
    'size'?: number;
    'color'?: string;
    'family'?: string;
    'opacity'?: number;
    'vertical'?: string;
    'horizontal'?: string;
}