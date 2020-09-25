import { Condition } from './condition';

export interface Widget {
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
    'status'?: {};
    'type'?: string;
    'data'?: any;
    'label'?: string;
    'widgetId'?: string;
    'conditions': Condition[];
    'connectorId'?: string;
}