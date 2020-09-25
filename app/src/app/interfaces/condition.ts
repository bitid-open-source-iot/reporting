export interface Condition {
    'fill'?: {
        'color'?: string;
        'opacity'?: number;
    };
    'font'?: {
        'size'?: number;
        'color'?: string;
        'family'?: string;
        'opacity'?: number;
        'vertical'?: string;
        'horizontal'?: string;
    };
    'stroke'?: {
        'width'?: number;
        'style'?: string;
        'color'?: string;
        'opacity'?: number;
    };
    'banner'?: {
        'size'?: number;
        'color'?: string;
        'family'?: string;
        'opacity'?: number;
        'vertical'?: string;
        'horizontal'?: string;
    };
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
    'conditionId'?: string;
}