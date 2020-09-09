import { User } from './user';

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
    'role'?: number;
    'users'?: User[];
    'widgets'?: Widget[];
    'reportId'?: number;
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
    'chart'?: {
        'type'?: string;
        'query'?: any;
    };
    'status'?: {};
    'type'?: string;
    'widgetId'?: string;
    'connectorId'?: string;
};