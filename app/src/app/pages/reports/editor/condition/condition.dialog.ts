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

    constructor(private dialog: MatDialogRef<ConditionDialog>, @Inject(MAT_DIALOG_DATA) private condition: Condition, public devices: DevicesService, public reports: ReportsService, private formerror: FormErrorService) { };

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
            'opacity': new FormControl(this.condition.font.opacity, [Validators.required])
        }),
        'banner': new FormGroup({
            'size': new FormControl(this.condition.banner.size, [Validators.required]),
            'color': new FormControl(this.condition.banner.color, [Validators.required]),
            'family': new FormControl(this.condition.banner.family, [Validators.required]),
            'opacity': new FormControl(this.condition.banner.opacity, [Validators.required]),
            'vertical': new FormControl(this.condition.banner.vertical, [Validators.required]),
            'horizontal': new FormControl(this.condition.banner.horizontal, [Validators.required])
        }),
        'connector': new FormGroup({
            'analog': new FormGroup({
                'min': new FormControl(this.condition.connector.analog.min, [Validators.required]),
                'max': new FormControl(this.condition.connector.analog.max, [Validators.required])
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
        'conditionId': new FormControl(this.condition.conditionId, [Validators.required])
    });
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
        'connector': {
            'analog': {
                'min': '',
                'max': ''
            },
            'digital': {
                'low': '',
                'high': '',
                'value': ''
            },
            'inputId': '',
            'deviceId': ''
        },
        'conditionId': ''
    };
    public inputs: any[] = [];
    public styles: string[] = ['solid', 'ridge', 'dotted', 'dashed', 'double', 'groove'];
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
        const analog: FormGroup = <any>(<any>this.form.controls['connector']).controls['analog'];
        analog.controls['min'].setValidators(null);
        analog.controls['min'].updateValueAndValidity();
        analog.controls['max'].setValidators(null);
        analog.controls['max'].updateValueAndValidity();
        
        const digital: FormGroup = <any>(<any>this.form.controls['connector']).controls['digital'];
        digital.controls['value'].setValidators(null);
        digital.controls['value'].updateValueAndValidity();

        if (this.form.value.connector.type == 'analog') {
            analog.controls['min'].setValidators([Validators.required]);
            analog.controls['min'].updateValueAndValidity();
            analog.controls['max'].setValidators([Validators.required]);
            analog.controls['max'].updateValueAndValidity();
        } else if (this.form.value.connector.type == 'digital') {
            digital.controls['value'].setValidators([Validators.required]);
            digital.controls['value'].updateValueAndValidity();
        };
    };

    ngOnInit(): void {
        this.process();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.type = (<any>this.form.controls['connector']).controls['type'].valueChanges.subscribe(() => this.process());

        this.subscriptions.theme = this.reports.theme.subscribe(theme => {
            this.theme = theme;
        });

        this.subscriptions.inputId = (<any>this.form.controls['connector']).controls['inputId'].valueChanges.subscribe(inputId => {
            this.inputs.map(input => {
                if (input.inputId == inputId) {
                    (<any>this.form.controls['connector']).controls['type'].setValue(input.type);
                    if (input.type == 'digital') {
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
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.type.unsubscribe();
        this.subscriptions.theme.unsubscribe();
        this.subscriptions.inputId.unsubscribe();
        this.subscriptions.deviceId.unsubscribe();
    };

}