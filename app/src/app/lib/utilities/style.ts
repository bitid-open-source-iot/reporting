import { Condition, CONDITION } from 'src/app/utilities/condition';

/* --- STYLE --- */
export class Style {

    public fill?: FILL = new Fill();
    public font?: FONT = new Font();
    public stroke?: STROKE = new Stroke();
    public banner?: BANNER = new Banner();
    public conditions?: CONDITION[] = [];

    constructor(style?: STYLE) {
        if (typeof(style) != 'undefined' && style !== null) {
            if (Array.isArray(style.conditions)) {
                this.conditions = <CONDITION[]>style.conditions.map(condition => new Condition(condition));
            };
            if (typeof(style.fill) != 'undefined' && style.fill !== null) {
                this.fill = new Fill(style.fill);
            };
            if (typeof(style.font) != 'undefined' && style.font !== null) {
                this.font = new Font(style.font);
            };
            if (typeof(style.stroke) != 'undefined' && style.stroke !== null) {
                this.stroke = new Stroke(style.stroke);
            };
            if (typeof(style.banner) != 'undefined' && style.banner !== null) {
                this.banner = new Banner(style.banner);
            };
        };
    };

}

export interface STYLE {
    'fill'?: FILL;
    'font'?: FONT;
    'stroke'?: STROKE;
    'banner'?: BANNER;
    'conditions'?: CONDITION[];
}
/* --- STYLE --- */

/* --- FILL --- */
export class Fill {

    public color: string = '#000000';
    public opacity: number = 100;

    constructor(fill?: FILL) {
        if (typeof(fill) != 'undefined' && fill !== null) {
            if (typeof(fill.color) != 'undefined' && fill.color !== null) {
                this.color = fill.color;
            };
            if (typeof(fill.opacity) != 'undefined' && fill.opacity !== null) {
                this.opacity = fill.opacity;
            };
        };
    };

}

export interface FILL {
    'color'?: string;
    'opacity'?: number;
}
/* --- FILL --- */

/* --- FONT --- */
export class Font {

    public size: number = 14;
    public color: string = '#000000';
    public family: string = 'Arial';
    public opacity: number = 100;
    public vertical: string = 'top';
    public horizontal: string = 'left';

    constructor(font?: FONT) {
        if (typeof(font) != 'undefined' && font !== null) {
            if (typeof(font.size) != 'undefined' && font.size !== null) {
                this.size = font.size;
            };
            if (typeof(font.color) != 'undefined' && font.color !== null) {
                this.color = font.color;
            };
            if (typeof(font.family) != 'undefined' && font.family !== null) {
                this.family = font.family;
            };
            if (typeof(font.opacity) != 'undefined' && font.opacity !== null) {
                this.opacity = font.opacity;
            };
            if (typeof(font.vertical) != 'undefined' && font.vertical !== null) {
                this.vertical = font.vertical;
            };
            if (typeof(font.horizontal) != 'undefined' && font.horizontal !== null) {
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
/* --- FONT --- */

/* --- STROKE --- */
export class Stroke {

    public width: number = 0;
    public style: string = 'solid';
    public color: string = '#000000';
    public opacity: number = 100;

    constructor(stroke?: STROKE) {
        if (typeof(stroke) != 'undefined' && stroke !== null) {
            if (typeof(stroke.width) != 'undefined' && stroke.width !== null) {
                this.width = stroke.width;
            };
            if (typeof(stroke.style) != 'undefined' && stroke.style !== null) {
                this.style = stroke.style;
            };
            if (typeof(stroke.color) != 'undefined' && stroke.color !== null) {
                this.color = stroke.color;
            };
            if (typeof(stroke.opacity) != 'undefined' && stroke.opacity !== null) {
                this.opacity = stroke.width;
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
/* --- STROKE --- */

/* --- BANNER --- */
export class Banner {

    public size: number = 14;
    public color: string = '#000000';
    public family: string = 'Arial';
    public opacity: number = 100;
    public vertical: string = 'top';
    public horizontal: string = 'left';

    constructor(banner?: BANNER) {
        if (typeof(banner) != 'undefined' && banner !== null) {
            if (typeof(banner.size) != 'undefined' && banner.size !== null) {
                this.size = banner.size;
            };
            if (typeof(banner.color) != 'undefined' && banner.color !== null) {
                this.color = banner.color;
            };
            if (typeof(banner.family) != 'undefined' && banner.family !== null) {
                this.family = banner.family;
            };
            if (typeof(banner.opacity) != 'undefined' && banner.opacity !== null) {
                this.opacity = banner.opacity;
            };
            if (typeof(banner.vertical) != 'undefined' && banner.vertical !== null) {
                this.vertical = banner.vertical;
            };
            if (typeof(banner.horizontal) != 'undefined' && banner.horizontal !== null) {
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
/* --- BANNER --- */