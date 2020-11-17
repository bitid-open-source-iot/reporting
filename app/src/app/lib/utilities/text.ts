import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Text extends Style {

    readonly type: string = 'text';

    public id?: string = ObjectId();
    public label?: string = '';
    public value?: string|number = '';
    public width?: number = 0;
    public position?: number = 0;

    constructor(text?: TEXT) {
        super(text);
        if (typeof(text) != 'undefined' && text !== null) {
            if (typeof(text.id) != 'undefined' && text.id !== null) {
                this.id = text.id;
            };
            if (typeof(text.label) != 'undefined' && text.label !== null) {
                this.label = text.label;
            };
            if (typeof(text.width) != 'undefined' && text.width !== null) {
                this.width = text.width;
            };
            if (typeof(text.value) != 'undefined' && text.value !== null) {
                this.value = text.value;
            };
            if (typeof(text.position) != 'undefined' && text.position !== null) {
                this.position = text.position;
            };
        };
    };

}

export interface TEXT extends STYLE {
    'id'?: string;
    'type'?: string;
    'label'?: string;
    'width'?: number;
    'value'?: string|number;
    'position'?: number;
}