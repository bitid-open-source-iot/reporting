import { Column } from './column';

export interface Row {
    'rowId'?: string;
    'height'?: number;
    'columns'?: Column[];
    'position'?: number;
}