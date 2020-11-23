import { Fill, FILL } from './fill';
import { Font, FONT } from './font';
import { Stroke, STROKE } from './stroke';
import { Banner, BANNER } from './banner';
import { ObjectId } from '../id';

export class Condition {

    public id?: string =  ObjectId();
    public type?: string;
    public fill?: FILL = new Fill();
    public font?: FONT = new Font();
    public board?: FILL = new Fill();
    public stroke?: STROKE = new Stroke();
    public banner?: BANNER = new Banner();
    public analog?: any = {
        'min': 0,
        'max': 0
    };
    public digital?: any = {
        'value': 0
    };
    public inputId?: string;
    public deviceId?: string;
    
    constructor(condition?: CONDITION) {
        if (typeof(condition) != 'undefined' && condition !== null) {
            if (typeof(condition.id) != 'undefined' && condition.id !== null) {
                this.id = condition.id;
            };
            if (typeof(condition.fill) != 'undefined' && condition.fill !== null) {
                this.fill = new Fill(condition.fill);
            };
            if (typeof(condition.font) != 'undefined' && condition.font !== null) {
                this.font = new Font(condition.font);
            };
            if (typeof(condition.type) != 'undefined' && condition.type !== null) {
                this.type = condition.type;
            };
            if (typeof(condition.board) != 'undefined' && condition.board !== null) {
                this.board = new Fill(condition.board);
            };
            if (typeof(condition.stroke) != 'undefined' && condition.stroke !== null) {
                this.stroke = new Stroke(condition.stroke);
            };
            if (typeof(condition.banner) != 'undefined' && condition.banner !== null) {
                this.banner = new Banner(condition.banner);
            };
            if (typeof(condition.analog) != 'undefined' && condition.analog !== null) {
                if (typeof(condition.analog.min) != 'undefined' && condition.analog.min !== null) {
                    this.analog.min = condition.analog.min;
                };
                if (typeof(condition.analog.max) != 'undefined' && condition.analog.max !== null) {
                    this.analog.max = condition.analog.max;
                };
            };
            if (typeof(condition.digital) != 'undefined' && condition.digital !== null) {
                if (typeof(condition.digital.value) != 'undefined' && condition.digital.value !== null) {
                    this.digital.value = condition.digital.value;
                };
            };
            if (typeof(condition.inputId) != 'undefined' && condition.inputId !== null) {
                this.inputId = condition.inputId;
            };
            if (typeof(condition.deviceId) != 'undefined' && condition.deviceId !== null) {
                this.deviceId = condition.deviceId;
            };
        };
    };

}

export interface CONDITION {
    'fill'?: FILL;
    'font'?: FONT;
    'board'?: FILL;
    'stroke'?: STROKE;
    'banner'?: BANNER;
    'analog'?: {
        'min': number;
        'max': number;
    };
    'digital'?: {
        'value': number;
    };
    'id': string;
    'type': string;
    'inputId': string;
    'deviceId': string;
}