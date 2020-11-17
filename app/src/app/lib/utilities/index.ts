import { Map } from './map';
import { Text } from './text';
import { Blank } from './blank';
import { Chart } from './chart';
import { Gauge } from './gauge';
import { Table } from './table';
import { Value } from './value';
import { Vector } from './vector';

export * from './map';
export * from './text';
export * from './blank';
export * from './style';
export * from './value';
export * from './chart';
export * from './gauge';
export * from './vector';

export function ParseUtility (array) {
    return array.map(item => {
        switch (item.type) {
            case('map'):
                return new Map(item);
            case('text'):
                return new Text(item);
            case('chart'):
                return new Chart(item);
            case('value'):
                return new Value(item);
            case('table'):
                return new Table(item);
            case('gauge'):
                return new Gauge(item);
            case('blank'):
                return new Blank(item);
            case('vector'):
                return new Vector(item);
            default:
                return null;
        };
    }).filter(item => {
        if (typeof(item) != 'undefined' && item !== null) {
            return item;
        };
    });
};

export function UnparseUtility (array) {
    return JSON.parse(JSON.stringify(ParseUtility(array)));
};