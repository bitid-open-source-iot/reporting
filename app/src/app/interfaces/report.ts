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
    'widgetId'?: string;
    'columnId'?: string;
    'position'?: number;
}

export interface Widget {
    'label'?: {
        'position'?: {
            'vertical'?: string;
            'horizontal'?: string;
        };
        'value'?: string;
        'visable'?: boolean;
    };
    'widgetId'?: string;
    'connectorId'?: string;
};