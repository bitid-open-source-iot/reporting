import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { BloxCondition, BLOXCONDITION } from '@bitid/blox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'condition-editor',
    styleUrls: ['./editor.dialog.scss'],
    templateUrl: './editor.dialog.html',
    encapsulation: ViewEncapsulation.None
})

export class ConditionEditorDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<ConditionEditorDialog>, @Inject(MAT_DIALOG_DATA) private condition: BLOXCONDITION, public devices: DevicesService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'fill': new FormGroup({
            'color': new FormControl('#000000', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'font': new FormGroup({
            'size': new FormControl(8, [Validators.required, Validators.min(8), Validators.max(48)]),
            'color': new FormControl('#FFFFFF', [Validators.required]),
            'family': new FormControl('Arial', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
            'vertical': new FormControl('center', [Validators.required]),
            'horizontal': new FormControl('center', [Validators.required])
        }),
        'stroke': new FormGroup({
            'width': new FormControl(0, [Validators.required, Validators.min(0), Validators.max(5)]),
            'style': new FormControl('solid', [Validators.required]),
            'color': new FormControl('#000000', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)])
        }),
        'banner': new FormGroup({
            'size': new FormControl(12, [Validators.required, Validators.min(8), Validators.max(24)]),
            'color': new FormControl('#FFFFFF', [Validators.required]),
            'family': new FormControl('Arial', [Validators.required]),
            'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
            'vertical': new FormControl('top', [Validators.required]),
            'horizontal': new FormControl('left', [Validators.required])
        }),
        'analog': new FormGroup({
            'min': new FormControl(null),
            'max': new FormControl(null)
        }),
        'digital': new FormGroup({
            'value': new FormControl(null)
        }),
        'type': new FormControl(null, [Validators.required]),
        'inputId': new FormControl(null, [Validators.required]),
        'deviceId': new FormControl(null, [Validators.required])
    });
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
            'color': '',
            'opacity': ''
        },
        'banner': {
            'size': '',
            'color': '',
            'family': '',
            'opacity': '',
            'vertical': '',
            'horizontal': ''
        },
        'analog': {
            'min': '',
            'max': ''
        },
        'digital': {
            'value': ''
        },
        'type': '',
        'inputId': '',
        'deviceId': ''
    };
    public filter: FormGroup = new FormGroup({
        'input': new FormControl(''),
        'device': new FormControl('')
    });
    public inputs: any[] = [];
    public digital: any = {
        'low': null,
        'high': null
    };
    private subscriptions: any = {};

    private set() {
        const condition = new BloxCondition(this.condition);
        Object.keys(this.form.controls).map(key => {
            if (this.form.controls[key] instanceof FormGroup) {
                Object.keys((<any>this.form.controls[key]).controls).map(sub => {
                    if (typeof(condition[key][sub]) != 'undefined' && condition[key][sub] !== null) {
                        (<any>this.form.controls[key]).controls[sub].setValue(condition[key][sub]);
                    };
                });
            } else if (this.form.controls[key] instanceof FormControl) {
                if (typeof(condition[key]) != 'undefined' && condition[key] !== null) {
                    this.form.controls[key].setValue(condition[key]);
                };
            };
        });
    };

    public close() {
        this.dialog.close();
    };

    public submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
        } else {
            this.dialog.close(this.form.value);
        };
    };

    private changetype(type) {
        (<FormGroup>this.form.controls['analog']).controls['min'].setValidators(null);
        (<FormGroup>this.form.controls['analog']).controls['min'].updateValueAndValidity();
        (<FormGroup>this.form.controls['analog']).controls['max'].setValidators(null);
        (<FormGroup>this.form.controls['analog']).controls['max'].updateValueAndValidity();
        (<FormGroup>this.form.controls['digital']).controls['value'].setValidators(null);
        (<FormGroup>this.form.controls['digital']).controls['value'].updateValueAndValidity();
        if (type == 'analog') {
            (<FormGroup>this.form.controls['analog']).controls['min'].setValidators([Validators.required]);
            (<FormGroup>this.form.controls['analog']).controls['min'].updateValueAndValidity();
            (<FormGroup>this.form.controls['analog']).controls['max'].setValidators([Validators.required]);
            (<FormGroup>this.form.controls['analog']).controls['max'].updateValueAndValidity();
        } else if (type == 'digital') {
            (<FormGroup>this.form.controls['digital']).controls['value'].setValidators([Validators.required]);
            (<FormGroup>this.form.controls['digital']).controls['value'].updateValueAndValidity();
        };
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.type = this.form.controls['type'].valueChanges.subscribe(type => this.changetype(type));

        this.subscriptions.inputId = this.form.controls['inputId'].valueChanges.subscribe(inputId => {
            for (let i = 0; i < this.inputs.length; i++) {
                if (this.inputs[i].inputId == inputId) {
                    if (this.inputs[i].type == 'digital') {
                        this.digital.low = this.inputs[i].digital.low;
                        this.digital.high = this.inputs[i].digital.high;
                    };
                    this.form.controls['type'].setValue(this.inputs[i].type);
                    break;
                };
            };
        });

        this.subscriptions.deviceId = this.form.controls['deviceId'].valueChanges.subscribe(deviceId => {
            for (let i = 0; i < this.devices.data.length; i++) {
                if (this.devices.data[i].deviceId == deviceId) {
                    this.inputs = this.devices.data[i].inputs;
                    this.inputs.map(input => {
                        if (input.inputId == this.form.value.inputId) {
                            if (input.type == 'digital') {
                                this.digital.low = input.digital.low;
                                this.digital.high = input.digital.high;
                            };
                            this.form.controls['type'].setValue(input.type);
                        };
                    });
                    break;
                };
            };
        });
    
        this.set();
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.type.unsubscribe();
        this.subscriptions.inputId.unsubscribe();
        this.subscriptions.deviceId.unsubscribe();
    };

}