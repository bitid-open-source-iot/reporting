import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Blank extends Style {

    readonly id: string = ObjectId();
    readonly type: string = 'blank';
    
    public label?: string = '';
    public width?: number = 0;
    public position?: number = 0;

    constructor(blank?: BLANK) {
        super(blank);
        if (typeof(blank) != 'undefined' && blank !== null) {
            if (typeof(blank.label) != 'undefined' && blank.label !== null) {
                this.label = blank.label;
            };
            if (typeof(blank.width) != 'undefined' && blank.width !== null) {
                this.width = blank.width;
            };
            if (typeof(blank.position) != 'undefined' && blank.position !== null) {
                this.position = blank.position;
            };
        };
    };

}

export interface BLANK extends STYLE {
    'id'?: string;
    'type'?: string;
    'width'?: number;
    'label'?: string;
    'position'?: number;
}