import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { OnInit, Component, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-row-dialog',
    styleUrls: ['./add-row.dialog.scss'],
    templateUrl: './add-row.dialog.html'
})

export class AddRowDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<AddRowDialog>, @Inject(MAT_DIALOG_DATA) private layout: any, private formerror: FormErrorService) { };

    public min: number = 1;
    public max: number = 8;
    public form: FormGroup = new FormGroup({
        'columns': new FormControl(1, [Validators.required, Validators.min(1), Validators.max(8)])
    });
    public errors: any = {
        'columns': ''
    };
    private subscriptions: any = {};

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value.columns);
    };

    private process() {
        switch(this.layout) {
            case('mobile'):
                this.max = 2;
                this.form.controls['columns'].setValue(1);
                this.form.controls['columns'].setValidators([Validators.required, Validators.min(1), Validators.max(2)]);
                break;
            case('tablet'):
                this.max = 5;
                this.form.controls['columns'].setValue(3);
                this.form.controls['columns'].setValidators([Validators.required, Validators.min(1), Validators.max(5)]);
                break;
            case('desktop'):
                this.max = 8;
                this.form.controls['columns'].setValue(5);
                this.form.controls['columns'].setValidators([Validators.required, Validators.min(1), Validators.max(8)]);
                break;
        };
        this.form.controls['columns'].updateValueAndValidity();
    }

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
        
        this.process();
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}