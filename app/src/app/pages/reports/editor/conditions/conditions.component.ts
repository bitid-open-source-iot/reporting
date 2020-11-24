import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ConditionEditorDialog } from './editor/editor.dialog';
import { Component, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'column-conditions',
    styleUrls: ['./conditions.component.scss'],
    templateUrl: './conditions.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ColumnConditionsComponent {

    constructor(private dialog: MatDialog, public devices: DevicesService, private el: ElementRef) {
        this.element = this.el.nativeElement;
    };

    public style: EventEmitter<any> = new EventEmitter<any>();
    public change: EventEmitter<any> = new EventEmitter<any>();
    public preview: EventEmitter<any> = new EventEmitter<any>();
    public element: HTMLElement;
    public conditions: any[] = [];

    public async reset() {
        this.conditions = [];
    };

    public value(condition) {
        let value = '-';
        for (let a = 0; a < this.devices.data.length; a++) {
            const device = this.devices.data[a];
            if (condition.deviceId == device.deviceId) {
                for (let b = 0; b < device.inputs.length; b++) {
                    const input = device.inputs[b];
                    if (condition.inputId == input.inputId) {
                        if (input.type == 'analog') {
                            value = [condition.analog.min, input.analog.units, ' - ', condition.analog.max, input.analog.units].join('');
                        } else if (input.type == 'digital') {
                            value = condition.digital.value == 0 ? input.digital.low : input.digital.high;
                        };
                    };
                };
            };
        };
        return value;
    };

    public remove(condition) {
        for (let i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i].id == condition.id) {
                this.conditions.splice(i, 1);
                break;
            };
        };
        this.change.emit({
            'conditions': this.conditions
        });
    };

    public async set(data) {
        if (Array.isArray(data.conditions)) {
            this.conditions = data.conditions;
        };
    };
    
    public async select(condition) {
        this.conditions.map(o => {
            if (condition.id == o.id && !o.selected) {
                o.selected = true;
                this.preview.next(condition);
            } else {
                o.selected = false;
                this.preview.next(false);
            };
        });
    };

    public async editor(mode: string, condition?: any) {
        if (mode == 'add') {
            condition = {
                'id': ObjectId(),
                'type': null,
                'color': '#000000',
                'inputId': null,
                'opacity': 100,
                'deviceId': null
            };
        } else if (mode == 'copy') {
            condition.id = ObjectId();
        };

        const dialog = await this.dialog.open(ConditionEditorDialog, {
            'data': condition,
            'panelClass': 'condition-dialog'
        });

        await dialog.afterClosed().subscribe(async result => {
            if (result) {
                switch (mode) {
                    case ('add'):
                    case ('copy'):
                        this.conditions.push(result);
                        break;
                    case ('update'):
                        this.conditions.map(condition => {
                            Object.keys(result).map(key => {
                                condition[key] = result[key];
                            });
                        });
                        break;
                };
                this.change.emit({
                    'conditions': this.conditions
                });
            };
        });
    };

}