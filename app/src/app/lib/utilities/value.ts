import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Value extends Style {

    readonly type: string = 'value';

    public id?: string = ObjectId();
    public label?: string = '';
    public width?: number = 0;
    public position?: number = 0;
    
    constructor(value?: VALUE) {
        super(value);

        if (typeof(value) != 'undefined' && value !== null) {
            if (typeof(value.id) != 'undefined' && value.id !== null) {
                this.id = value.id;
            };
            if (typeof(value.label) != 'undefined' && value.label !== null) {
                this.label = value.label;
            };
            if (typeof(value.width) != 'undefined' && value.width !== null) {
                this.width = value.width;
            };
            if (typeof(value.position) != 'undefined' && value.position !== null) {
                this.position = value.position;
            };
        };
    };

}

export interface VALUE extends STYLE {
    'id'?: string;
    'type'?: string;
    'label'?: string;
    'width'?: number;
    'position'?: number;
}