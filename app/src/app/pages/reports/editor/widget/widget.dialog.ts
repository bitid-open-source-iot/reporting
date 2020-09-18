import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-widget-dialog',
    styleUrls: ['./widget.dialog.scss'],
    templateUrl: './widget.dialog.html'
})

export class WidgetDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<WidgetDialog>, @Inject(MAT_DIALOG_DATA) private config: any, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'label': new FormGroup({
            'value': new FormControl(this.config.label.value, [Validators.required]),
            'visable': new FormControl(this.config.label.visable, [Validators.required])
        }),
        'query': new FormGroup({
            'counter': new FormControl(this.config.query.counter, [Validators.required]),
            'inputId': new FormControl(this.config.query['inputId'], [Validators.required]),
            'deviceId': new FormControl(this.config.query.deviceId, [Validators.required])
        }),
        'chart': new FormGroup({
            'type': new FormControl(this.config.chart.type),
            'color': new FormControl(this.config.chart.color)
        }),
        'value': new FormGroup({
            'color': new FormControl(this.config.chart.color),
            'expression': new FormControl(this.config.value.expression)
        }),
        'type': new FormControl(this.config.type, [Validators.required]),
        'widgetId': new FormControl(this.config.widgetId, [Validators.required]),
        'connectorId': new FormControl(this.config.connectorId, [Validators.required])
    });
    public errors: any = {
        'label': {
            'value': '',
            'visable': ''
        },
        'query': {
            'counter': '',
            'inputId': '',
            'deviceId': ''
        },
        'chart': {
            'type': '',
            'color': ''
        },
        'value': {
            'color': '',
            'expression': ''
        },
        'type': '',
        'widgetId': '',
        'connectorId': ''
    };
    public inputs: any[] = [];
    public loading: boolean;
    public devices: any[] = this.config.devices;
    public connectors: any[] = this.config.connectors;
    private subscriptions: any = {};

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value);
    };

    private async SetupTypeForm() {
        const chart: FormGroup = <any>this.form.controls['chart'];
        chart.controls['type'].setValidators(null);
        chart.controls['type'].updateValueAndValidity();
        
        const value: FormGroup = <any>this.form.controls['value'];
        value.controls['expression'].setValidators(null);
        value.controls['expression'].updateValueAndValidity();

        switch(this.form.value.type) {
            case('map'):
                break;
            case('chart'):
                chart.controls['type'].setValidators([Validators.required]);
                chart.controls['type'].updateValueAndValidity();
                chart.controls['color'].setValidators([Validators.required]);
                chart.controls['color'].updateValueAndValidity();
                break;
            case('table'):
                break;
            case('value'):
                value.controls['color'].setValidators([Validators.required]);
                value.controls['color'].updateValueAndValidity();
                value.controls['expression'].setValidators([Validators.required]);
                value.controls['expression'].updateValueAndValidity();
                break;
        };
    };

    ngOnInit(): void {
        this.SetupTypeForm();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.type = this.form.controls['type'].valueChanges.subscribe(type => {
            this.SetupTypeForm();
        });

        this.subscriptions.inputId = (<any>this.form.controls['query']).controls['inputId'].valueChanges.subscribe(inputId => {
            this.inputs.map(input => {
                if (input.inputId == inputId && (typeof(this.form.value.label.value) == 'undefined' || this.form.value.label.value == null || this.form.value.label.value == '')) {
                    (<any>this.form.controls['label']).controls['value'].setValue(input.description);
                };
            });
        });

        this.subscriptions.deviceId = (<any>this.form.controls['query']).controls['deviceId'].valueChanges.subscribe(deviceId => {
            for (let i = 0; i < this.devices.length; i++) {
                if (this.devices[i].deviceId == deviceId) {
                    this.inputs = this.devices[i].inputs;
                    break;
                };
            };
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.type.unsubscribe();
        this.subscriptions.inputId.unsubscribe();
        this.subscriptions.deviceId.unsubscribe();
    };

}