export interface Fill {
    'color'?: string;
    'opacity'?: number;
}

export interface Font {
    'size'?: number;
    'color'?: string;
    'family'?: string;
    'opacity'?: number;
    'vertical'?: string;
    'horizontal'?: string;
}

export interface Stroke {
    'width'?: number;
    'style'?: string;
    'color'?: string;
    'opacity'?: number;
}

export interface ChartFill {
    'color'?: string;
    'opacity'?: number;
}

export interface Gridlines {
    'width'?: number;
    'style'?: string;
    'color'?: string;
    'opacity'?: number;
}

export interface Condition {
    'connector'?: {
        'analog'?: {
            'min'?: number;
            'max'?: number;
            'units'?: string;
        };
        'digital'?: {
            'low'?: string;
            'high'?: string;
            'value'?: number;
        };
        'type'?: string;
        'inputId'?: string;
        'deviceId'?: string;
    };
    'type'?: string;
    'fill'?: Fill;
    'font'?: Font;
    'stroke'?: Stroke;
    'banner'?: Font;
    'chartfill'?: ChartFill;
    'gridlines'?: Gridlines;
    'conditionId'?: string;
}