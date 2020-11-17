import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Input, OnInit, Component, OnDestroy, EventEmitter } from '@angular/core';

@Component({
    selector: 'value-form',
    styleUrls: ['./value-form.component.scss'],
    templateUrl: './value-form.component.html'
})

export class ValueForm implements OnInit, OnDestroy {

    @Input('type') public type: string;

    constructor(public devices: DevicesService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'inputId': new FormControl(null, [Validators.required]),
        'deviceId': new FormControl(null, [Validators.required]),
        'expression': new FormControl(null, [Validators.required])
    });
    public errors: any = {
        'inputId': '',
        'deviceId': '',
        'expression': ''
    };
    public filter: FormGroup = new FormGroup({
        'input': new FormControl(''),
        'device': new FormControl('')
    });
    public inputs: any[] = [];
    public change: EventEmitter<any> = new EventEmitter<any>();
    public setting: boolean;
    public loading: boolean;
    private subscriptions: any = {};

    public async set(data) {
        this.setting = true;
        
        Object.keys(this.form.controls).map(key => this.form.controls[key].setValue(data[key]));
        
        this.setting = false;
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
            if (!this.setting) {
                this.change.next(data);
            };
        });

        this.subscriptions.deviceId = this.form.controls['deviceId'].valueChanges.subscribe(deviceId => {
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