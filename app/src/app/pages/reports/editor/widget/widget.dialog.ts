import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast/toast.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-widget-dialog',
    styleUrls: ['./widget.dialog.scss'],
    templateUrl: './widget.dialog.html'
})

export class WidgetDialog implements OnInit, OnDestroy {

    constructor(private toast: ToastService, private dialog: MatDialogRef<WidgetDialog>, @Inject(MAT_DIALOG_DATA) private config: any, private formerror: FormErrorService, private localstorage: LocalstorageService) { };

    public form: FormGroup = new FormGroup({
        'map': new FormGroup({}),
        'text': new FormGroup({
            'value': new FormControl(this.config.text.value),
        }),
        'table': new FormGroup({}),
        'gauge': new FormGroup({}),
        'image': new FormGroup({
            'src': new FormControl(this.config.image.src),
        }),
        'label': new FormGroup({
            'value': new FormControl(this.config.label.value, [Validators.required]),
            'visable': new FormControl(this.config.label.visable, [Validators.required])
        }),
        'query': new FormGroup({
            'counter': new FormControl(this.config.query.counter),
            'inputId': new FormControl(this.config.query.inputId),
            'deviceId': new FormControl(this.config.query.deviceId)
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
        'connectorId': new FormControl('000000000000000000000001', [Validators.required])
    });
    public errors: any = {
        'map': {},
        'text': {
            'value': ''
        },
        'image': {
            'src': ''
        },
        'table': {},
        'gauge': {},
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
    public uploading: boolean;
    public conditions: any[] = this.config.conditions;
    private subscriptions: any = {};

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value);
    };

    public async upload() {
        const input = document.createElement('input');
        input.min = '1';
        input.max = '1';
        input.type = 'file';
        input.accept = 'image/*';
        input.click();
        input.onchange = async (event: any) => {
            this.uploading = true;
            const url = [environment.drive, '/drive/files/upload?email=', this.localstorage.get('email'), '&appId=', environment.appId].join('');
            const form = new FormData();
            const request = new XMLHttpRequest();

            for (var i = 0; i < event.target.files.length; i++) {
                form.append("uploads[]", event.target.files[i], event.target.files[i].name);
            };

            request.onreadystatechange = (event) => {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        const response = JSON.parse(request.response);
                        const image: FormGroup = <any>this.form.controls['image'];
                        image.controls['src'].setValue([environment.drive, '/drive/files/get?fileId=', response.fileId, "&token=", response.token].join(''));
                        this.uploading = false;
                    } else {
                        this.toast.error('issue uploading image!');
                        this.uploading = false;
                    };
                };
            };

            request.open("POST", url, true);
            request.setRequestHeader('Authorization', this.localstorage.get('token'));
            request.send(form);
        };
    };

    private async SetupTypeForm() {
        const text: FormGroup = <any>this.form.controls['text'];
        text.controls['value'].setValidators(null);
        text.controls['value'].updateValueAndValidity();

        const chart: FormGroup = <any>this.form.controls['chart'];
        chart.controls['type'].setValidators(null);
        chart.controls['type'].updateValueAndValidity();
        
        const value: FormGroup = <any>this.form.controls['value'];
        value.controls['expression'].setValidators(null);
        value.controls['expression'].updateValueAndValidity();
        
        const query: FormGroup = <any>this.form.controls['query'];
        query.controls['counter'].setValidators(null);
        query.controls['counter'].updateValueAndValidity();
        query.controls['inputId'].setValidators(null);
        query.controls['inputId'].updateValueAndValidity();
        query.controls['deviceId'].setValidators(null);
        query.controls['deviceId'].updateValueAndValidity();
        
        const image: FormGroup = <any>this.form.controls['image'];
        image.controls['src'].setValidators(null);
        image.controls['src'].updateValueAndValidity();

        switch(this.form.value.type) {
            case('map'):
                break;
            case('text'):
                text.controls['value'].setValidators([Validators.required]);
                text.controls['value'].updateValueAndValidity();
                break;
            case('gauge'):
                break;
            case('image'):
                image.controls['src'].setValidators([Validators.required]);
                image.controls['src'].updateValueAndValidity();
                break;
            case('chart'):
                chart.controls['type'].setValidators([Validators.required]);
                chart.controls['type'].updateValueAndValidity();
                chart.controls['color'].setValidators([Validators.required]);
                chart.controls['color'].updateValueAndValidity();

                query.controls['counter'].setValidators([Validators.required]);
                query.controls['counter'].updateValueAndValidity();
                query.controls['inputId'].setValidators([Validators.required]);
                query.controls['inputId'].updateValueAndValidity();
                query.controls['deviceId'].setValidators([Validators.required]);
                query.controls['deviceId'].updateValueAndValidity();
                break;
            case('table'):
                break;
            case('value'):
                value.controls['color'].setValidators([Validators.required]);
                value.controls['color'].updateValueAndValidity();
                value.controls['expression'].setValidators([Validators.required]);
                value.controls['expression'].updateValueAndValidity();

                query.controls['counter'].setValidators([Validators.required]);
                query.controls['counter'].updateValueAndValidity();
                query.controls['inputId'].setValidators([Validators.required]);
                query.controls['inputId'].updateValueAndValidity();
                query.controls['deviceId'].setValidators([Validators.required]);
                query.controls['deviceId'].updateValueAndValidity();
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