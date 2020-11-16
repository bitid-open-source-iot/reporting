import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Table extends Style {

    readonly type: string = 'table';

    public id?: string = ObjectId();
    public label?: string = '';
    public width?: number = 0;
    public position?: number = 0;

    constructor(table?: TABLE) {
        super(table);
        if (typeof(table) != 'undefined' && table !== null) {
            if (typeof(table.id) != 'undefined' && table.id !== null) {
                this.id = table.id;
            };
            if (typeof(table.label) != 'undefined' && table.label !== null) {
                this.label = table.label;
            };
            if (typeof(table.width) != 'undefined' && table.width !== null) {
                this.width = table.width;
            };
            if (typeof(table.position) != 'undefined' && table.position !== null) {
                this.position = table.position;
            };
        };
    };

}

export interface TABLE extends STYLE {
    'id'?: string;
    'type'?: string;
    'label'?: string;
    'width'?: number;
    'position'?: number;
}