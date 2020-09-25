import { User } from './user';
import { Theme } from './theme';
import { Widget } from './widget';

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
    'config'?: {
        'height'?: number;
    };
    'rowId'?: string;
    'columns'?: Column[];
    'position'?: number;
}

export interface Column {
    'config'?: {
        'width'?: number;
        'background'?: string;
    };
    'widget'?: Widget;
    'widgetId'?: string;
    'columnId'?: string;
    'position'?: number;
}