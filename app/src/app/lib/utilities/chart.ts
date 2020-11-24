import { ObjectId } from './id';
import { Style, STYLE } from './style';

export class Chart extends Style {

    readonly type: string = 'chart';
    
    public id?: string = ObjectId();
    public label?: string = '';
    public width?: number = 0;
    public series?: SERIES[] = [];
    public position?: number = 0;

    constructor(chart?: CHART) {
        super(chart);
        if (typeof(chart) != 'undefined' && chart !== null) {
            if (Array.isArray(chart.series)) {
                this.series = chart.series;
            };
            if (typeof(chart.id) != 'undefined' && chart.id !== null) {
                this.id = chart.id;
            };
            if (typeof(chart.label) != 'undefined' && chart.label !== null) {
                this.label = chart.label;
            };
            if (typeof(chart.width) != 'undefined' && chart.width !== null) {
                this.width = chart.width;
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
    'width'?: number;
    'series'?: SERIES[];
    'position'?: number;
}

export interface SERIES {
    'id'?: string;
    'type'?: string;
    'data'?: any[];
    'color'?: string;
    'opacity'?: number;
    'inputId'?: string;
    'deviceId'?: string;
}