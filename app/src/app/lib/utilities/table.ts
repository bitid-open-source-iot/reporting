import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Table extends Style {

    readonly id: string = ObjectId();
    readonly type: string = 'table';

    constructor(table?: TABLE) {
        super(table);
    };

}

export interface TABLE extends STYLE {
    'id'?: string;
    'type'?: string;
}