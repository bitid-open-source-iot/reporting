import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Chart extends Style {

    readonly id: string = ObjectId();
    readonly type: string = 'chart';
    
    public label?: string = '';
    public position?: number = 0;

    constructor(chart?: CHART) {
        super(chart);
        if (typeof(chart) != 'undefined' && chart !== null) {
            if (typeof(chart.label) != 'undefined' && chart.label !== null) {
                this.label = chart.label;
            };
            if (typeof(chart.position) != 'undefined' && chart.position !== null) {
                this.position = chart.position;
            };
        };
    };

}

export interface CHART extends STYLE {
    'id'?: string;
    'type'?: string;
    'label'?: string;
    'position'?: number;
}