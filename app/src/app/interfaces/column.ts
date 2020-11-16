import { Condition } from './condition';

export interface Column extends Condition {
    'map'?: {};
    'text'?: {
        'value'?: string;
    };
    'image'?: {
        'src'?: string;
    };
    'gauge'?: {};
    'table'?: {};
    'query'?: {
        'date'?: {
            'to'?: Date;
            'from'?: Date;
        };
        'counter'?: string;
        'inputId'?: string;
        'deviceId'?: string;
    };
    'chart'?: {
        'type'?: string;
        'color'?: string;
    };
    'value'?: {
        'color'?: string;
        'expression'?: string;
    };
    'id'?: string;
    'data'?: any;
    'label'?: string;
    'width'?: number;
    'display'?: string;
    'columnId'?: string;
    'position'?: number;
    'conditions'?: Condition[];
}