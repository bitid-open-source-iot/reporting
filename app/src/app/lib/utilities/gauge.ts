import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Gauge extends Style {

    readonly id: string = ObjectId();
    readonly type: string = 'gauge';

    constructor(gauge?: GAUGE) {
        super(gauge);
    };

}

export interface GAUGE extends STYLE {
    'id'?: string;
    'type'?: string;
}