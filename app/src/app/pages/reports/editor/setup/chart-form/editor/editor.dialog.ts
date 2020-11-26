import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'series-editor',
    styleUrls: ['./editor.dialog.scss'],
    templateUrl: './editor.dialog.html',
    encapsulation: ViewEncapsulation.None
})

export class SeriesEditorDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<SeriesEditorDialog>, @Inject(MAT_DIALOG_DATA) private data: any, public devices: DevicesService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'id': new FormControl(null, [Validators.required]),
        'type': new FormControl(null, [Validators.required]),
        'label': new FormControl(null, [Validators.required]),
        'color': new FormControl('#000000', [Validators.required]),
        'opacity': new FormControl(100, [Validators.required, Validators.min(0), Validators.max(100)]),
        'inputId': new FormControl(null, [Validators.required]),
        'deviceId': new FormControl(null, [Validators.required])
    });
    public errors: any = {
        'id': '',
        'type': '',
        'label': '',
        'color': '',
        'opacity': '',
        'inputId': '',
        'deviceId': ''
    };
    public filter: FormGroup = new FormGroup({
        'input': new FormControl(''),
        'device': new FormControl('')
    });
    public inputs: any[] = [];
    private subscriptions: any = {};

    private set() {
        Object.keys(this.form.controls).map(key => this.form.controls[key].setValue(this.data[key]));
    };

    public close() {
        this.dialog.close();
    };

    public submit() {
        this.dialog.close(this.form.value);
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.deviceId = this.form.controls['deviceId'].valueChanges.subscribe(deviceId => {
            for (let i = 0; i < this.devices.data.length; i++) {
                if (this.devices.data[i].deviceId == deviceId) {
                    this.inputs = this.devices.data[i].inputs;
                    break;
                };
            };
        });
    
        this.set();
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.deviceId.unsubscribe();
    };

}