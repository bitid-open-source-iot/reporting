import * as moment from 'moment';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Inject, OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-custom-dates-dialog',
    styleUrls: ['./custom-dates.dialog.scss'],
    templateUrl: './custom-dates.dialog.html'
})

export class CustomDatesDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<CustomDatesDialog>, @Inject(MAT_DIALOG_DATA) private config: any, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'to': new FormControl(moment(this.config.to).format('YYYY-MM-DDTHH:mm'), [Validators.required]),
        'from': new FormControl(moment(this.config.from).format('YYYY-MM-DDTHH:mm'), [Validators.required])
    });
    public errors: any = {
        'to': '',
        'from': ''
    };
    private subscriptions: any = {};

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close(this.form.value);
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