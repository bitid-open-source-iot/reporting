import { MatDialogRef } from '@angular/material/dialog';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-add-row-dialog',
    styleUrls: ['./add-row.dialog.scss'],
    templateUrl: './add-row.dialog.html'
})

export class AddRowDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<AddRowDialog>, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'columns': new FormControl(4, [Validators.required, Validators.min(1), Validators.max(8)])
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

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}