import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Map extends Style {

    readonly type: string = 'map';

    public id?: string = ObjectId();
    public label?: string = '';
    public width?: number = 0;
    public position?: number = 0;

    constructor(map?: MAP) {
        super(map);
        if (typeof(map) != 'undefined' && map !== null) {
            if (typeof(map.id) != 'undefined' && map.id !== null) {
                this.id = map.id;
            };
            if (typeof(map.label) != 'undefined' && map.label !== null) {
                this.label = map.label;
            };
            if (typeof(map.width) != 'undefined' && map.width !== null) {
                this.width = map.width;
            };
            if (typeof(map.position) != 'undefined' && map.position !== null) {
                this.position = map.position;
            };
        };
    };

}

export interface MAP extends STYLE {
    'id'?: string;
    'type'?: string;
    'label'?: string;
    'width'?: number;
    'position'?: number;
}