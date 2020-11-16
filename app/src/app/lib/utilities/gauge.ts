import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Gauge extends Style {

    readonly type: string = 'gauge';

    public id?: string = ObjectId();
    public label?: string = '';
    public width?: number = 0;
    public position?: number = 0;

    constructor(gauge?: GAUGE) {
        super(gauge);
        if (typeof(gauge) != 'undefined' && gauge !== null) {
            if (typeof(gauge.id) != 'undefined' && gauge.id !== null) {
                this.id = gauge.id;
            };
            if (typeof(gauge.label) != 'undefined' && gauge.label !== null) {
                this.label = gauge.label;
            };
            if (typeof(gauge.width) != 'undefined' && gauge.width !== null) {
                this.width = gauge.width;
            };
            if (typeof(gauge.position) != 'undefined' && gauge.position !== null) {
                this.position = gauge.position;
            };
        };
    };

}

export interface GAUGE extends STYLE {
    'id'?: string;
    'type'?: string;
    'label'?: string;
    'width'?: number;
    'position'?: number;
}