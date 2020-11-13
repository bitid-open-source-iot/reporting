import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast/toast.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Component, OnDestroy, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'column-setup',
    styleUrls: ['./setup.component.scss'],
    templateUrl: './setup.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ColumnSetupComponent implements OnInit, OnDestroy {

    constructor(private el: ElementRef, private toast: ToastService, public devices: DevicesService, private formerror: FormErrorService, private localstorage: LocalstorageService) {
        this.element = this.el.nativeElement;
    };

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
        'display': new FormControl(null, [Validators.required])
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
        'display': ''
    };
    public inputs: any[] = [];
    public change: EventEmitter<any> = new EventEmitter<any>();
    public element: HTMLElement;
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
    public setting: boolean;
    public loading: boolean;
    public uploading: boolean;
    private subscriptions: any = {};

    public async set(data) {
        this.setting = true;
        Object.keys(this.form.controls).map(key => {
            if (this.form.controls[key] instanceof FormGroup) {
                Object.keys((<FormGroup>this.form.controls[key]).controls).map(sub => {
                    (<FormGroup>this.form.controls[key]).controls[sub].setValue(data[key][sub]);
                });
            } else if (this.form.controls[key] instanceof FormControl) {
                this.form.controls[key].setValue(data[key]);
            };
        });
        this.setting = false;
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
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
            if (!this.setting) {
                this.change.next(data);
            };
        });

        this.subscriptions.deviceId = (<FormGroup>this.form.controls['query']).controls['deviceId'].valueChanges.subscribe(deviceId => {
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
        this.subscriptions.deviceId.unsubscribe();
    };

}