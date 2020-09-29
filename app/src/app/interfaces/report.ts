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
    'reportId'?: string;
    'description'?: string;
}