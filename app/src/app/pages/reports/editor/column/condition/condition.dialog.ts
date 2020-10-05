import { Theme } from 'src/app/interfaces/theme';
import { Condition } from 'src/app/interfaces/condition';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-condition-dialog',
    styleUrls: ['./condition.dialog.scss'],
    templateUrl: './condition.dialog.html'
})

export class ConditionDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<ConditionDialog>, @Inject(MAT_DIALOG_DATA) private condition: DialogParams, public devices: DevicesService, public reports: ReportsService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'fill': new FormGroup({
            'color': new FormControl(this.condition.fill.color, [Validators.required]),
            'opacity': new FormControl(this.condition.fill.opacity, [Validators.required])
        }),
        'font': new FormGroup({
            'size': new FormControl(this.condition.font.size, [Validators.required]),
            'color': new FormControl(this.condition.font.color, [Validators.required]),
            'family': new FormControl(this.condition.font.family, [Validators.required]),
            'opacity': new FormControl(this.condition.font.opacity, [Validators.required]),
            'vertical': new FormControl(this.condition.font.vertical, [Validators.required]),
            'horizontal': new FormControl(this.condition.font.horizontal, [Validators.required])
        }),
        'stroke': new FormGroup({
            'width': new FormControl(this.condition.stroke.width, [Validators.required]),
            'style': new FormControl(this.condition.stroke.style, [Validators.required]),
            'color': new FormControl(this.condition.stroke.color, [Validators.required]),
            'opacity': new FormControl(this.condition.stroke.opacity, [Validators.required])
        }),
        'banner': new FormGroup({
            'size': new FormControl(this.condition.banner.size, [Validators.required]),
            'color': new FormControl(this.condition.banner.color, [Validators.required]),
            'family': new FormControl(this.condition.banner.family, [Validators.required]),
            'opacity': new FormControl(this.condition.banner.opacity, [Validators.required]),
            'vertical': new FormControl(this.condition.banner.vertical, [Validators.required]),
            'horizontal': new FormControl(this.condition.banner.horizontal, [Validators.required])
        }),
        'chartfill': new FormGroup({
            'color': new FormControl(this.condition.chartfill.color, [Validators.required]),
            'opacity': new FormControl(this.condition.chartfill.opacity, [Validators.required])
        }),
        'gridlines': new FormGroup({
            'width': new FormControl(this.condition.gridlines.width, [Validators.required]),
            'style': new FormControl(this.condition.gridlines.style, [Validators.required]),
            'color': new FormControl(this.condition.gridlines.color, [Validators.required]),
            'opacity': new FormControl(this.condition.gridlines.opacity, [Validators.required])
        }),
        'connector': new FormGroup({
            'analog': new FormGroup({
                'min': new FormControl(this.condition.connector.analog.min, [Validators.required]),
                'max': new FormControl(this.condition.connector.analog.max, [Validators.required]),
                'units': new FormControl(this.condition.connector.analog.units, [Validators.required])
            }),
            'digital': new FormGroup({
                'low': new FormControl(this.condition.connector.digital.low, [Validators.required]),
                'high': new FormControl(this.condition.connector.digital.high, [Validators.required]),
                'value': new FormControl(this.condition.connector.digital.value, [Validators.required])
            }),
            'type': new FormControl(this.condition.connector.type, [Validators.required]),
            'inputId': new FormControl(this.condition.connector.inputId, [Validators.required]),
            'deviceId': new FormControl(this.condition.connector.deviceId, [Validators.required])
        }),
        'type': new FormControl(this.condition.type, [Validators.required]),
        'conditionId': new FormControl(this.condition.conditionId, [Validators.required])
    });
    public chart: any = this.condition.chart;
    public image: any = this.condition.image;
    public theme: Theme = this.reports.theme.value;
    public fonts: string[] = ['Arial']
    public errors: any = {
        'fill': {
            'color': '',
            'opacity': ''
        },
        'font': {
            'size': '',
            'color': '',
            'family': '',
            'opacity': '',
            'vertical': '',
            'horizontal': ''
        },
        'stroke': {
            'width': '',
            'style': '',
            'color': ''
        },
        'banner': {
            'size': '',
            'color': '',
            'family': '',
            'opacity': '',
            'vertical': '',
            'horizontal': ''
        },
        'gridlines': {
            'width': '',
            'style': '',
            'color': ''
        },
        'chartfill': {
            'color': '',
            'opacity': ''
        },
        'connector': {
            'analog': {
                'min': '',
                'max': '',
                'units': ''
            },
            'digital': {
                'low': '',
                'high': '',
                'value': ''
            },
            'inputId': '',
            'deviceId': ''
        },
        'type': '',
        'conditionId': ''
    };
    public filter: any = {
        'input': '',
        'device': ''
    };
    public inputs: any[] = [];
    public height: number = this.condition.height;
    public styles: string[] = ['solid', 'ridge', 'dotted', 'dashed', 'double', 'groove'];
    public display: string = this.condition.display;
    public loading: boolean;
    public baselines: string[] = ['top', 'middle', 'bottom'];
    public alignments: string[] = ['left', 'center', 'right'];
    private subscriptions: any = {};

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value);
    };

    private process() {
        const connector: FormGroup = <any>(<any>this.form.controls['connector']);
        connector.controls['type'].setValidators(null);
        connector.controls['type'].updateValueAndValidity();
        connector.controls['inputId'].setValidators(null);
        connector.controls['inputId'].updateValueAndValidity();
        connector.controls['deviceId'].setValidators(null);
        connector.controls['deviceId'].updateValueAndValidity();

        const analog: FormGroup = <any>(<any>connector).controls['analog'];
        analog.controls['min'].setValidators(null);
        analog.controls['min'].updateValueAndValidity();
        analog.controls['max'].setValidators(null);
        analog.controls['max'].updateValueAndValidity();
        analog.controls['units'].setValidators(null);
        analog.controls['units'].updateValueAndValidity();

        const digital: FormGroup = <any>(<any>connector).controls['digital'];
        digital.controls['low'].setValidators(null);
        digital.controls['low'].updateValueAndValidity();
        digital.controls['high'].setValidators(null);
        digital.controls['high'].updateValueAndValidity();
        digital.controls['value'].setValidators(null);
        digital.controls['value'].updateValueAndValidity();
        
        if (this.form.value.type == 'connector') {
            connector.controls['type'].setValidators([Validators.required]);
            connector.controls['type'].updateValueAndValidity();
            connector.controls['inputId'].setValidators([Validators.required]);
            connector.controls['inputId'].updateValueAndValidity();
            connector.controls['deviceId'].setValidators([Validators.required]);
            connector.controls['deviceId'].updateValueAndValidity();
            if (this.form.value.connector.type == 'analog') {
                analog.controls['min'].setValidators([Validators.required]);
                analog.controls['min'].updateValueAndValidity();
                analog.controls['max'].setValidators([Validators.required]);
                analog.controls['max'].updateValueAndValidity();
                analog.controls['units'].setValidators([Validators.required]);
                analog.controls['units'].updateValueAndValidity();
            } else if (this.form.value.connector.type == 'digital') {
                digital.controls['low'].setValidators([Validators.required]);
                digital.controls['low'].updateValueAndValidity();
                digital.controls['high'].setValidators([Validators.required]);
                digital.controls['high'].updateValueAndValidity();
                digital.controls['value'].setValidators([Validators.required]);
                digital.controls['value'].updateValueAndValidity();
            };
        };
    };

    private preview() {
        const min = 0;
        const max = 10;
        this.chart.data = [];
        for (let i = 1; i < 6; i++) {
            this.chart.data.push({
                'date': '2020/01/0' + i,
                'value': Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min)
            });
        }
    };

    private connectorchange() {
        const analog: FormGroup = <any>(<any>this.form.controls['connector']).controls['analog'];
        analog.controls['min'].setValidators(null);
        analog.controls['min'].updateValueAndValidity();
        analog.controls['max'].setValidators(null);
        analog.controls['max'].updateValueAndValidity();
        analog.controls['units'].setValidators(null);
        analog.controls['units'].updateValueAndValidity();
        
        const digital: FormGroup = <any>(<any>this.form.controls['connector']).controls['digital'];
        digital.controls['low'].setValidators(null);
        digital.controls['low'].updateValueAndValidity();
        digital.controls['high'].setValidators(null);
        digital.controls['high'].updateValueAndValidity();
        digital.controls['value'].setValidators(null);
        digital.controls['value'].updateValueAndValidity();

        if (this.form.value.connector.type == 'analog') {
            analog.controls['min'].setValidators([Validators.required]);
            analog.controls['min'].updateValueAndValidity();
            analog.controls['max'].setValidators([Validators.required]);
            analog.controls['max'].updateValueAndValidity();
            analog.controls['units'].setValidators([Validators.required]);
            analog.controls['units'].updateValueAndValidity();
        } else if (this.form.value.connector.type == 'digital') {
            digital.controls['low'].setValidators([Validators.required]);
            digital.controls['low'].updateValueAndValidity();
            digital.controls['high'].setValidators([Validators.required]);
            digital.controls['high'].updateValueAndValidity();
            digital.controls['value'].setValidators([Validators.required]);
            digital.controls['value'].updateValueAndValidity();
        };
    };

    public SetInputId(inputId) {
        const connector: FormGroup = <any>this.form.controls['connector'];
        connector.controls['inputId'].setValue(inputId);
    };

    public SetDeviceId(deviceId) {
        const connector: FormGroup = <any>this.form.controls['connector'];
        connector.controls['deviceId'].setValue(deviceId);
    };

    ngOnInit(): void {
        this.process();
        this.preview();
        this.connectorchange();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.type = this.form.controls['type'].valueChanges.subscribe(() => this.process());

        this.subscriptions.theme = this.reports.theme.subscribe(theme => {
            this.theme = theme;
        });

        this.subscriptions.inputId = (<any>this.form.controls['connector']).controls['inputId'].valueChanges.subscribe(inputId => {
            this.inputs.map(input => {
                if (input.inputId == inputId) {
                    (<any>this.form.controls['connector']).controls['type'].setValue(input.type);
                    if (input.type == 'analog') {
                        (<any>this.form.controls['connector']).controls['analog'].controls['units'].setValue(input.analog.units);
                    } else if (input.type == 'digital') {
                        (<any>this.form.controls['connector']).controls['digital'].controls['low'].setValue(input.digital.low);
                        (<any>this.form.controls['connector']).controls['digital'].controls['high'].setValue(input.digital.high);
                    };
                };
            });
        });

        this.subscriptions.deviceId = (<any>this.form.controls['connector']).controls['deviceId'].valueChanges.subscribe(deviceId => {
            for (let i = 0; i < this.devices.data.length; i++) {
                if (this.devices.data[i].deviceId == deviceId) {
                    this.inputs = this.devices.data[i].inputs;
                    break;
                };
            };
        });

        this.subscriptions.connector = (<any>this.form.controls['connector']).controls['type'].valueChanges.subscribe(() => this.connectorchange());

        if (this.form.value.connector.deviceId) {
            for (let a = 0; a < this.devices.data.length; a++) {
                if (this.devices.data[a].deviceId == this.form.value.connector.deviceId) {
                    this.inputs = this.devices.data[a].inputs;
                    for (let b = 0; b < this.devices.data[a].inputs.length; b++) {
                        if (this.devices.data[a].inputs[b].inputId == this.form.value.connector.inputId) {
                            (<any>this.form.controls['connector']).controls['type'].setValue(this.devices.data[a].inputs[b].type);
                            if (this.devices.data[a].inputs[b].type == 'analog') {
                                (<any>this.form.controls['connector']).controls['analog'].controls['units'].setValue(this.devices.data[a].inputs[b].analog.units);
                            } else if (this.devices.data[a].inputs[b].type == 'digital') {
                                (<any>this.form.controls['connector']).controls['digital'].controls['low'].setValue(this.devices.data[a].inputs[b].digital.low);
                                (<any>this.form.controls['connector']).controls['digital'].controls['high'].setValue(this.devices.data[a].inputs[b].digital.high);
                            };
                        };
                    }
                    break;
                };
            };
        };
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.type.unsubscribe();
        this.subscriptions.theme.unsubscribe();
        this.subscriptions.inputId.unsubscribe();
        this.subscriptions.deviceId.unsubscribe();
        this.subscriptions.connector.unsubscribe();
    };

}

interface DialogParams extends Condition {
    'chart'?: {
        'type'?: string;
        'data'?: any[];
    };
    'image'?: {
        'src'?: string;
    };
    'height'?: number;
    'display'?: string;
}