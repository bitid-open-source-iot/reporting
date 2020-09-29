import { Theme } from 'src/app/interfaces/theme';
import { Column } from 'src/app/interfaces/column';
import { ObjectId } from 'src/app/id';
import { Condition } from 'src/app/interfaces/condition';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ConditionDialog } from './condition/condition.dialog';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-column-dialog',
    styleUrls: ['./column.dialog.scss'],
    templateUrl: './column.dialog.html'
})

export class ColumnEditorDialog implements OnInit, OnDestroy {

    constructor(private toast: ToastService, private dialog: MatDialogRef<ColumnEditorDialog>, @Inject(MAT_DIALOG_DATA) private column: Column, public devices: DevicesService, private reports: ReportsService, private matdialog: MatDialog, private formerror: FormErrorService, private localstorage: LocalstorageService) { };

    public form: FormGroup = new FormGroup({
        'map': new FormGroup({}),
        'text': new FormGroup({
            'value': new FormControl(this.column.text.value),
        }),
        'table': new FormGroup({}),
        'gauge': new FormGroup({}),
        'image': new FormGroup({
            'src': new FormControl(this.column.image.src),
        }),
        'query': new FormGroup({
            'inputId': new FormControl(this.column.query.inputId),
            'deviceId': new FormControl(null)
        }),
        'chart': new FormGroup({
            'type': new FormControl(this.column.chart.type)
        }),
        'value': new FormGroup({
            'expression': new FormControl(this.column.value.expression)
        }),
        'label': new FormControl(this.column.label, [Validators.required]),
        'display': new FormControl(this.column.display, [Validators.required]),
        'columnId': new FormControl(this.column.columnId, [Validators.required]),
        'conditions': new FormControl(this.column.conditions, [Validators.required])
    });
    public theme: Theme = this.reports.theme.value;
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
        'query': {
            'inputId': '',
            'deviceId': ''
        },
        'chart': {
            'type': ''
        },
        'value': {
            'expression': ''
        },
        'label': '',
        'display': '',
        'columnId': ''
    };
    public inputs: any[] = [];
    public loading: boolean;
    public displays: string[] = [
        'chart',
        // 'gauge',
        'image',
        // 'map',
        // 'table',
        'text',
        'value'
    ];
    public uploading: boolean;
    private subscriptions: any = {};

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value);
    };

    private process() {
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
        query.controls['inputId'].setValidators(null);
        query.controls['inputId'].updateValueAndValidity();
        query.controls['deviceId'].setValidators(null);
        query.controls['deviceId'].updateValueAndValidity();
        
        const image: FormGroup = <any>this.form.controls['image'];
        image.controls['src'].setValidators(null);
        image.controls['src'].updateValueAndValidity();

        switch(this.form.value.display) {
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

                query.controls['inputId'].setValidators([Validators.required]);
                query.controls['inputId'].updateValueAndValidity();
                query.controls['deviceId'].setValidators([Validators.required]);
                query.controls['deviceId'].updateValueAndValidity();
                break;
            case('table'):
                break;
            case('value'):
                value.controls['expression'].setValidators([Validators.required]);
                value.controls['expression'].updateValueAndValidity();

                query.controls['inputId'].setValidators([Validators.required]);
                query.controls['inputId'].updateValueAndValidity();
                query.controls['deviceId'].setValidators([Validators.required]);
                query.controls['deviceId'].updateValueAndValidity();
                break;
        };
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
            const url = [environment.drive, '/drive/files/uploademail=', this.localstorage.get('email'), '&appId=', environment.appId].join('');
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
                        image.controls['src'].setValue([environment.drive, '/drive/files/getfileId=', response.fileId, "&token=", response.token].join(''));
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

    public remove(condition: Condition) {
        const conditions = this.form.value.conditions;
        for (let i = 0; i < conditions.length; i++) {
            if (conditions[i].conditionId == condition.conditionId) {
                conditions.splice(i, 1);
                break;
            };
        };
        this.form.controls['conditions'].setValue(conditions);
    };

    public GetDeviceDescription(deviceId: string) {
        for (let i = 0; i < this.devices.data.length; i++) {
            if (this.devices.data[i].deviceId == deviceId) {
                return this.devices.data[i].description;
            };
        };
        return 'NA';
    };

    public async edit(mode: string, condition?: any) {
        if (mode == 'add') {
            condition = {
                'fill': {
                    'color': '#FFFFFF',
                    'opacity': 100
                },
                'font': {
                    'size': 30,
                    'color': '#000000',
                    'family': 'Arial',
                    'opacity': 100,
                    'vertical': 'center',
                    'horizontal': 'center'
                },
                'stroke': {
                    'width': 2,
                    'style': 'solid',
                    'color': '#000000',
                    'opacity': 100
                },
                'banner': {
                    'size': 14,
                    'color': '#000000',
                    'family': 'Arial',
                    'opacity': 100,
                    'vertical': 'top',
                    'horizontal': 'left'
                },
                'gridlines': {
                    'width': 1,
                    'style': 'solid',
                    'color': '#FFFFFF',
                    'opacity': 100
                },
                'chartfill': {
                    'color': '#000000',
                    'opacity': 100
                },
                'connector': {
                    'analog': {
                        'min': null,
                        'max': null,
                        'units': null
                    },
                    'digital': {
                        'value': null
                    },
                    'type': null,
                    'inputId': null,
                    'deviceId': null
                },
                'type': 'default',
                'conditionId': ObjectId()
            };
        };

        if (mode == 'copy') {
            condition = JSON.parse(JSON.stringify(condition));
            condition.conditionId = ObjectId();
            mode = 'add';
        };

        condition.display = this.form.value.display;

        const dialog = await this.matdialog.open(ConditionDialog, {
            'data': condition,
            'panelClass': 'fullscreen-dialog'
        });

        await dialog.afterClosed().subscribe(async result => {
            if (result) {
                const conditions = this.form.value.conditions;
                if (mode == 'add') {
                    conditions.push(result);
                } else if (mode == 'edit') {
                    conditions.map(o => {
                        if (o.conditionId == condition.conditionId) {
                            Object.keys(result).map(key => {
                                o[key] = result[key];
                            });
                        };
                    });
                };
                this.form.controls['conditions'].setValue(conditions);
            };
        });
    };

    public GetDeviceInputDescription(deviceId: string, inputId: string) {
        for (let a = 0; a < this.devices.data.length; a++) {
            if (this.devices.data[a].deviceId == deviceId) {
                for (let b = 0; b < this.devices.data[a].inputs.length; b++) {
                    if (this.devices.data[a].inputs[b].inputId == inputId) {
                        return this.devices.data[a].inputs[b].description;
                    };
                };
            };
        };
        return 'NA';
    };

    ngOnInit(): void {
        this.process();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.theme = this.reports.theme.subscribe(theme => {
            this.theme = theme;
        });

        this.subscriptions.inputId = (<any>this.form.controls['query']).controls['inputId'].valueChanges.subscribe(inputId => {
            this.inputs.map(input => {
                if (input.inputId == inputId && (typeof(this.form.value.label) == 'undefined' || this.form.value.label == null || this.form.value.label == '')) {
                    this.form.controls['label'].setValue(input.description);
                };
            });
        });

        this.subscriptions.display = this.form.controls['display'].valueChanges.subscribe(display => this.process());

        this.subscriptions.deviceId = (<any>this.form.controls['query']).controls['deviceId'].valueChanges.subscribe(deviceId => {
            for (let i = 0; i < this.devices.data.length; i++) {
                if (this.devices.data[i].deviceId == deviceId) {
                    this.inputs = this.devices.data[i].inputs;
                    break;
                };
            };
        });

        (<any>this.form.controls['query']).controls['deviceId'].setValue(this.column.query.deviceId);
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.theme.unsubscribe();
        this.subscriptions.inputId.unsubscribe();
        this.subscriptions.display.unsubscribe();
        this.subscriptions.deviceId.unsubscribe();
    };

}