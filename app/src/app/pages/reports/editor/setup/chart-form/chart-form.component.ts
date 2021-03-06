import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { BLOXSERIES } from '@bitid/blox';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { SeriesEditorDialog } from './editor/editor.dialog';
import { Input, Component, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'chart-form',
    styleUrls: ['./chart-form.component.scss'],
    templateUrl: './chart-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ChartForm {

    @Input('type') public type: string;

    constructor(private dialog: MatDialog, public devices: DevicesService) { };

    public series: BLOXSERIES[] = [];
    public update: EventEmitter<any> = new EventEmitter<any>();
    public change: EventEmitter<any> = new EventEmitter<any>();
    public loading: boolean;

    public remove(item) {
        for (let i = 0; i < this.series.length; i++) {
            if (this.series[i].id == item.id) {
                this.series.splice(i, 1);
                break;
            };
        };
        this.change.emit({
            'series': this.series
        });
        this.update.emit({
            'series': this.series
        });
    };

    public async set(data) {
        if (Array.isArray(data.series)) {
            this.series = data.series;
        };
    };

    public async editor(mode: string, chart?: BLOXSERIES) {
        if (mode == 'add') {
            chart = {
                'id': ObjectId(),
                'type': 'area',
                'color': '#000000',
                'inputId': null,
                'opacity': 100,
                'deviceId': null
            };
        } else if (mode == 'copy') {
            chart = JSON.parse(JSON.stringify(chart));
            chart.id = ObjectId();
        };
        
        const dialog = await this.dialog.open(SeriesEditorDialog, {
            'data': chart,
            'panelClass': 'series-dialog'
        });

        await dialog.afterClosed().subscribe(async result => {
            if (result) {
                switch (mode) {
                    case ('add'):
                    case ('copy'):
                        this.series.push(result);
                        break;
                    case ('update'):
                        this.series.map(o => {
                            Object.keys(result).map(key => {
                                if (key !== 'id') {
                                    o[key] = result[key];
                                };
                            });
                        });
                        break;
                };
                this.change.emit({
                    'series': this.series
                });
                this.update.emit({
                    'series': this.series
                });
            };
        });
    };

}