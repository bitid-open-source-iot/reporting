import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Vector extends Style {

    readonly id: string = ObjectId();
    readonly type: string = 'vector';

    constructor(vector?: VECTOR) {
        super(vector);
    };

}

export interface VECTOR extends STYLE {
    'id'?: string;
    'type'?: string;
}