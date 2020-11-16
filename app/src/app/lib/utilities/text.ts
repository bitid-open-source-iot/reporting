import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Text extends Style {

    readonly id: string = ObjectId();
    readonly type: string = 'text';

    constructor(text?: TEXT) {
        super(text);
    };

}

export interface TEXT extends STYLE {
    'id'?: string;
    'type'?: string;
}