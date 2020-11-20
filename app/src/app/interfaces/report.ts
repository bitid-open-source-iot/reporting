import { Row } from './row';
import { User } from './user';
import { Theme } from './theme';

export interface Report {
    'layout'?: {
        'mobile'?: Row[];
        'tablet'?: Row[];
        'desktop'?: Row[];
    };
    'url'?: string;
    'type'?: string;
    'role'?: number;
    'users'?: User[];
    'theme'?: Theme;
    'settings'?: {
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
        'board'?: {
            'color'?: string;
            'opacity'?: number;
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
    };
    'reportId'?: string;
    'description'?: string;
}