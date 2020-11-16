import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Vector extends Style {

    readonly type: string = 'vector';

    public id?: string = ObjectId();
    public label?: string = '';
    public width?: number = 0;
    public position?: number = 0;

    constructor(vector?: VECTOR) {
        super(vector);
        if (typeof(vector) != 'undefined' && vector !== null) {
            if (typeof(vector.id) != 'undefined' && vector.id !== null) {
                this.id = vector.id;
            };
            if (typeof(vector.label) != 'undefined' && vector.label !== null) {
                this.label = vector.label;
            };
            if (typeof(vector.width) != 'undefined' && vector.width !== null) {
                this.width = vector.width;
            };
            if (typeof(vector.position) != 'undefined' && vector.position !== null) {
                this.position = vector.position;
            };
        };
    };

}

export interface VECTOR extends STYLE {
    'id'?: string;
    'type'?: string;
    'label'?: string;
    'width'?: number;
    'position'?: number;
}