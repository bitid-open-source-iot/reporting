import { MatSidenav } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { ConditionsComponent } from './conditions/conditions.component';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';

@Component({
    selector: 'report-editor-page',
    styleUrls: ['./editor.page.scss'],
    templateUrl: './editor.page.html'
})

export class ReportEditorPage implements OnInit, OnDestroy {

    @ViewChild(MatSidenav, {'static': true}) public sidenav: MatSidenav;
    @ViewChild(ConditionsComponent, {'static': true}) private conditions: ConditionsComponent;

    constructor(private toast: ToastService, public devices: DevicesService, private localstorage: LocalstorageService) { };

    public form: FormGroup = new FormGroup({
        'map': new FormGroup({}),
        'text': new FormGroup({
            'value': new FormControl(null)
        }),
        'table': new FormGroup({}),
        'gauge': new FormGroup({}),
        'image': new FormGroup({
            'src': new FormControl(null)
        }),
        'query': new FormGroup({
            'inputId': new FormControl(null),
            'deviceId': new FormControl(null)
        }),
        'chart': new FormGroup({
            'type': new FormControl(null)
        }),
        'value': new FormGroup({
            'expression': new FormControl(null)
        }),
        'label': new FormControl(null, [Validators.required]),
        'display': new FormControl(null, [Validators.required]),
        'columnId': new FormControl(null, [Validators.required]),
        'conditions': new FormControl(null, [Validators.required])
    });
    public filter: FormGroup = new FormGroup({
        'input': new FormControl(null),
        'device': new FormControl(null)
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
    public layout: string = 'desktop';
    public loading: boolean;
    public displays: any[] = [
        {
            'value': 'chart',
            'description': 'Chart'
        },
        // {
        //     'value': 'gauge',
        //     'description': 'Gauge'
        // },
        {
            'value': 'image',
            'description': 'Image'
        },
        // {
        //     'value': 'map',
        //     'description': 'Map'
        // },
        // {
        //     'value': 'table',
        //     'description': 'Table'
        // },
        {
            'value': 'text',
            'description': 'Text'
        },
        {
            'value': 'value',
            'description': 'Value'
        },
        {
            'value': 'spacer',
            'description': 'Spacer'
        }
    ];
    public uploading: boolean;
    private subscriptions: any = {};

    private async load() {
        this.loading = true;
        
        const devices = await this.devices.list({
            'filter': [
                'role',
                'inputs',
                'deviceId',
                'description'
            ],
            'sort': {
                'description': 1
            }
        });

        if (devices.ok) {
            this.devices.data = devices.result;
        } else {
            this.devices.data = [];
        };
        
        this.loading = false;
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

    ngOnInit(): void {
        this.subscriptions.deviceId = (<FormGroup>this.form.controls['query']).controls['deviceId'].valueChanges.subscribe(deviceId => {
            for (let i = 0; i < this.devices.data.length; i++) {
                if (this.devices.data[i].deviceId == deviceId) {
                    this.inputs = this.devices.data[i].inputs;
                    break;
                };
            };
        });

        this.load();
        this.conditions.toggle();
    };

    ngOnDestroy(): void {
        this.subscriptions.deviceId.unsubscribe();
    };

}