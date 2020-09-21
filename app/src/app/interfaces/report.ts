import { User } from './user';
import { Theme } from './theme';

export interface Report {
    'layout'?: {
        'mobile'?: {
            'rows'?: Row[];
        };
        'tablet'?: {
            'rows'?: Row[];
        };
        'desktop'?: {
            'rows'?: Row[];
        };
    };
    'url'?: string;
    'type'?: string;
    'role'?: number;
    'users'?: User[];
    'theme'?: Theme;
    'widgets'?: Widget[];
    'reportId'?: string;
    'description'?: string;
}

export interface Row {
    'style'?: {
        'height'?: number;
    };
    'rowId'?: string;
    'columns'?: Column[];
    'position'?: number;
}

export interface Column {
    'style'?: {
        'width'?: number;
        'background'?: string;
    };
    'widget'?: Widget;
    'widgetId'?: string;
    'columnId'?: string;
    'position'?: number;
}

export interface Widget {
    'label'?: {
        'value'?: string;
        'visable'?: boolean;
    };
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
    'widgetId'?: string;
    'conditions': Condition[];
    'connectorId'?: string;
}

export interface Condition {
    'active'?: {
        'min'?: number;
        'max'?: number;
    };
    'style'?: {
        'color'?: string;
        'background'?: string;
    };
    'conditionId'?: string;
}