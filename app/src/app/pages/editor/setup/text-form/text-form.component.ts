import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Input, OnInit, Component, OnDestroy, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'text-form',
    styleUrls: ['./text-form.component.scss'],
    templateUrl: './text-form.component.html',
    encapsulation: ViewEncapsulation.None
})

export class TextForm implements OnInit, OnDestroy {

    @Input('type') public type: string;

    constructor(public devices: DevicesService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'value': new FormControl(null, [Validators.required])
    });
    public errors: any = {
        'value': ''
    };
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
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}