import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Map extends Style {

    readonly id: string = ObjectId();
    readonly type: string = 'map';

    constructor(map?: MAP) {
        super(map);
    };

}

export interface MAP extends STYLE {
    'id'?: string;
    'type'?: string;
}