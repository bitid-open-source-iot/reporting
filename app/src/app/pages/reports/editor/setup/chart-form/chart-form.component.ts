import { SERIES } from 'src/app/lib/utilities/index';
import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { SeriesEditorDialog } from './editor/editor.dialog';
import { Input, OnInit, Component, OnDestroy, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'chart-form',
    styleUrls: ['./chart-form.component.scss'],
    templateUrl: './chart-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ChartForm implements OnInit, OnDestroy {

    @Input('type') public type: string;

    constructor(private dialog: MatDialog, public devices: DevicesService) { };

    public series: SERIES[] = [];
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

    public async editor(mode: string, chart?: SERIES) {
        if (mode == 'add') {
            chart = {
                'id': ObjectId(),
                'type': null,
                'color': '#000000',
                'inputId': null,
                'opacity': 100,
                'deviceId': null
            };
        };
        const dialog = await this.dialog.open(SeriesEditorDialog, {
            'data': chart,
            'panelClass': 'series-dialog'
        });

        await dialog.afterClosed().subscribe(async result => {
            if (result) {
                switch (mode) {
                    case ('add'):
                        this.series.push(result);
                        break;
                    case ('update'):
                        this.series.map(chart => {
                            Object.keys(result).map(key => {
                                chart[key] = result[key];
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

    ngOnInit(): void { };

    ngOnDestroy(): void { };

}