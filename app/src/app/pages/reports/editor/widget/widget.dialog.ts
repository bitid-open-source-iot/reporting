import { Widget } from 'src/app/interfaces/report';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { ConnectorsService } from 'src/app/services/connectors/connectors.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-widget-dialog',
    styleUrls: ['./widget.dialog.scss'],
    templateUrl: './widget.dialog.html'
})

export class WidgetDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<WidgetDialog>, @Inject(MAT_DIALOG_DATA) private widget: Widget, public devices: DevicesService, public connectors: ConnectorsService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'label': new FormGroup({
            'value': new FormControl(this.widget.label.value, [Validators.required]),
            'visable': new FormControl(this.widget.label.visable, [Validators.required])
        }),
        'query': new FormGroup({
            'range': new FormControl(this.widget.query.range, [Validators.required]),
            'inputId': new FormControl(this.widget.query['inputId'], [Validators.required]),
            'deviceId': new FormControl(this.widget.query.deviceId, [Validators.required])
        }),
        'chart': new FormGroup({
            'type': new FormControl(this.widget.chart.type)
        }),
        'value': new FormGroup({
            'expression': new FormControl(this.widget.value.expression)
        }),
        'type': new FormControl(this.widget.type, [Validators.required]),
        'widgetId': new FormControl(this.widget.widgetId, [Validators.required]),
        'connectorId': new FormControl(this.widget.connectorId, [Validators.required])
    });
    public errors: any = {
        'label': {
            'value': '',
            'visable': ''
        },
        'query': {
            'range': '',
            'inputId': '',
            'deviceId': ''
        },
        'chart': {
            'type': ''
        },
        'value': {
            'expression': ''
        },
        'type': '',
        'widgetId': '',
        'connectorId': ''
    };
    public inputs: any[] = [];
    public loading: boolean;
    private subscriptions: any = {};

    public async load() {
        this.loading = true;

        this.form.disable();

        const devices = await this.devices.list({
            'filter': [
                'inputs',
                'deviceId',
                'description'
            ]
        });
        if (devices.ok) {
            this.devices.data = devices.result;
        } else {
            this.devices.data = [];
        };

        const connectors = await this.connectors.list({});
        if (connectors.ok) {
            this.connectors.data = connectors.result;
        } else {
            this.connectors.data = [];
        };

        this.form.enable();

        this.loading = false;
    };

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
                break;
            case('table'):
                break;
            case('value'):
                value.controls['expression'].setValidators([Validators.required]);
                value.controls['expression'].updateValueAndValidity();
                break;
        };
    };

    ngOnInit(): void {
        this.load();

        this.SetupTypeForm();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.type = this.form.controls['type'].valueChanges.subscribe(type => {
            this.SetupTypeForm();
        });

        const form: FormGroup = <any>this.form.controls['query'];
        this.subscriptions.deviceId = form.controls['deviceId'].valueChanges.subscribe(deviceId => {
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
        this.subscriptions.deviceId.unsubscribe();
    };

}